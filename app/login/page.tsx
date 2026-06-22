"use client";
import { signIn } from "next-auth/react";

export default function Page() {
  return <button onClick={() => signIn()}>Sign In</button>;
}

//Ne fonctionne pas, rien ne se passe. Chercher à écrire la fonction signin en server compo
