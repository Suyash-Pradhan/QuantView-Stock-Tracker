import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

/**
 * Enforces authentication for incoming requests, redirecting unauthenticated users to the sign-in page.
 *
 * @param request - The incoming Next.js request; used to read headers for session lookup and to construct a redirect URL when necessary
 * @returns A `NextResponse` that redirects to `/sign-in` if no session is found, or a response that continues processing the request otherwise
 */
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