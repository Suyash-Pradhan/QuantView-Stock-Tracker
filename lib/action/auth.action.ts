'use server';

import { headers } from "next/headers";
import { auth } from "../better-auth/auth";
import { inngest } from "../inngest/client";

export const signUpWithEmail = async ({
    fullName,
    email,
    password,
    country,
    investmentGoals,
    riskTolerance,
    preferredIndustry
}: SignUpFormData) => {
    try {
        const res = await auth.api.signUpEmail({
            body: {

                email,
                password,
                name: fullName
            }
        })
        if (res) {
            inngest.send({
                name: "app/user.created",
                data: {
                    email,
                    name: fullName,
                    country,
                    investmentGoals,
                    riskTolerance,
                    preferredIndustry

                }
            })
            return { success: true, message: "Sign up successful" };
        }
    } catch (error) {
        return { success: false, message: "Sign up failed" }
    }
}
export const signInWithEmail = async ({
    email,
    password
}: SignInFormData) => {
    try {
        const res = await auth.api.signInEmail({
            body: {

                email,
                password,
            }
        })

        return { success: true, message: "Sign up successful" };
    }
    catch (error) {
        console.log('Sign in failed', error)
        return { success: false, message: "Sign up failed" }
    }
}
export const signOut = async () => {
    try {
        await auth.api.signOut({ headers: await headers() });
    } catch (error) {
        console.error('Sign out failed', error);
        return { sucess: false, message: "Sign out failed" }
    }
}