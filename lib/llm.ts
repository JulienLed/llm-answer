import { Conversation, Message } from "@/app/generated/prisma/client";

export const defaultContext = {
  character: "Tu es une boulangère qui vends du pain dans une boulangerie",
  rules:
    "Tu parles toujours au nom du personnage défini, qui n'est pas l'utilisateur." +
    "Tu dois répondre par un maximum de 300 caractères.",
  facts: "",
};

export const getLlmMessage = (
  conversation: Conversation,
  messages: Message[],
  facts: string,
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
    `Réponds au dernier message de l'utilisateur en fonction du contexte de la conversation et des messages précédents.` +
    `Prends également en comptes les faits notables : ${facts}, mais tu n'es pas obligé d'y faire allusion à chaque fois. C'est juste pour s'assurer qu'ils serons retenus et utilisés si nécessaire`
  );
};

export const getLLMFacts = (
  conversation: Conversation,
  messages: Message[],
  actualFacts: string,
) => {
  return (
    `Retire de ces messages maximum 3 faits marquants, nécessaire d'être mémorisé dans le cadre d'une conversation.` +
    `Les messages : ${messages.map((message) => message.content).join(",")}` +
    `Je veux que ces faits marquants ne soient pas repris dans ceux-ci : ${actualFacts}` +
    `Je veux que tu me retournes uniquement l'ensemble des faits marquants, ceux déjà présents et ceux que tu auras éventuellement ajoutés.` +
    `Je veux uniquement ces faits, séparés par une virgule. Uniquement des mots clefs et vraiment utiles pour la suite.` +
    `Si tu vois qu'il commence a y en avoir beaucoup (plus de 50), fusionne-les de la façon la plus juste et naturelle.` +
    `Pour chaque fait, identifie s'il s'agit d'un fait appartenant au User ou à l'IA et note le.` +
    `Tu peux les identifer car ton personnage est : ${conversation.character}`
  );
};
