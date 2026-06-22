import Groq from "groq-sdk";
import z from "zod";
import { Character, Message } from "@/app/generated/prisma/client";
import { Conversation } from "@/app/generated/prisma/client";
import { InstructionsLLM } from "./InstructionsLLM";

const conversationSchema = z
  .object({
    perceived_mood: z.array(z.string()),
    perceived_traits: z.array(z.string()),
    perceived_interests: z.array(z.string()),
    perceived_notes: z.string(),
    relation_with_user: z.string(),
    actualMood: z.string(),
    feeling_about_user: z.string(),
    subjects: z.array(z.string()),
  })
  .strict();

const responseSchema = z
  .object({
    message: z.string(),
    conversation: conversationSchema,
  })
  .strict();

export type GroqResponse = {
  index: number;
  message: {
    role: "assistant";
    content: string; // JSON sérialisé, à parser
    reasoning?: string;
  };
  logprobs: null;
  finish_reason: "stop" | "length";
}[];

export type ContentType = z.infer<typeof responseSchema>;

export async function groqLLM(
  messages: Message[],
  character: Character,
  conversation: Conversation,
) {
  const instructions = InstructionsLLM(character, conversation, messages);
  const chatCompletion = await getGroqChatCompletion(instructions, messages);
  return chatCompletion.choices;
}

export async function getGroqChatCompletion(
  instructions: string,
  messages: Message[],
) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  //Ce qui va être envoyé au llm, soit une instruction, et les précédents messages (user et llm)
  const formatMessage = [
    { role: "system" as const, content: instructions },
    ...messages.map((message) => ({
      role:
        message.role === "CHARACTER"
          ? ("assistant" as const)
          : ("user" as const),
      content: message.content,
    })),
  ];

  return groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: formatMessage,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response_schema",
        strict: true,
        schema: z.toJSONSchema(responseSchema),
      },
    },
  });
}
