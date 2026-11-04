import { auth, signOut } from "@/lib/auth";
import { Button } from "../ui/button";
import Link from "next/link";

export default async function SignOutForm() {
  const session = await auth();
  if (!session?.user) return null;
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button type="submit" variant={"destructive"}>
        Se déconnecter
      </Button>
    </form>
  );
}
