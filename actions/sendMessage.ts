"use server";

import { groqLLM, ContentType } from "@/lib/groqLLM";
import {
  getConversation,
  getCharacter,
  getMessages,
  saveUserMessage,
} from "@/actions/datas";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { saveLLMMessage } from "@/lib/messages";

export async function sendMessage(input: string) {
  const session = await auth();
  if (!session)
    return {
      success: false as const,
      data: "Utilisateur non-connecté. Redirection",
    };
  const conversation = await getConversation();
  if (!conversation.success) return { success: false, data: conversation.data };
  await saveUserMessage(input);
  const messages = await getMessages(conversation.data.id);
  const character = await getCharacter();
  const response = await groqLLM(messages, character, conversation.data);
  if (!response[0].message.content)
    return { success: false as const, data: "Pas de message" };
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
      id: conversation.data.id,
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
  await saveLLMMessage(content.message, conversation.data.id);
  return { success: true as const, data: content.message };
}
