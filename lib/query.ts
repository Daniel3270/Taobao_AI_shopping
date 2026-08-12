export type CampaignQuery = {
  scene?: string;
  channel?: string;
  campaignId?: string;
  storeId?: string;
  sku?: string;
  target?: string;
};

const trackedKeys: Array<keyof CampaignQuery> = [
  "scene",
  "channel",
  "campaignId",
  "storeId",
  "sku",
  "target",
];

function normalizeCampaignQueryValue(key: keyof CampaignQuery, value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (key === "channel" || key === "target") {
    return trimmedValue.toLowerCase();
  }

  return trimmedValue;
}

export type ShoppingTarget = "taobao" | "qianwen" | "shangou";

export function getShoppingTarget(query: CampaignQuery): ShoppingTarget {
  if (query.target === "qianwen" || query.target === "shangou") {
    return query.target;
  }

  return "taobao";
}

export function getCampaignQuery(searchParams: URLSearchParams): CampaignQuery {
  const query: CampaignQuery = {};

  trackedKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      const normalizedValue = normalizeCampaignQueryValue(key, value);
      if (normalizedValue) {
        query[key] = normalizedValue;
      }
    }
  });

  return query;
}
