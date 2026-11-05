"use client";

import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useActionState } from "react";
import { SignInVerification } from "@/actions/session";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export default function SignInForm() {
  const [error, formAction, isPending] = useActionState(
    async (prev: string | null, formData: FormData) => {
      const result = await SignInVerification(prev, formData);
      if (result) toast.error(result);
      return result;
    },
    null,
  );

  return (
    <Card>
      <CardContent>
        <form action={formAction} className="flex flex-col items-center gap-5">
          <Label className="grid grid-cols-2">
            Utiliateur
            <Input name="user" />
          </Label>
          <Label className="grid grid-cols-2">
            Mot de passe
            <Input name="password" type="password" />
          </Label>
          <Button className="w-fit">
            {isPending ? <Spinner /> : "Se connecter"}
          </Button>
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
