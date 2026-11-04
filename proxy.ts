import { auth } from "@/lib/auth";

//proxy est égale à auth qui prends une fonction en paramètre
//Si la req n'est pas auth, et que le chemin n'est pas login, on créer l'URL de login, et on envoit la réponse avec redirect vers cette URL
export const proxy = auth((req) => {
  if (
    !req.auth &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/registration"
  ) {
    const newURL = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newURL);
  }
});

//Permet à tout ce qui n'est pas du html de passer sans session active.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
