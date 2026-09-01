import { RadarForm } from "@/components/admin/RadarForm";

interface EditarRadarPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarRadarPage({ params }: EditarRadarPageProps) {
  const { id } = await params;
  return <RadarForm articleId={id} />;
}
