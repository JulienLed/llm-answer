"use server";

import { prisma } from "@/lib/prisma";
import { CredentialsSchema } from "@/lib/zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

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
