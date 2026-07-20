import { ThreadDetail } from "@/components/community/ThreadDetail";

interface ComunidadeTopicoPageProps {
  params: Promise<{ id: string }>;
}

export default async function ComunidadeTopicoPage({ params }: ComunidadeTopicoPageProps) {
  const { id } = await params;
  return <ThreadDetail threadId={id} />;
}
