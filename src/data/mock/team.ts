export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  bio: string;
  favoriteGame: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "t1",
    name: "Tiago Ferreira",
    role: "Fundador & Caçador-Chefe",
    avatarInitials: "TF",
    bio: "Começou a plataforma depois de perder 40 horas numa platina que afinal não valia a pena. Nunca mais quis que isso acontecesse a mais ninguém.",
    favoriteGame: "Wraithbound",
  },
  {
    id: "t2",
    name: "Mariana Costa",
    role: "Reviews & Roadmaps",
    avatarInitials: "MC",
    bio: "Especialista em missables — se existe um troféu perdível escondido num diálogo, ela encontra-o antes de ti.",
    favoriteGame: "Nightfall Ledger",
  },
  {
    id: "t3",
    name: "Rúben Almeida",
    role: "Vídeo & Antes da Platina",
    avatarInitials: "RA",
    bio: "Grava, edita e sofre em direto para que tu não precises. Já perdeu a conta às platinas conquistadas em câmara.",
    favoriteGame: "Kagerou: Path of Ash",
  },
  {
    id: "t4",
    name: "Beatriz Nunes",
    role: "Comunidade & Discord",
    avatarInitials: "BN",
    bio: "Mantém o Discord vivo, organiza grupos para troféus online e sabe sempre quem está desesperado por um quarto jogador.",
    favoriteGame: "Last Convoy",
  },
];
