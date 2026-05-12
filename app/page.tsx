"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/tb-ai");
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#dff3f6] px-6 text-center text-brand-ink">
      <a className="text-base font-semibold text-brand-green underline underline-offset-4" href="/tb-ai">
        正在跳转到活动页，若未自动跳转请点击这里
      </a>
    </main>
  );
}
