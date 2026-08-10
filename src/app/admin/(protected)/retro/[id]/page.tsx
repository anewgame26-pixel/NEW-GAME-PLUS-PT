import { RetroForm } from "@/components/admin/RetroForm";

interface EditarRetroPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarRetroPage({ params }: EditarRetroPageProps) {
  const { id } = await params;
  return <RetroForm articleId={id} />;
}
