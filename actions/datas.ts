"use server";

import { auth } from "@/lib/auth";
import { prisma } from "../lib/prisma";
import { defaultContext } from "@/lib/llm";
import { getFactsByMistral, mistralAPI } from "@/lib/mistral";

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
        character: defaultContext.character,
        rules: defaultContext.rules,
        userId: session.user.id,
        facts: "",
      },
    });
    return { success: true as const, data: newConversation };
  }
  return { success: true as const, data: conversation };
};

//On récupère tout les messages (user et llm).
export const getMessages = async () => {
  const conversation = await getConversation();
  if (!conversation.success)
    return { success: false as const, data: conversation.data };

  //Vérifier c'est le bon utilisateur
  const user = await prisma.conversation.findUnique({
    where: {
      id: conversation.data.id,
    },
    select: {
      userId: true,
    },
  });
  const session = await auth();
  if (!session || !session.user || !user || session.user.id !== user?.userId)
    return { success: false as const, data: "Pas d'utilisateur connecté" };

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversation.data.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
  return { success: true as const, data: messages.reverse() };
};

//On récupère les faits marquants
export const getFacts = async () => {
  const conversation = await getConversation();

  if (!conversation.success)
    return { success: false as const, data: "Il y a eu une erreur" };

  return { success: true as const, data: conversation.data.facts };
};

//On sauvegarde le message du User.
export const saveUserMessage = async (inputUser: string) => {
  const conversation = await getConversation();

  if (!conversation.success)
    return { success: false as const, data: "Il y a eu une erreur" };

  const response = await prisma.message.create({
    data: {
      role: "USER",
      content: inputUser,
      conversationId: conversation.data.id,
    },
  });
  if (!response)
    return { success: false as const, data: "Il y a eu une erreur" };
  return { success: true, data: response };
};

//On update les faits remarquables
export const updateFacts = async () => {
  const conversation = await getConversation();

  if (!conversation.success)
    return { success: false as const, data: "Il y a eu une erreur" };
  const messages = await getMessages();

  if (!messages.success)
    return { success: false as const, data: messages.data };

  const actualFacts = await getFacts();
  if (!actualFacts.success)
    return { success: false as const, data: messages.data };

  const facts = await getFactsByMistral(
    conversation.data,
    messages.data,
    actualFacts.data,
  );
  if (!facts.success) return { success: false as const, data: messages.data };

  console.log("Les faits marquandts : " + JSON.stringify(facts.data));

  await prisma.conversation.update({
    where: {
      id: conversation.data.id,
    },
    data: {
      facts: facts.data,
    },
  });
};

//On sauvegarde la réponse du llm.
export const saveLLMMessage = async () => {
  const conversation = await getConversation();

  if (!conversation.success)
    return { success: false as const, data: "Il y a eu une erreur" };

  const messages = await getMessages();

  if (!messages.success)
    return { success: false as const, data: messages.data };

  const facts = await getFacts();
  if (!facts.success) return { success: false as const, data: messages.data };

  const message = await mistralAPI(
    conversation.data,
    messages.data,
    facts.data,
  );
  if (!message.success) return { success: false as const, data: message.data };

  const response = await prisma.message.create({
    data: {
      role: "ASSISTANT",
      content: message.data,
      conversationId: conversation.data.id,
    },
  });
  if (!response)
    return { success: false as const, data: "Il y a eu une erreur" };
  return { success: true, data: response };
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
