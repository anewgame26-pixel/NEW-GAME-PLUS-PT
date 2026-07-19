"use client";

import { FavoriteButton } from "@/components/game/FavoriteButton";
import { ProgressTracker } from "@/components/game/ProgressTracker";

interface GameActionsBarProps {
  gameId: string;
}

export function GameActionsBar({ gameId }: GameActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <FavoriteButton gameId={gameId} variant="full" />
      <ProgressTracker gameId={gameId} />
    </div>
  );
}
