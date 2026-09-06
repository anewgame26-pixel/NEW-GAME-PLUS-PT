import { HourWithForm } from "@/components/admin/HourWithForm";

interface EditarUmaHoraComPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarUmaHoraComPage({ params }: EditarUmaHoraComPageProps) {
  const { id } = await params;
  return <HourWithForm articleId={id} />;
}
