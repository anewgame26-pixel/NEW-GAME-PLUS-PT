import { DiscoveryForm } from "@/components/admin/DiscoveryForm";

interface EditarDescobertaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarDescobertaPage({ params }: EditarDescobertaPageProps) {
  const { id } = await params;
  return <DiscoveryForm articleId={id} />;
}
