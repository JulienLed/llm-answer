import SignInForm from "@/components/authentification/SignInForm";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Page() {
  const session = await auth();
  if (session?.user)
    return (
      <div className="flex flex-col items-center gap-2">
        <p>Vous êtes déjà connecté. Revenir à l'accueil</p>
        <Button asChild variant={"outline"} className="w-fit">
          <Link href={"/"}>Accueil</Link>
        </Button>
      </div>
    );
  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <SignInForm />
    </div>
  );
}
