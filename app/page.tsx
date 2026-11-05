"use client";

import { sendMessage } from "@/actions/sendMessage";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteConversation,
  getConversation,
  getMessages,
} from "@/actions/datas";
import { Message } from "./generated/prisma/client";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [llmResponse, setLlmResponse] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPendingMessages, startTransitionMessages] = useTransition();
  const [isPendingSend, startTransitionSend] = useTransition();
  const [isPendingDelete, startTransitionDelete] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startTransitionMessages(async () => {
      const conversation = await getConversation();
      if (!conversation.success) {
        toast.error(conversation.data);
        redirect("/login");
      } else {
        setMessages(await getMessages(conversation.data.id));
      }
    });
    setInput("");
  }, [llmResponse]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const handleOnClickSend = () => {
    startTransitionSend(async () => {
      const response = await sendMessage(input);
      if (!response.success) {
        toast.error(response.data);
        redirect("/login");
      } else {
        setLlmResponse(response.data);
      }
    });
  };

  const handleOnClickDelete = () => {
    startTransitionDelete(async () => {
      const response = await deleteConversation();
      if (response.success) {
        toast.info(response.data);
        redirect("/");
      }
    });
  };
  return (
    <div className="flex flex-col gap-5 mx-auto justify-center items-center w-[40%] h-200">
      <Card className="max-h-[50%] w-full">
        <CardContent className="overflow-y-scroll">
          <div className="flex flex-col">
            {messages.map((message, index) => {
              return message.role === "USER" ? (
                <Card
                  key={index}
                  className={"max-w-1/2 bg-mauve-200 self-start"}
                >
                  <CardContent>{message.content}</CardContent>
                </Card>
              ) : (
                <Card key={index} className="max-w-1/2 bg-blue-200 self-end">
                  <CardContent>{message.content}</CardContent>
                </Card>
              );
            })}
            <div ref={endRef} />
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            <Textarea
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleOnClickSend();
                }
              }}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              disabled={isPendingSend}
            />
            <div className="w-full flex justify-evenly">
              <Button onClick={handleOnClickSend}>
                {isPendingSend ? "Envoi..." : "Valider"}
              </Button>
              <Button variant={"destructive"} onClick={handleOnClickDelete}>
                {isPendingDelete ? <Spinner /> : "Supprimer la conversation"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
