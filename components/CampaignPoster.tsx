type CampaignPosterProps = {
  posterImage?: string;
};

export function CampaignPoster({ posterImage }: CampaignPosterProps) {
  if (!posterImage) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-lg bg-white p-3 shadow-soft">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-brand-green">活动海报</h2>
        <span className="text-xs text-brand-ink/45">移动端 4:5 KV</span>
      </div>
      <img
        src={posterImage}
        alt="金豆芽淘宝 AI 购物活动海报"
        className="w-full rounded-md object-cover"
        onError={(event) => {
          event.currentTarget.closest("section")?.remove();
        }}
      />
    </section>
  );
}
