"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { getRegistrated } from "@/actions/session";

export default function RegistrationForm() {
  const [error, setError] = useState("");

  return (
    <Card>
      <CardContent>
        <form
          action={async (formData) => {
            const response = await getRegistrated(formData);
            if (!response.success) setError(response.data);
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
          <Button className="w-fit">S'enregistrer</Button>
          {error && <p>{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
