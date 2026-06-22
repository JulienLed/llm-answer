import { auth } from "@/auth";

//proxy est égale à auth qui prends une fonction en paramètre
//Si la req n'est pas auth, et que le chemin n'est pas login, on créer l'URL de login, et on envoit la réponse avec redirect vers cette URL
export const proxy = auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newURL = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newURL);
  }
});
