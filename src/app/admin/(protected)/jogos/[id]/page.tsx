import { GameEditorForm } from "@/components/admin/GameEditorForm";

interface EditarJogoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarJogoPage({ params }: EditarJogoPageProps) {
  const { id } = await params;
  return <GameEditorForm gameId={id} />;
}
