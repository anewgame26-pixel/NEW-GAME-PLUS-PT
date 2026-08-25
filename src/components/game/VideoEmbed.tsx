import { Youtube } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface VideoEmbedProps {
  videoId?: string;
  title: string;
}

export function VideoEmbed({ videoId, title }: VideoEmbedProps) {
  return (
    <section id="video" className="scroll-mt-20 border-t border-border py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <div className="mb-5 flex items-center gap-2">
          <Youtube width={18} height={18} className="text-primary" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Vídeo do Canal
          </h2>
        </div>

        <Card className="overflow-hidden">
          {videoId ? (
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`Vídeo Antes da Platina — ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-bg-surface2 p-8 text-center">
              <Youtube width={36} height={36} className="text-ink-dim" />
              <p className="text-sm text-ink-muted">
                O vídeo &quot;Antes da Platina&quot; de {title} ainda está a caminho.
              </p>
              <a
                href="#"
                className="text-xs font-medium text-primary hover:text-primary-light"
              >
                Segue o canal para não perderes a estreia →
              </a>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
