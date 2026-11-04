import { auth, signIn } from "@/lib/auth";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

export default async function SignInForm() {
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
    <Card>
      <CardContent>
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              ...Object.fromEntries(formData),
              redirectTo: "/",
            });
          }}
          className="flex flex-col items-center gap-5"
        >
          <Label className="grid grid-cols-2">
            Utiliateur
            <Input name="user" />
          </Label>
          <Label className="grid grid-cols-2">
            Mot de passe
            <Input name="password" type="password" />
          </Label>
          <Button className="w-fit">Se connecter</Button>
        </form>
      </CardContent>
      <CardFooter>
        <div
          id="not-registred"
          className="flex flex-col items-center m-auto gap-2"
        >
          <p>Pas encore de compte ?</p>
          <Button asChild variant={"outline"}>
            <Link href={"/registration"}>S'enregistrer</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
