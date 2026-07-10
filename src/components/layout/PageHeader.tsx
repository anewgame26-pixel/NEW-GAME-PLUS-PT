interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-bg-raised py-8">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-8">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-ink">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
    </div>
  );
}
