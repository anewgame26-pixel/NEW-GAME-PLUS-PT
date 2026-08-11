import { TopForm } from "@/components/admin/TopForm";

interface EditarTopPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarTopPage({ params }: EditarTopPageProps) {
  const { id } = await params;
  return <TopForm articleId={id} />;
}
