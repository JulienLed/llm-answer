import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { checkCredentialsValidity } from "./zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        user: {
          type: "text",
          label: "User",
          placeholder: "user name",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        //Validation of credentials
        const { user, password } = await checkCredentialsValidity(credentials);

        const verifiedUser = await prisma.user.findFirst({
          where: {
            name: user,
          },
        });

        if (!verifiedUser) throw new Error("Ce compte n'existe pas");

        const isPassportValid = await bcrypt.compare(
          password,
          verifiedUser.password,
        );

        if (!isPassportValid) {
          throw new Error("Mot de passe invalide");
        } else {
          return verifiedUser;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
