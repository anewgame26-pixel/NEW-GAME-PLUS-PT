import type { SufferingBadge } from "@/types";

export const SUFFERING_BADGES: { value: SufferingBadge; label: string; imageUrl: string }[] = [
  {
    value: "sofrimento_moderado",
    label: "Sofrimento Moderado",
    imageUrl: "/selos/sofrimento-moderado.png",
  },
  {
    value: "sofrimento_extremo",
    label: "Sofrimento Extremo",
    imageUrl: "/selos/sofrimento-extremo.png",
  },
  {
    value: "sem_sofrimento",
    label: "Sem Sofrimento",
    imageUrl: "/selos/sem-sofrimento.png",
  },
];
