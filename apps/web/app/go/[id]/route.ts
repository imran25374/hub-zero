import { after, type NextRequest } from "next/server";

import { clientIp } from "@/lib/click-context";
import { recordClick } from "@/lib/clicks";
import { findLink, getHub } from "@/lib/hub";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Outbound link redirect: /go/<link id> sends the visitor to the link's URL
 * and records the click after the response has gone out, so the visitor never
 * waits on the database.
 *
 * Amazon still sees this site as the referring site: a plain redirect keeps
 * the original page as the referrer, as the Associates rules require.
 */
export async function GET(request: NextRequest, context: RouteContext<"/go/[id]">) {
  const { id } = await context.params;
  const link = UUID.test(id) ? findLink(await getHub(), id) : undefined;

  if (!link) {
    return new Response("This link is not available.", {
      status: 404,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  }

  const headers = request.headers;
  const click = {
    linkId: link.id,
    ip: clientIp(headers),
    userAgent: headers.get("user-agent") ?? "",
    referer: headers.get("referer"),
    country: headers.get("x-vercel-ip-country"),
    requestUrl: request.url,
  };
  after(() => recordClick(click));

  return new Response(null, {
    status: 302,
    headers: {
      Location: link.url,
      "Cache-Control": "no-store",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
