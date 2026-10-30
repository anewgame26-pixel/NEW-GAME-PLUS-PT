import Image from "next/image";
import Link from "next/link";
import { TeamMember } from "@/lib/data/team";
import { Card } from "@/components/ui/Card";
import { Trophy } from "lucide-react";
import { authorPath } from "@/lib/data/authors";

interface TeamGridProps {
  members: TeamMember[];
}

export function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {members.map((member) => (
        <Link key={member.id} href={authorPath(member.name)} className="flex">
        <Card hover className="flex w-full flex-col gap-3 p-5">
          {member.photoUrl ? (
            <div className="relative h-14 w-14 overflow-hidden rounded-sm">
              <Image src={member.photoUrl} alt={member.name} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-primary/10 font-display text-lg font-bold text-primary">
              {member.avatarInitials}
            </div>
          )}
          <div>
            <p className="font-display text-sm font-bold text-ink">{member.name}</p>
            <p className="text-xs uppercase tracking-wide text-ink-dim">{member.role}</p>
          </div>
          <p className="text-sm text-ink-muted">{member.bio}</p>
          {member.favoriteGame && (
            <div className="mt-auto flex items-center gap-1.5 border-t border-border pt-3 text-xs text-ink-muted">
              <Trophy width={12} height={12} className="text-gold" />
              Platina favorita: <span className="text-ink">{member.favoriteGame}</span>
            </div>
          )}
        </Card>
        </Link>
      ))}
    </div>
  );
}
