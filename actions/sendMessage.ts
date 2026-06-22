"use server";

import { groqLLM, ContentType } from "@/lib/groqLLM";
import {
  getConversation,
  getCharacter,
  getMessages,
  saveLLMMessage,
} from "@/actions/datas";
import { prisma } from "@/lib/prisma";

export async function sendMessage(input: string) {
  const conversation = await getConversation();
  const messages = await getMessages(conversation.id, input);
  const character = await getCharacter();
  const response = await groqLLM(messages, character, conversation);
  if (!response[0].message.content) return "Pas de content";
  const content: ContentType = JSON.parse(response[0].message.content);
  const {
    perceived_interests,
    perceived_mood,
    perceived_notes,
    perceived_traits,
    relation_with_user,
    actualMood,
    feeling_about_user,
    subjects,
  } = content.conversation;
  await prisma.conversation.upsert({
    where: {
      id: conversation.id,
    },
    update: {
      perceived_interests,
      perceived_mood,
      perceived_notes,
      perceived_traits,
      relation_with_user,
      actualMood,
      feeling_about_user,
      subjects,
    },
    create: {
      perceived_interests,
      perceived_mood,
      perceived_notes,
      perceived_traits,
      relation_with_user,
      actualMood,
      feeling_about_user,
      subjects,
    },
  });
  await saveLLMMessage(content.message, conversation.id);
  return content.message;
}
