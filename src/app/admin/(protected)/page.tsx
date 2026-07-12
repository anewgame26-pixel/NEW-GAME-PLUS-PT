export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
        Bem-vindo ao painel
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        Login confirmado — esta página só é visível para editores autenticados. Os
        formulários para editar jogos, análises, glossário, etc. vão aparecer aqui
        nos próximos passos.
      </p>
    </div>
  );
}
