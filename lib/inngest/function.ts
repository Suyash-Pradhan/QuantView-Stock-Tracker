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
            const perUser: Array<{ user: User, articles: MarketNewsArticle[] }> = []

            for (const user of users) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email)
                    let articles = await getNews(symbols);

                    articles = articles.slice(0, 6);
                    if (articles.length === 0) {
                        articles = await getNews();
                        articles = articles.slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (error) {
                    console.error('daily-news: error preparing user news', user.email, error);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        })

        const userNewsSummary: Array<{ user: User, newsContent: string }> = [];
        for (const { user, articles } of result) {
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles, null, 2));

                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
                    body: {
                        contents: [{ role: 'user', parts: [{ text: prompt }] }]
                    }
                })
                const part = response.candidates?.[0]?.content?.parts?.[0];
                const summaryText = (part && 'text' in part ? part.text : null) || 'News not available at the moment.'

                userNewsSummary.push({ user, newsContent: summaryText });
            } catch (error) {
                console.error('Failed to summarize news for:', user.email, error);
                userNewsSummary.push({ user, newsContent: '' });
            }
        }
        await step.run('send-news-email', async () => {
            for (const { user, newsContent } of userNewsSummary) {
                if (!newsContent) {
                    continue;
                }
                await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), articles: newsContent });
            }
            return { success: true, msg: 'Daily summary emails sent successfully' }
        })
    }

)