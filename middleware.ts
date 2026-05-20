import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log("Middleware running for:", req.nextUrl.pathname);
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = { matcher: ["/", "/proposals/:path*", "/budget/:path*", "/leads/:path*", "/timelines/:path*", "/floorplans/:path*", "/ai-assistant/:path*"] };
