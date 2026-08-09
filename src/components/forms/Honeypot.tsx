/**
 * Campo "isco" (honeypot) contra bots simples de spam.
 *
 * Como funciona: este campo fica completamente invisível e inacessível
 * para uma pessoa real (está fora do ecrã, e escondido de leitores de
 * ecrã). Bots simples costumam preencher TODOS os campos de um
 * formulário às cegas, incluindo este — por isso, se ele vier
 * preenchido, sabemos que não foi uma pessoa a submeter o formulário, e
 * ignoramos o envio silenciosamente (sem mostrar erro, para não ensinar
 * o bot a evitar este truque).
 *
 * Uso:
 *   const [honeypot, setHoneypot] = useState("");
 *   ...
 *   if (honeypot) return; // no início do handleSubmit
 *   ...
 *   <Honeypot value={honeypot} onChange={setHoneypot} />
 *
 * Isto não substitui proteção contra bots mais sofisticados, mas trava a
 * grande maioria do spam automático sem precisar de nenhum serviço
 * externo nem chaves de API.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
    />
  );
}
