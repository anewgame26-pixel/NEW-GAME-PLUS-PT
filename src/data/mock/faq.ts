export interface FAQItem {
  question: string;
  answer: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "O que é a NewGame+?",
    answer:
      "Uma plataforma que ajuda jogadores a decidir se vale a pena comprar um jogo e se vale a pena investir tempo na sua platina — juntando reviews, tempos de platina, dificuldade, missables e guias completos num só lugar.",
  },
  {
    question: "Como decidem se uma platina 'vale a pena'?",
    answer:
      "Jogamos o jogo até ao fim (platina incluída) antes de publicarmos qualquer review. Avaliamos dificuldade real, tempo necessário, quantidade de missables, nível de grind e se a experiência compensa esse investimento — sempre com base na nossa experiência direta, não em notas de outros sites.",
  },
  {
    question: "As reviews são pagas ou patrocinadas?",
    answer:
      "Não. As nossas análises refletem sempre a nossa opinião honesta, independentemente de termos recebido o jogo por conta própria ou por parte de uma editora.",
  },
  {
    question: "Posso sugerir um jogo para analisarem?",
    answer:
      "Sim! Podes sugerir através do Discord ou da página de Contactos. Não garantimos prazo, mas todas as sugestões são lidas.",
  },
  {
    question: "Têm guias para todos os jogos do catálogo?",
    answer:
      "Estamos a trabalhar para cobrir o máximo possível, mas nem todos os jogos têm guia completo ainda. Os que já têm mostram sempre o botão 'Roadmap' e a secção de missables na própria página do jogo.",
  },
  {
    question: "Encontrei um erro num guia ou review. Como reporto?",
    answer:
      "Usa a página 'Reportar Erro', indicando o jogo e o que está incorreto. Corrigimos o mais rapidamente possível.",
  },
  {
    question: "Trabalham com produtoras ou editoras de jogos?",
    answer:
      "Por agora não temos parcerias comerciais. Se isso mudar no futuro, vamos sempre identificar claramente qualquer conteúdo patrocinado.",
  },
  {
    question: "Como faço parte da comunidade?",
    answer:
      "Entra no nosso Discord — é lá que organizamos grupos para troféus online, discutimos platinas e partilhamos dicas em tempo real.",
  },
];
