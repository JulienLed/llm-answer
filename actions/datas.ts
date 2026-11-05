"use server";

import { auth } from "@/lib/auth";
import { prisma } from "../lib/prisma";

export const getConversation = async () => {
  const session = await auth();
  //Si pas de session en cours, retourner une erreur
  if (!session?.user) {
    return { success: false as const, data: "Pas d'utilisateur connecté" };
  }
  //Vérifier la conversation existente
  const conversation = await prisma.conversation.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  //Si pas de conversation, en créer une nouvelle
  if (!conversation) {
    const newConversation = await prisma.conversation.create({
      data: {
        perceived_interests: [],
        perceived_mood: [],
        perceived_notes: "",
        perceived_traits: [],
        relation_with_user: "",
        actualMood: "",
        feeling_about_user: "",
        subjects: [],
        userId: session.user.id,
      },
    });
    return { success: true as const, data: newConversation };
  }
  return { success: true as const, data: conversation };
};

export const getCharacter = async () => {
  //Il faudra chercher l'utilisateur connecté quand plusieurs utilisateurs
  const character = await prisma.character.findMany();
  return character[0];
};

//On récupère tout les messages (user et llm).
export const getMessages = async (conversationId: number) => {
  //Vérifier c'est le bon utilisateur
  const user = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
    select: {
      userId: true,
    },
  });
  const session = await auth();
  if (!session || !session.user || !user || session.user.id !== user?.userId)
    return [];

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
  return messages.reverse();
};

//On sauveragrde le message du User.
export const saveUserMessage = async (inputUser: string) => {
  const conversation = await getConversation();

  if (!conversation.success) return;

  await prisma.message.create({
    data: {
      role: "USER",
      content: inputUser,
      conversationId: conversation.data.id,
    },
  });
};

//On efface une conversation
export const deleteConversation = async () => {
  const session = await auth();
  if (!session || !session.user)
    return { success: false as const, data: "Il y a eu un problème" };

  const conversation = await getConversation();
  if (!conversation.success)
    return { success: false as const, data: "Il y a eu un problème" };

  const deletedMessages = await prisma.message.deleteMany({
    where: {
      conversationId: conversation.data.id,
    },
  });

  const deletedConversation = await prisma.conversation.deleteMany({
    where: {
      id: conversation.data.id,
    },
  });

  if (!deletedConversation || !deletedMessages) {
    return { success: false as const, data: "Il y a eu un problème" };
  } else {
    return { success: true as const, data: "Conversation bien supprimée" };
  }
};
