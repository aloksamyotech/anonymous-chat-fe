import { userStorageService } from "@/utils/indexDb";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/sign-up";
  const email = localStorage.getItem("secrete");
  const tokenData = await userStorageService.getUserData(email);
  console.log(`getToken`, tokenData?.loginToken);

  if (isPublicPath && tokenData) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublicPath && !tokenData) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
