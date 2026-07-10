import { GameDetail } from "@/types";

/**
 * Detalhe completo por jogo, separado do resumo em games.ts porque tem um
 * ciclo de vida diferente: o resumo alimenta cards/listagens, o detalhe só é
 * necessário na página individual. Quando existir backend/CMS, isto passa a
 * vir de um endpoint próprio (ex: GET /api/jogos/:slug/detalhe).
 */
export const gameDetails: Record<string, GameDetail> = {
  g1: {
    gameId: "g1",
    minPlaythroughs: 2,
    difficultyExplanation:
      "A nota 9/10 reflete um soulslike com bosses de janelas de esquiva muito curtas e uma segunda run obrigatória em New Game+ para o troféu do final alternativo. Não há sistema de fácil, e a curva de dificuldade sobe abruptamente a partir do terceiro território.",
    review: {
      intro:
        "Kagerou: Path of Ash pega na fórmula soulslike e junta-lhe um sistema de loop temporal que muda a forma como encaras cada morte.",
      whatToExpect:
        "Combate técnico e implacável, exploração vertical densa, e um sistema de New Game+ que altera diálogos e layouts com base nas tuas mortes anteriores.",
      pros: [
        "Combate extremamente satisfatório quando dominado",
        "Direção de arte e level design memoráveis",
        "Sistema de loop temporal dá replay value genuíno",
      ],
      cons: [
        "Curva de dificuldade muito acentuada a meio do jogo",
        "Exige obrigatoriamente New Game+ para a platina",
        "Alguns bosses com hitboxes injustas em certas builds",
      ],
      verdict:
        "Vale claramente o dinheiro. A platina só é recomendada a quem já tem experiência sólida em soulslikes — caso contrário, prepara-te para um sofrimento real.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Primeiras 3 zonas, aprender mecânicas base e o sistema de loop temporal." },
      { stage: "meio", label: "Meio", description: "Bosses principais e desbloqueio das armas secundárias — aqui a dificuldade dispara." },
      { stage: "final", label: "Final", description: "Boss final e escolha do primeiro final. Guarda um save manual antes desta escolha." },
      { stage: "cleanup", label: "Cleanup", description: "New Game+ focado no final alternativo e troféus de coleção que ficaram por fazer." },
    ],
    missables: [
      { title: "Diálogo da Vidente", chapter: "Capítulo 2", description: "Só disponível antes de derrotares o segundo boss — depois desaparece para sempre nessa run." },
      { title: "Arma da Cinza Ancestral", chapter: "Capítulo 4", description: "Precisa de uma escolha específica numa conversa; se a perderes, só a consegues em New Game+." },
      { title: "Final Alternativo", chapter: "Final", description: "Exige ter mantido um NPC específico vivo desde o Capítulo 1." },
    ],
    hardestTrophies: [
      { name: "Sem uma Gota", description: "Derrota o boss final sem seres atingido.", tip: "Faz num New Game+ já com todo o equipamento maximizado, foca-te em padrões de esquiva." },
      { name: "Eco Perfeito", description: "Completa uma run inteira sem usar frascos de cura.", tip: "Sobe o parry ao máximo antes de tentares — reduz drasticamente o dano recebido." },
      { name: "Guardião de Cinzas", description: "Derrota os 3 bosses opcionais no mesmo ciclo temporal.", tip: "Planeia a ordem com antecedência, alguns bosses fecham o acesso a outros." },
    ],
    prepTips: [
      "Sobe primeiro a stat de vitalidade — a maioria das mortes iniciais é por falta de vida.",
      "Não vendas itens de missão, vais precisar deles em New Game+.",
      "Usa o guia completo antes do Capítulo 3, é onde os missables começam a sério.",
      "Grava sempre antes de decisões de diálogo importantes.",
    ],
    guideHref: "/guias/kagerou-path-of-ash",
    roadmapHref: "/guias/kagerou-path-of-ash#roadmap",
    overallScore: 8.6,
    ratingBreakdown: [
      { label: "Gameplay", value: 9.2 },
      { label: "História", value: 7.8 },
      { label: "Direção de Arte", value: 9.0 },
      { label: "Valor", value: 8.4 },
    ],
    roadmapSummary: [
      "Completa a história em modo normal, sem te preocupares com troféus.",
      "No 2º save, foca-te nos missables dos Capítulos 2 e 4.",
      "Entra em New Game+ para o final alternativo e 'Eco Perfeito'.",
      "Limpa troféus de coleção nos territórios já visitados.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Kagerou+Screenshot+${i}`
    ),
  },

  g2: {
    gameId: "g2",
    minPlaythroughs: 2,
    difficultyExplanation:
      "A dificuldade 6/10 vem sobretudo dos múltiplos finais com condições cruzadas — nenhum boss é particularmente difícil, mas é fácil fechar um final sem perceber, obrigando a repetir capítulos inteiros.",
    review: {
      intro:
        "Hollow Signal é um horror de investigação claustrofóbico, contado quase inteiramente através de uma estação de rádio decadente.",
      whatToExpect:
        "Ritmo lento e tenso, decisões de diálogo com peso real, e uma atmosfera sonora excecional que carrega a maior parte do terror.",
      pros: [
        "Atmosfera e som magistrais",
        "História com múltiplas camadas que recompensa replays",
        "Duração perfeita para um fim de semana",
      ],
      cons: [
        "Sistema de finais pouco claro na primeira run",
        "Alguns puzzles obscuros sem pistas suficientes",
        "Pouca variedade de gameplay fora dos diálogos",
      ],
      verdict:
        "Vale muito a pena, tanto para jogar como para platinar — com o guia certo, a platina é tranquila em 2 runs.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Chegada à estação, primeiras gravações e escolha de abordagem (curiosa vs cautelosa)." },
      { stage: "meio", label: "Meio", description: "Investigação principal — aqui acontecem a maioria das escolhas que fecham finais." },
      { stage: "final", label: "Final", description: "Confronto final na sala de transmissão, decide o final obtido." },
      { stage: "cleanup", label: "Cleanup", description: "Segunda run focada no final em falta e nas gravações secretas por apanhar." },
    ],
    missables: [
      { title: "Gravação da Torre Norte", chapter: "Capítulo 1", description: "Só acessível antes de escureceres, depois a porta fecha-se permanentemente." },
      { title: "Diálogo com o Vigia", chapter: "Capítulo 3", description: "Desaparece se avançares a história sem visitares a cabine de som primeiro." },
      { title: "Final 'Silêncio'", chapter: "Final", description: "Exige não teres recolhido nenhuma gravação extra durante toda a run." },
    ],
    hardestTrophies: [
      { name: "Os Dois Silêncios", description: "Obtém os dois finais opostos em runs separadas.", tip: "Faz uma run 100% curiosa e outra 100% cautelosa, sem misturar escolhas." },
      { name: "Voz na Estática", description: "Encontra todas as gravações secretas.", tip: "Usa o guia — várias estão escondidas atrás de interações fáceis de ignorar." },
      { name: "Sem Luz", description: "Completa o Capítulo 4 sem usares a lanterna.", tip: "Memoriza o layout antecipadamente numa run anterior." },
    ],
    prepTips: [
      "Decide antecipadamente que 'personalidade' de escolhas vais seguir na primeira run.",
      "Não apagues o save entre capítulos — vais querer voltar atrás para gravações.",
      "Ouve tudo com atenção, os puzzles dão pistas por áudio.",
      "Reserva a segunda run só para o final em falta — é mais curta que a primeira.",
    ],
    guideHref: "/guias/hollow-signal",
    roadmapHref: "/guias/hollow-signal#roadmap",
    overallScore: 8.2,
    ratingBreakdown: [
      { label: "Gameplay", value: 7.0 },
      { label: "História", value: 9.3 },
      { label: "Direção de Arte", value: 8.5 },
      { label: "Valor", value: 8.0 },
    ],
    roadmapSummary: [
      "1ª run: segue a abordagem 'curiosa', recolhe as gravações principais.",
      "2ª run: abordagem 'cautelosa' para o final em falta.",
      "Usa o guia para as gravações secretas do Capítulo 1 e 3.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Hollow+Signal+Screenshot+${i}`
    ),
  },

  g3: {
    gameId: "g3",
    minPlaythroughs: 1,
    difficultyExplanation:
      "Nota baixa (4/10) porque não existem missables e a maioria dos troféus é orgânica ao jogar normalmente. O único obstáculo é o troféu online, que precisa de coordenação com outros jogadores.",
    review: {
      intro:
        "Route 9: Redux transforma uma autoestrada interminável num parque de diversões cooperativo de sobrevivência.",
      whatToExpect:
        "Sessões curtas e caóticas, boa curva de progressão de equipamento, e troféus quase todos naturais ao progresso.",
      pros: ["Extremamente acessível", "Ótimo em grupo", "Progressão de equipamento satisfatória"],
      cons: ["Pouco desafio a solo", "Conteúdo late-game repetitivo", "Servidores por vezes instáveis em picos de utilizadores"],
      verdict: "Vale o dinheiro para quem gosta de coop casual. A platina é uma das mais tranquilas do catálogo.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Tutorial e primeiras rondas de sobrevivência, desbloqueio do garagem base." },
      { stage: "meio", label: "Meio", description: "Progressão de equipamento e desbloqueio de todos os veículos." },
      { stage: "final", label: "Final", description: "Rondas de dificuldade máxima, praticamente todos os troféus de progresso já feitos aqui." },
      { stage: "cleanup", label: "Cleanup", description: "Troféu online em grupo e limpeza de coleccionáveis de estrada." },
    ],
    missables: [],
    hardestTrophies: [
      { name: "Comboio Completo", description: "Termina uma ronda de dificuldade máxima com 4 jogadores vivos.", tip: "Combina com a comunidade no Discord da NG+ para grupo fixo." },
      { name: "Mecânico de Estrada", description: "Repara veículos 50 vezes sem morrer no processo.", tip: "Faz em rondas fáceis logo no início, é mais seguro." },
    ],
    prepTips: [
      "Arranja um grupo fixo antes de tentares o troféu online — evita jogadores aleatórios.",
      "Não precisas de guia para a maioria dos troféus, vêm naturalmente.",
      "Guarda recursos para o veículo final antes de gastares tudo em melhorias menores.",
    ],
    guideHref: "/guias/route-9-redux",
    roadmapHref: "/guias/route-9-redux#roadmap",
    overallScore: 7.4,
    ratingBreakdown: [
      { label: "Gameplay", value: 8.0 },
      { label: "História", value: 5.5 },
      { label: "Direção de Arte", value: 6.8 },
      { label: "Valor", value: 8.8 },
    ],
    roadmapSummary: [
      "Sobe o equipamento base nas primeiras rondas.",
      "Desbloqueia todos os veículos em modo normal.",
      "Combina grupo fixo de 4 para o troféu online 'Comboio Completo'.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Route+9+Redux+Screenshot+${i}`
    ),
  },

  g4: {
    gameId: "g4",
    minPlaythroughs: 3,
    difficultyExplanation:
      "A dificuldade 7/10 vem da exigência de três finais completamente distintos (cada um fecha o acesso aos outros dois) e de uma build de combate otimizada para o modo de dificuldade máxima nas últimas missões.",
    review: {
      intro:
        "Iron Verdict é um RPG denso de facções, ambientado num império a desmoronar-se sob pressão de três forças rivais.",
      whatToExpect:
        "Dezenas de horas de história ramificada, sistema de reputação com consequências reais, e combate tático por turnos.",
      pros: ["Escrita e worldbuilding excelentes", "Sistema de facções com peso real", "Combate tático profundo"],
      cons: ["Exige 3 playthroughs completos para a platina", "Ritmo lento nas primeiras 10 horas", "Alguns bugs de save em builds antigas"],
      verdict: "Vale muito a pena comprar. A platina é um investimento sério de tempo — só recomendado a quem já ama o jogo.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Escolha de origem e primeiras missões de facção — decide o teu caminho inicial." },
      { stage: "meio", label: "Meio", description: "Ponto de não retorno de facção, a maioria das ramificações fecha-se aqui." },
      { stage: "final", label: "Final", description: "Confronto final de facção — 3 variantes completamente diferentes." },
      { stage: "cleanup", label: "Cleanup", description: "Segunda e terceira run focadas nos finais em falta, usando saves antes do ponto de não retorno." },
    ],
    missables: [
      { title: "Aliança com os Errantes", chapter: "Ato 2", description: "Só disponível se não tiveres atacado o seu acampamento no Ato 1." },
      { title: "Arma Lendária do Arquivista", chapter: "Ato 3", description: "Perdida para sempre se avançares a missão principal sem a side-quest associada." },
      { title: "Diálogo do Imperador Caído", chapter: "Final", description: "Só acessível na rota da facção Iron Court." },
    ],
    hardestTrophies: [
      { name: "Três Coroas", description: "Completa os 3 finais de facção.", tip: "Faz saves manuais antes do ponto de não retorno de cada run para poupar tempo." },
      { name: "Tático Perfeito", description: "Vence o combate final sem perder nenhuma unidade.", tip: "Sobe a build de suporte antes de tentares, reduz muito o risco." },
      { name: "Sem Palavras", description: "Completa o jogo sem perder nenhuma negociação de diálogo.", tip: "Usa o guia para as escolhas de diálogo corretas em cada negociação chave." },
    ],
    prepTips: [
      "Faz um save antes de cada ponto de não retorno de facção — poupa uma run inteira.",
      "Não vendas armas lendárias, algumas são necessárias para troféus de coleção.",
      "Planeia desde já qual das 3 rotas vais fazer em cada playthrough.",
      "Usa o roadmap para saber a ordem mais eficiente de fazer as 3 runs.",
    ],
    guideHref: "/guias/iron-verdict",
    roadmapHref: "/guias/iron-verdict#roadmap",
    overallScore: 8.9,
    ratingBreakdown: [
      { label: "Gameplay", value: 8.6 },
      { label: "História", value: 9.5 },
      { label: "Direção de Arte", value: 8.7 },
      { label: "Valor", value: 8.0 },
    ],
    roadmapSummary: [
      "1ª run: rota Iron Court até ao ponto de não retorno do Ato 2.",
      "2ª run: rota Errantes, guarda save antes do Ato 2.",
      "3ª run: rota Arquivista para o final restante.",
      "Usa saves manuais para poupar tempo entre rotas.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Iron+Verdict+Screenshot+${i}`
    ),
  },

  g5: {
    gameId: "g5",
    minPlaythroughs: 1,
    difficultyExplanation:
      "Nota 5/10 porque, apesar de curto, tem vários missables cruzados que se perdem permanentemente numa única run mal planeada — mas nenhum desafio de habilidade real.",
    review: {
      intro:
        "Static Choir é um horror psicológico curto e denso, focado inteiramente em atmosfera e ambiguidade narrativa.",
      whatToExpect:
        "3-4 horas de experiência muito concentrada, quase sem combate, com foco total em exploração e tensão psicológica.",
      pros: ["Atmosfera opressiva muito bem construída", "Duração perfeita, sem gordura", "Trilha sonora excelente"],
      cons: ["Muito curto para o preço", "Missables pouco intuitivos sem guia", "Final pode ser confuso sem contexto extra"],
      verdict: "Vale a pena para quem gosta de horror atmosférico. A platina é tranquila com o guia — sem ele, é fácil perder trófeus.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Chegada à casa, primeiras pistas ambientais." },
      { stage: "meio", label: "Meio", description: "Sequência principal de investigação, onde estão a maioria dos missables." },
      { stage: "final", label: "Final", description: "Confronto final e escolha de interpretação do final." },
      { stage: "cleanup", label: "Cleanup", description: "Não há cleanup real — tudo se faz numa única run bem planeada." },
    ],
    missables: [
      { title: "Carta na Cave", chapter: "Ato 1", description: "Só acessível antes de subires as escadas principais pela primeira vez." },
      { title: "Gravação do Sótão", chapter: "Ato 2", description: "Desaparece se ligares a luz do corredor antes de a apanhares." },
    ],
    hardestTrophies: [
      { name: "Tudo Visto", description: "Encontra todas as pistas ambientais numa única run.", tip: "Segue o guia passo a passo — não há forma orgânica de garantir todas." },
    ],
    prepTips: [
      "Faz esta run inteiramente com o guia aberto — é o jogo mais missable-heavy do catálogo para a duração que tem.",
      "Não apagues saves antigos até teres o troféu de platina confirmado.",
      "Joga com fones — muitas pistas são só sonoras.",
    ],
    guideHref: "/guias/static-choir",
    roadmapHref: "/guias/static-choir#roadmap",
    overallScore: 8.0,
    ratingBreakdown: [
      { label: "Gameplay", value: 6.5 },
      { label: "História", value: 9.0 },
      { label: "Direção de Arte", value: 8.8 },
      { label: "Valor", value: 7.2 },
    ],
    roadmapSummary: [
      "Uma única run com o guia aberto do início ao fim.",
      "Apanha a Carta na Cave antes de subires as escadas.",
      "Grava a Gravação do Sótão antes de ligares a luz do corredor.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Static+Choir+Screenshot+${i}`
    ),
  },

  g6: {
    gameId: "g6",
    minPlaythroughs: 2,
    difficultyExplanation:
      "O 10/10 vem do troféu de PvP online, considerado pela comunidade o mais difícil da plataforma, combinado com bosses PvE já de si extremamente exigentes e um New Game+ obrigatório.",
    review: {
      intro:
        "Wraithbound é o soulslike mais punitivo do catálogo — feito para quem já domina o género e procura o próximo grande desafio.",
      whatToExpect:
        "Bosses brutais, sistema de PvP competitivo com ranking, e uma curva de dificuldade que não perdoa erros de posicionamento.",
      pros: ["O desafio PvE mais satisfatório do catálogo", "PvP com profundidade tática real", "Direção artística sombria e coerente"],
      cons: ["Troféu de PvP pode levar dezenas de horas", "Curva de entrada muito exigente", "Matchmaking lento fora de horas de pico"],
      verdict: "Só vale a pena comprar se gostares mesmo de desafio. A platina é, sem exagero, o maior sofrimento da NG+.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Primeira zona e boss tutorial — já aqui a dificuldade é alta." },
      { stage: "meio", label: "Meio", description: "Bosses principais e desbloqueio do sistema de PvP." },
      { stage: "final", label: "Final", description: "Boss final PvE — recomenda-se build totalmente otimizada." },
      { stage: "cleanup", label: "Cleanup", description: "Grind de ranking PvP e New Game+ para troféus de coleção em falta." },
    ],
    missables: [
      { title: "Arma Espectral", chapter: "Zona 3", description: "Só disponível numa janela curta antes do boss da zona — se avançares, perde-se até New Game+." },
    ],
    hardestTrophies: [
      { name: "Rank Espectral", description: "Atinge o rank máximo no PvP competitivo.", tip: "Considerado o troféu mais difícil da plataforma — junta-te à comunidade Discord para dicas de build." },
      { name: "Sem Marcas", description: "Derrota o boss final sem seres atingido uma única vez.", tip: "Estuda os padrões em vídeo antes de tentar — memorização é mais importante que reflexos." },
      { name: "Ciclo Completo", description: "Termina o jogo em 3 New Game+ consecutivos.", tip: "Planeia builds diferentes para cada ciclo, torna o grind menos repetitivo." },
    ],
    prepTips: [
      "Não tentes o PvP sem estudares as builds meta da comunidade primeiro.",
      "Guarda a Arma Espectral da Zona 3 antes de avançares — é fácil perder sem saber.",
      "Prepara-te mentalmente: este é o jogo mais longo até à platina do catálogo.",
      "Junta-te ao Discord da NG+ antes de começares o grind de PvP.",
    ],
    guideHref: "/guias/wraithbound",
    roadmapHref: "/guias/wraithbound#roadmap",
    overallScore: 9.1,
    ratingBreakdown: [
      { label: "Gameplay", value: 9.6 },
      { label: "História", value: 8.0 },
      { label: "Direção de Arte", value: 9.4 },
      { label: "Valor", value: 8.5 },
    ],
    roadmapSummary: [
      "1ª run: guarda a Arma Espectral da Zona 3 antes do boss.",
      "Sobe uma build otimizada antes de tentares o PvP.",
      "Grind de ranking PvP para 'Rank Espectral'.",
      "New Game+ x3 para 'Ciclo Completo' e troféus restantes.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Wraithbound+Screenshot+${i}`
    ),
  },

  g7: {
    gameId: "g7",
    minPlaythroughs: 1,
    difficultyExplanation:
      "Nota 3/10 — sem missables, sem combate, e todos os troféus são naturais ao explorar a história ao teu próprio ritmo.",
    review: {
      intro:
        "Sable's Requiem é uma aventura narrativa serena sobre luto e memória, sem pressão de tempo ou combate.",
      whatToExpect:
        "Uma experiência contemplativa de 8-12 horas, focada em diálogo e exploração tranquila de um mundo pequeno mas emocionalmente denso.",
      pros: ["Experiência emocionalmente marcante", "Zero fricção — perfeito para relaxar", "Trilha sonora belíssima"],
      cons: ["Sem qualquer desafio para quem procura isso", "Ritmo pode ser lento demais para alguns", "Pouca rejogabilidade"],
      verdict: "Vale muito a pena, especialmente se procuras uma platina tranquila entre jogos mais exigentes.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Chegada à casa da família e primeiras memórias desbloqueadas." },
      { stage: "meio", label: "Meio", description: "Exploração livre do resto da propriedade e conversas principais." },
      { stage: "final", label: "Final", description: "Sequência final de despedida." },
      { stage: "cleanup", label: "Cleanup", description: "Não é necessário — tudo se completa numa única run relaxada." },
    ],
    missables: [],
    hardestTrophies: [],
    prepTips: [
      "Não há necessidade de guia — joga ao teu ritmo e todos os troféus vêm naturalmente.",
      "Explora todos os cantos da propriedade antes do final — não podes voltar depois.",
    ],
    guideHref: "/guias/sables-requiem",
    roadmapHref: "/guias/sables-requiem#roadmap",
    overallScore: 8.3,
    ratingBreakdown: [
      { label: "Gameplay", value: 6.0 },
      { label: "História", value: 9.5 },
      { label: "Direção de Arte", value: 9.0 },
      { label: "Valor", value: 8.5 },
    ],
    roadmapSummary: [
      "Explora a propriedade toda antes de avançares para o final.",
      "Fala com todos os NPCs disponíveis em cada área.",
      "Sem necessidade de guia — tudo é orgânico.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Sables+Requiem+Screenshot+${i}`
    ),
  },

  g8: {
    gameId: "g8",
    minPlaythroughs: 1,
    difficultyExplanation:
      "Nota 4/10 — sem missables, mas os últimos três níveis de plataformas exigem precisão bem acima da média do resto do jogo.",
    review: {
      intro:
        "Chrono Foundry é um plataformas inteligente que usa manipulação de tempo para criar puzzles de percurso genuinamente originais.",
      whatToExpect:
        "Progressão suave até aos níveis finais, onde a dificuldade de plataformas sobe drasticamente.",
      pros: ["Mecânica de tempo muito bem implementada", "Level design criativo", "Curva de dificuldade justa até ao fim"],
      cons: ["Últimos níveis destoam em dificuldade", "Alguma repetição visual a meio do jogo", "Checkpoints escassos nos níveis finais"],
      verdict: "Vale bem o dinheiro. A platina é acessível, só os últimos níveis pedem paciência extra.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Mundo 1-2, introdução da mecânica de manipulação de tempo." },
      { stage: "meio", label: "Meio", description: "Mundos 3-4, puzzles combinando várias mecânicas de tempo." },
      { stage: "final", label: "Final", description: "Últimos três níveis — pico de dificuldade de precisão." },
      { stage: "cleanup", label: "Cleanup", description: "Colecionáveis em falta e speedrun de níveis para troféus de tempo." },
    ],
    missables: [],
    hardestTrophies: [
      { name: "Sem Rebobinar", description: "Completa o último nível sem usar a mecânica de rebobinar tempo.", tip: "Pratica o nível várias vezes normalmente antes de tentar sem a mecânica." },
      { name: "Relojoeiro", description: "Termina todos os níveis dentro do tempo de ouro.", tip: "Foca-te primeiro em completar, depois faz runs dedicadas a tempo por nível." },
    ],
    prepTips: [
      "Pratica bem a mecânica de rebobinar nos mundos iniciais, é essencial nos finais.",
      "Não precisas de guia para colecionáveis, são todos visíveis com exploração normal.",
      "Reserva tempo extra para os últimos 3 níveis — a dificuldade sobe bastante.",
    ],
    guideHref: "/guias/chrono-foundry",
    roadmapHref: "/guias/chrono-foundry#roadmap",
    overallScore: 7.9,
    ratingBreakdown: [
      { label: "Gameplay", value: 8.4 },
      { label: "História", value: 6.0 },
      { label: "Direção de Arte", value: 7.5 },
      { label: "Valor", value: 8.6 },
    ],
    roadmapSummary: [
      "Completa os Mundos 1-4 normalmente.",
      "Pratica a mecânica de rebobinar antes dos últimos 3 níveis.",
      "Runs dedicadas a tempo de ouro por nível no fim.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Chrono+Foundry+Screenshot+${i}`
    ),
  },

  g9: {
    gameId: "g9",
    minPlaythroughs: 1,
    difficultyExplanation:
      "Nota 5/10 — o único obstáculo real é o troféu online que exige 4 jogadores ativos simultaneamente; o resto do jogo é acessível a solo.",
    review: {
      intro:
        "Last Convoy é um mundo aberto pós-apocalíptico centrado em logística, sobrevivência e cooperação em grupo.",
      whatToExpect:
        "Gestão de recursos entre bases, viagens em comboio pelo mapa, e uma boa dose de conteúdo cooperativo opcional.",
      pros: ["Sistema de logística satisfatório", "Mundo aberto bem desenhado", "Conteúdo coop opcional mas recompensador"],
      cons: ["Troféu online exige coordenação de grupo", "Algum grind de recursos a meio do jogo", "IA de companheiros inconsistente"],
      verdict: "Vale a pena, principalmente em grupo. A platina é acessível desde que arranjes 3 amigos para o troféu online.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Estabelecer a primeira base e o primeiro comboio." },
      { stage: "meio", label: "Meio", description: "Expansão do território e desbloqueio de todos os veículos e upgrades." },
      { stage: "final", label: "Final", description: "Missão final de defesa da base principal." },
      { stage: "cleanup", label: "Cleanup", description: "Troféu online em grupo de 4 e colecionáveis do mapa em falta." },
    ],
    missables: [],
    hardestTrophies: [
      { name: "Comboio Unido", description: "Completa uma missão de defesa com 4 jogadores online.", tip: "Combina previamente com um grupo — não tentes com jogadores aleatórios." },
      { name: "Mestre da Logística", description: "Atinge a capacidade máxima de recursos em todas as bases.", tip: "Prioriza upgrades de armazenamento antes de upgrades de combate." },
    ],
    prepTips: [
      "Arranja um grupo de 3 amigos antes de começares a pensar no troféu online.",
      "Não gastes todos os recursos em armas — vais precisar de upgrades de base também.",
      "Faz as side-quests de logística cedo, desbloqueiam upgrades essenciais para o final.",
    ],
    guideHref: "/guias/last-convoy",
    roadmapHref: "/guias/last-convoy#roadmap",
    overallScore: 7.8,
    ratingBreakdown: [
      { label: "Gameplay", value: 8.0 },
      { label: "História", value: 6.8 },
      { label: "Direção de Arte", value: 7.6 },
      { label: "Valor", value: 8.9 },
    ],
    roadmapSummary: [
      "Estabelece a base principal e sobe upgrades de armazenamento.",
      "Desbloqueia todos os veículos e território.",
      "Combina grupo de 4 para a missão de defesa online.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Last+Convoy+Screenshot+${i}`
    ),
  },

  g10: {
    gameId: "g10",
    minPlaythroughs: 2,
    difficultyExplanation:
      "A nota 8/10 reflete uma teia de missables cruzados entre capítulos — decisões no Capítulo 2 podem fechar conteúdo só visível no Capítulo 5, tornando o planeamento essencial.",
    review: {
      intro:
        "Nightfall Ledger é um RPG de horror gótico onde cada contrato feito com as sombras tem um custo permanente e irreversível.",
      whatToExpect:
        "Uma história ramificada e sombria, sistema de contratos com consequências duradouras, e uma segunda run quase obrigatória para capturar tudo.",
      pros: ["Sistema de contratos com peso narrativo real", "Atmosfera gótica muito bem executada", "Múltiplos finais genuinamente diferentes"],
      cons: ["Missables cruzados entre capítulos distantes", "Requer planeamento cuidadoso ou guia", "Ritmo pode arrastar no meio do jogo"],
      verdict: "Vale muito a pena comprar. Para a platina, recomenda-se vivamente o guia — é fácil fechar conteúdo sem perceber.",
    },
    timeline: [
      { stage: "inicio", label: "Início", description: "Primeiro contrato e escolha de facção das sombras." },
      { stage: "meio", label: "Meio", description: "Capítulos 3-5, onde a maioria das decisões cruzadas acontece." },
      { stage: "final", label: "Final", description: "Confronto com a entidade principal — determina o final obtido." },
      { stage: "cleanup", label: "Cleanup", description: "Segunda run focada no final em falta e contratos secretos por cumprir." },
    ],
    missables: [
      { title: "Contrato da Viúva", chapter: "Capítulo 2", description: "Se recusares, fecha permanentemente uma questline inteira do Capítulo 5." },
      { title: "Página do Grimório Perdido", chapter: "Capítulo 3", description: "Só disponível se tiveres visitado a biblioteca antes do Capítulo 2 terminar." },
      { title: "Aliança das Sombras Menores", chapter: "Capítulo 4", description: "Exige ter recusado pelo menos 2 contratos anteriores." },
    ],
    hardestTrophies: [
      { name: "Sem Alma Vendida", description: "Completa o jogo sem aceitar nenhum contrato.", tip: "Faz esta run separadamente com o guia, é a mais restritiva de todas." },
      { name: "Colecionador de Sombras", description: "Obtém todos os finais possíveis.", tip: "Precisas de pelo menos 2 runs bem planeadas — usa saves antes das decisões-chave." },
      { name: "Grimório Completo", description: "Encontra todas as páginas secretas espalhadas pelos capítulos.", tip: "Algumas só aparecem se tiveres feito escolhas específicas em capítulos anteriores." },
    ],
    prepTips: [
      "Usa o guia desde o Capítulo 1 — os missables cruzam capítulos distantes de forma pouco intuitiva.",
      "Faz saves manuais antes de cada contrato, é a decisão mais importante do jogo.",
      "Planeia a tua primeira run para o final 'canónico' e deixa os outros para New Game+.",
      "Não recuses todos os contratos só por curiosidade — alguns fecham conteúdo permanentemente.",
    ],
    guideHref: "/guias/nightfall-ledger",
    roadmapHref: "/guias/nightfall-ledger#roadmap",
    overallScore: 8.7,
    ratingBreakdown: [
      { label: "Gameplay", value: 8.5 },
      { label: "História", value: 9.2 },
      { label: "Direção de Arte", value: 9.0 },
      { label: "Valor", value: 8.0 },
    ],
    roadmapSummary: [
      "1ª run: aceita contratos livremente para o final 'canónico'.",
      "Guarda saves antes de cada contrato-chave (Capítulos 2-4).",
      "2ª run: recusa todos os contratos para 'Sem Alma Vendida'.",
      "Usa o guia para o Grimório Completo — as páginas cruzam capítulos.",
    ],
    screenshotUrls: [1, 2, 3, 4].map(
      (i) => `https://placehold.co/960x540/1a1e28/f3f5f7.png?font=roboto&text=Nightfall+Ledger+Screenshot+${i}`
    ),
  },
};

export function getGameDetail(gameId: string) {
  return gameDetails[gameId];
}
