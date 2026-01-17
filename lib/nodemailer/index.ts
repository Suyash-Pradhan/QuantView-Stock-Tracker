import nodemailer from 'nodemailer';
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from './tamplate';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL!,
        pass: process.env.NODEMAILER_PASSWORD!,
    }
})
export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    const mailoption = {
        from: `"Signalist" ${process.env.NODEMAILER_EMAIL!}`,
        to: email,
        subject: 'Welcome to Signalist - your stock market toolkit is ready!',
        text: "thanks for joining Signalist",
        html: WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro).replaceAll("{{appUrl}}", process.env.NEXT_PUBLIC_APP_URL || "")
    }
    return transporter.sendMail(mailoption);
}

export const sendNewsSummaryEmail = async ({ email, date, articles }: { email: string; date: string; articles: string }) => {
    const mailoption = {
        from: `"Signalist" ${process.env.NODEMAILER_EMAIL!}`,
        to: email,
        subject: `Market News Summary Today-${date}`,
        text: 'Today Market News Summary',
        html: NEWS_SUMMARY_EMAIL_TEMPLATE.replace("{{date}}", date).replace("{{newsContent}}", articles)
    }
    await transporter.sendMail(mailoption);
}