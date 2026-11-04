import * as z from "zod";

export const CredentialsSchema = z.object({
  user: z.string().min(1, "Minimum 1 charactère"),
  password: z.string().min(1, "Minimum 1 charactère"),
});

export type CredentialsProps = z.infer<typeof CredentialsSchema>;

export const checkCredentialsValidity = async (credentials: unknown) => {
  const isValidCredentials =
    await CredentialsSchema.safeParseAsync(credentials);
  if (!isValidCredentials.success) throw new Error("Données invalides");
  return isValidCredentials.data;
};
