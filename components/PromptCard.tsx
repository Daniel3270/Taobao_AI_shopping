import { Clipboard } from "lucide-react";

type PromptCardProps = {
  promptText: string;
};

export function PromptCard({ promptText }: PromptCardProps) {
  return (
    <section className="rounded-lg border border-brand-citrus/35 bg-white p-4 shadow-soft">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-gold">
        <Clipboard className="h-4 w-4" aria-hidden="true" />
        <span>推荐购物提示词</span>
      </div>
      <p className="select-text break-words rounded-lg border border-dashed border-brand-citrus/70 bg-brand-paper px-4 py-4 text-lg font-bold leading-8 text-brand-ink">
        {promptText}
      </p>
    </section>
  );
}
