type HeroBannerProps = {
  heroImage?: string;
  brandName: string;
};

export function HeroBanner({ heroImage, brandName }: HeroBannerProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/70 bg-white shadow-soft">
      <div className="relative aspect-[16/9] w-full">
        <div className="flex h-full w-full items-center justify-between bg-[linear-gradient(135deg,#fff6dc_0%,#e7f3de_48%,#d8efe4_100%)] px-6">
          <div className="max-w-[58%]">
            <p className="text-sm font-semibold text-brand-gold">金豆芽官方活动</p>
            <p className="mt-3 text-2xl font-bold leading-tight text-brand-ink">
              淘宝 AI 购物
              <br />
              推荐口令
            </p>
            <p className="mt-3 text-sm leading-5 text-brand-ink/65">
              主视觉图位已预留，可替换为活动 KV 或商品海报。
            </p>
          </div>
          <div className="relative h-28 w-24 shrink-0 rounded-[2rem] bg-white/80 shadow-lg">
            <div className="absolute left-1/2 top-4 h-14 w-14 -translate-x-1/2 rounded-full bg-brand-citrus/80" />
            <div className="absolute bottom-4 left-1/2 h-12 w-16 -translate-x-1/2 rounded-lg bg-brand-green/90" />
          </div>
        </div>
        {heroImage ? (
          <img
            src={heroImage}
            alt={`${brandName}活动主视觉`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
