import { Conversation, Message } from "@/app/generated/prisma/client";
import { getLlmMessage } from "./llm";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY_NEW,
});

//Construction du message à envoyer au LLM

export const mistralAPI = async (
  conversation: Conversation,
  messages: Message[],
) => {
  const content = getLlmMessage(conversation, messages);

  const response = await client.chat.complete({
    model: "ministral-14b-2512",
    messages: [{ role: "user", content: content }],
  });
  if (
    response.choices[0].message?.content?.length === 0 ||
    !response.choices[0].message?.content
  )
    return { success: false as const, data: "Erreur avec le LLM" };
  return {
    success: true,
    data: response.choices[0].message?.content.toString(),
  };
};
