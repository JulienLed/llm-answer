import { prisma } from "./prisma";

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
