import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: "nodejs",
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)'] // Specify the routes the middleware applies to
};