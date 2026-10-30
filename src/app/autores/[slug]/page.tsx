import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GameBreadcrumb } from "@/components/game/GameBreadcrumb";
import { Card } from "@/components/ui/Card";
import { getArticlesByAuthor, getAuthorBySlug } from "@/lib/data/authors";
import { formatDateLong } from "@/lib/utils";

export const revalidate = 300;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Autor não encontrado | NewGame+" };
  return {
    title: `${author.name} | NewGame+`,
    description: author.bio
      ? author.bio.slice(0, 160)
      : `Artigos escritos por ${author.name} na NewGame+.`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(author.id);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    url: `https://newgameplus.pt/autores/${slug}`,
    worksFor: { "@type": "Organization", name: "NewGame+ PT" },
    ...(author.photoUrl ? { image: author.photoUrl } : {}),
  };

  return (
    <>
      <Header />
      <GameBreadcrumb
        items={[{ label: "Sobre Nós", href: "/covil" }, { label: author.name }]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <main>
        <div className="border-b border-border bg-bg-raised py-10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 sm:flex-row sm:items-center lg:px-8">
            {author.photoUrl ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm">
                <Image
                  src={author.photoUrl}
                  alt={author.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-sm bg-primary/10 font-display text-3xl font-bold text-primary">
                {author.avatarInitials}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                {author.role}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-ink">
                {author.name}
              </h1>
              {author.bio && (
                <p className="mt-2 max-w-2xl text-sm text-ink-muted">{author.bio}</p>
              )}
              {author.favoriteGame && (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
                  <Trophy width={12} height={12} className="text-gold" />
                  Platina favorita: <span className="text-ink">{author.favoriteGame}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-4 py-10 lg:px-8">
          <h2 className="mb-5 font-display text-lg font-bold uppercase tracking-wide text-ink">
            Artigos de {author.name}
          </h2>
          {articles.length === 0 ? (
            <p className="py-8 text-sm text-ink-muted">
              Ainda não há artigos publicados por {author.name}.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.key} href={article.href}>
                  <Card hover className="h-full overflow-hidden">
                    <div className="relative aspect-video bg-bg-surface2">
                      {article.imageUrl && (
                        <Image
                          src={article.imageUrl}
                          alt={article.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                      )}
                      <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {article.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-display text-base font-bold uppercase tracking-wide text-ink">
                        {article.title}
                      </p>
                      <p className="mt-1 text-xs text-ink-dim">
                        {formatDateLong(article.date)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
