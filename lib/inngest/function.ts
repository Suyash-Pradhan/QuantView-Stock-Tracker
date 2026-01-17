import { text } from "stream/consumers";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getAllUsersForNewsEmail } from "../action/user.action";
import { success } from "better-auth";
import { getWatchlistSymbolsByEmail } from "../action/watchlist.action";
import { getNews } from "../action/finnhub.actions";
import { NEWS_SUMMARY_EMAIL_TEMPLATE } from "../nodemailer/tamplate";
import { getFormattedTodayDate } from "../utils";
export const sendSignUpEmail = inngest.createFunction(
    { id: "sing-up-email" },
    { event: "app/user.created" },
    async ({ event, step }) => {
        const userprofile = `
        - Country: ${event.data.country}
        - Investment goals: ${event.data.investmentGoals}
        - Risk tolerance: ${event.data.riskTolerance}
        - Preferred industry: ${event.data.preferredIndustry}
        `
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{user_profile}}", userprofile);

        const response = await step.ai.infer("call-openai", {
            model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),

            body: {
                contents: [{
                    role: "user",
                    parts: [{ text: prompt }],
                }],
            },
        });
        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) || 'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

            return await sendWelcomeEmail({
                email: event.data.email,
                name: event.data.name,
                intro: introText,
            });
        })
        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    })

export const sendDailySummaryEmail = inngest.createFunction(
    { id: "daily-summary-email" },
    [{ event: 'app/user.daily-news' }, { cron: '0 12 * * *' }],
    async ({ step }) => {
        const users = await step.run('get-user', getAllUsersForNewsEmail)
        if (!users) {
            return { success: false, message: 'No users found' }
        }

        const result = await step.run('get-user-news', async () => {
            const perUser: Array<{ user: User, artical: MarketNewsArticle[] }> = []

            for (const user of users) {
                const symbols = await getWatchlistSymbolsByEmail(user.email)
                let artical = await getNews(symbols);

                artical = artical.slice(0, 6);
                if (artical.length === 0) {
                    artical = await getNews();
                    artical = artical.slice(0, 6);
                }
                perUser.push({ user, artical });
            }
            return perUser;
        })

        const userSummary: Array<{ user: User, NewsContent: string }> = [];
        for (const { user, artical } of result) {
            const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{news_content}}", JSON.stringify(artical, null, 2));

            const response = await step.ai.infer(`summarize-news-${user.email}`, {
                model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
                body: {
                    contents: [{ role: 'user', parts: [{ text: prompt }] }]
                }
            })
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const summaryText = (part && 'text' in part ? part.text : null) || 'News not available at the moment.'

            userSummary.push({ user, NewsContent: summaryText });
        }
        await step.run('send-news-email', async () => {
            for (const { user, NewsContent } of userSummary) {
                if (!NewsContent) {
                    return false;
                }
                return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), articles: NewsContent });
            }
            return {success: true,msg:'Daily summary emails sent successfully'}
        })
    }
)