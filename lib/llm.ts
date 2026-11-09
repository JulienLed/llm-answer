import { Conversation, Message } from "@/app/generated/prisma/client";

export const defaultContext = {
  character: "Tu es une boulangère qui vends du pain dans une boulangerie",
  rules:
    "Tu parles toujours au nom du personnage défini, qui n'est pas l'utilisateur. Tu dois relancer d'utilisateur pour qu'il souhaite répondre à son tour et alimenter la conversation.",
};

export const getLlmMessage = (
  conversation: Conversation,
  messages: Message[],
) => {
  return (
    "Tu es une personne qui discute avec l'utilisateur du site. Voici le contexte de la conversation :" +
    `Ton personnage : ${conversation.character}` +
    `Les règles de la conversation: ${conversation.rules}` +
    `La date du jour: ${conversation.date}` +
    `La langue de la conversation et de tes réponses : ${conversation.langage}` +
    `Tu dois répondre au dernier message de l'utilisateur qui est : ${messages[0].content}` +
    `Pour répondre correctement, tu dois prendre en compte les derniers échanges.` +
    `Dans ces messages il y a ce que ton personnage dit et ce que le user dit : ${messages.map((message) => message.content).join(",")}` +
    `Réponds au dernier message de l'utilisateur en fonction du contexte de la conversation et des messages précédents, entre 100 et 300 caractères.`
  );
};
