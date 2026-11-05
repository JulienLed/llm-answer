"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CredentialsSchema } from "@/lib/zod";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export const SignInVerification = async (
  _prev: string | null,
  formData: FormData,
) => {
  try {
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirectTo: "/",
    });
    return null;
  } catch (error) {
    //Si l'erreur est une erreur AuthJs, on retourne une erreur sur le signin
    if (error instanceof AuthError) return "Identifiants invalides";
    //Si c'est une autre erreur, c'est l'erreur qy'utilise nextjs pour le redirect. Il faut throw l'error pour que la redirection fonctionne
    throw error;
  }
};

export const getRegistrated = async (formData: FormData) => {
  try {
    //Verification of data types
    const isValidCredentials = await CredentialsSchema.safeParseAsync(
      Object.fromEntries(formData),
    );
    if (!isValidCredentials.success)
      return {
        success: false,
        data: "Quelque chose s'est ma passé, veuillez recommencer",
      };
    const { user, password } = isValidCredentials.data;

    //Create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: user,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.log(error);
  }
  redirect("/");
};
