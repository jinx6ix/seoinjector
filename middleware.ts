export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/api/sites/:path*", "/api/scan/:path*", "/api/keywords/:path*"],
}
