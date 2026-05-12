import { BadgeCheck } from "lucide-react";

type BrandHeaderProps = {
  brandName: string;
  pageTitle: string;
  subTitle: string;
  logoImage?: string;
};

export function BrandHeader({ brandName, pageTitle, subTitle, logoImage }: BrandHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1.5 shadow-soft">
        {logoImage ? (
          <img
            src={logoImage}
            alt={`${brandName} Logo`}
            className="h-full w-full object-contain"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="grid h-full w-full place-items-center rounded-md bg-brand-green text-lg font-bold text-white">
            金
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-green">
          <BadgeCheck className="h-4 w-4" aria-hidden="true" />
          <span>{brandName}官方</span>
        </div>
        <h1 className="mt-0.5 text-xl font-bold leading-tight text-brand-ink">{pageTitle}</h1>
        <p className="mt-1 text-sm leading-5 text-brand-ink/70">{subTitle}</p>
      </div>
    </header>
  );
}
