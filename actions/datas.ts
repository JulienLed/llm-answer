"use server";

import { prisma } from "../lib/prisma";

export const getConversation = async () => {
  //Il faudra chercher l'utilisateur connecté quand plusieurs utilisateurs
  const conversation = await prisma.conversation.findMany();
  //Avant de créer plusieurs conversations liées a un user, on va juste en créé une si il n'y en a pas en db, juste pour test.
  if (!conversation[0]) {
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
      },
    });
    return newConversation;
  }
  return conversation[0];
};

export const getCharacter = async () => {
  //Il faudra chercher l'utilisateur connecté quand plusieurs utilisateurs
  const character = await prisma.character.findMany();
  return character[0];
};

//On récupère tout les messages (user et llm). On créer une entrée db s'il y a une input user
export const getMessages = async (
  conversationId: number,
  inputUser?: string,
) => {
  if (inputUser) {
    await prisma.message.create({
      data: {
        role: "USER",
        content: inputUser,
        conversationId,
      },
    });
  }
  const messages = await prisma.message.findMany({
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });
  return messages;
};

//Après réponse du llm, on stock sa réponse
export const saveLLMMessage = async (
  llmMessage: string,
  conversationId: number,
) => {
  await prisma.message.create({
    data: {
      role: "CHARACTER",
      content: llmMessage,
      conversationId,
    },
  });
};
