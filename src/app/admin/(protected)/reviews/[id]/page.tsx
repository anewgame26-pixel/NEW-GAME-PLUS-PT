import { ReviewForm } from "@/components/admin/ReviewForm";

interface EditarReviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarReviewPage({ params }: EditarReviewPageProps) {
  const { id } = await params;
  return <ReviewForm articleId={id} />;
}
