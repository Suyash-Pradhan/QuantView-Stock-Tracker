import { text } from "stream/consumers";
import { inngest } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { sendWelcomeEmail } from "../nodemailer";
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
        
     }
)