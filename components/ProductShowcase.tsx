import { ShoppingBag } from "lucide-react";

type ProductShowcaseProps = {
  productImage?: string;
};

export function ProductShowcase({ productImage }: ProductShowcaseProps) {
  return (
    <section className="overflow-hidden rounded-lg bg-white shadow-soft">
      <div className="grid gap-1 p-4 sm:grid-cols-[1fr_1.08fr] sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-green">
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>本期推荐</span>
          </div>
          <h2 className="mt-3 text-xl font-bold leading-tight text-brand-ink">
            金银花柚子汁
            <br />
            山楂青梅汁
          </h2>
          <p className="mt-3 text-sm leading-6 text-brand-ink/70">
            清爽果汁饮品组合，适合作为活动页商品宣传元素，也方便后续扩展更多 SKU。
          </p>
        </div>
        <div className="relative min-h-48 rounded-lg bg-[linear-gradient(145deg,#f7ffe8_0%,#e8f7ee_100%)]">
          {productImage ? (
            <img
              src={productImage}
              alt="金豆芽推荐产品组合"
              className="absolute inset-0 h-full w-full object-contain p-2"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
