import { NextResponse, type NextRequest } from "next/server";

import { createUserClient } from "@workspace/lib/supabase/user";

const SIGN_IN = "/planner/sign-in";

/**
 * Runs before every planner request: refreshes the Supabase session (pages
 * cannot write cookies, so this is where an expiring session is renewed) and
 * sends anyone who is not signed in to the sign-in page. The rest of the site
 * never reaches this code.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createUserClient({
    getAll: () => request.cookies.getAll(),
    setAll(cookies, headers) {
      for (const { name, value } of cookies) request.cookies.set(name, value);
      response = NextResponse.next({ request });
      for (const { name, value, options } of cookies) response.cookies.set(name, value, options);
      for (const [key, value] of Object.entries(headers ?? {})) response.headers.set(key, value);
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const onSignIn = request.nextUrl.pathname === SIGN_IN;

  if (signedIn === onSignIn) {
    const target = new URL(signedIn ? "/planner" : SIGN_IN, request.url);
    const redirect = NextResponse.redirect(target);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/planner", "/planner/:path*"],
};
