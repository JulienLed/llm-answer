"use client";

import { sendMessage } from "@/actions/sendMessage";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getConversation, getMessages } from "@/actions/datas";
import { Message } from "./generated/prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPendingMessages, startTransitionMessages] = useTransition();
  const [isPendingSend, startTransitionSend] = useTransition();

  useEffect(() => {
    startTransitionMessages(async () => {
      const conversation = await getConversation();
      setMessages(await getMessages(conversation.id));
    });
    setInput("");
  }, [llmResponse]);

  const handleOnClick = () => {
    startTransitionSend(async () => {
      const response = await sendMessage(input);
      setLlmResponse(response);
    });
  };
  return (
    <div className="flex flex-col gap-5 mx-auto justify-center items-center w-[40%] h-200">
      <Card>
        <CardContent className="overflow-y-scroll">
          <div className="grid grid-cols-2">
            {messages.map((message, index) => {
              return message.role === "USER" ? (
                <p key={index} className="col-start-1">
                  {message.content}
                </p>
              ) : (
                <p key={index} className="pt-5 col-start-2">
                  {message.content}
                </p>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {isPendingMessages ? (
        <Spinner />
      ) : (
        <Card className="w-full">
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <Textarea
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleOnClick();
                  }
                }}
                onChange={(e) => setInput(e.target.value)}
                value={input}
                disabled={isPendingSend}
              />
              <Button onClick={handleOnClick}>
                {isPendingSend ? "Envoi..." : "Valider"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
