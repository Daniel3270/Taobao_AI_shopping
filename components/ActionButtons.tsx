import { Copy, ExternalLink } from "lucide-react";

type ActionButtonsProps = {
  buttonText: string;
  disabled?: boolean;
  onCopyAndOpen: () => void;
  onCopyOnly: () => void;
};

export function ActionButtons({
  buttonText,
  disabled,
  onCopyAndOpen,
  onCopyOnly,
}: ActionButtonsProps) {
  return (
    <section className="space-y-3">
      <button
        type="button"
        disabled={disabled}
        onClick={onCopyAndOpen}
        className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-5 text-base font-bold text-white shadow-soft transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ExternalLink className="h-5 w-5" aria-hidden="true" />
        <span>{buttonText}</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={onCopyOnly}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-brand-green/30 bg-white px-5 text-base font-semibold text-brand-green transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Copy className="h-5 w-5" aria-hidden="true" />
        <span>仅复制口令</span>
      </button>
    </section>
  );
}
