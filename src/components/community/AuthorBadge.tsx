import { User as UserIcon, ExternalLink } from "lucide-react";

interface AuthorBadgeProps {
  username: string | null;
  avatarUrl: string | null;
  psnUrl: string | null;
  createdAt?: string;
}

export function AuthorBadge({ username, avatarUrl, psnUrl, createdAt }: AuthorBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10 text-accent">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserIcon width={15} height={15} />
        )}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <p className="font-display text-sm font-semibold text-ink">{username || "Visitante"}</p>
          {psnUrl && (
            <a
              href={psnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-accent hover:text-accent/80"
            >
              PSN
              <ExternalLink width={9} height={9} />
            </a>
          )}
        </div>
        {createdAt && (
          <p className="text-[11px] text-ink-dim">
            {new Date(createdAt).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
