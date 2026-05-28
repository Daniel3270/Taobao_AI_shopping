export type CampaignQuery = {
  scene?: string;
  channel?: string;
  campaignId?: string;
  storeId?: string;
  sku?: string;
};

const trackedKeys: Array<keyof CampaignQuery> = [
  "scene",
  "channel",
  "campaignId",
  "storeId",
  "sku",
];

function normalizeCampaignQueryValue(key: keyof CampaignQuery, value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  if (key === "channel") {
    return trimmedValue.toLowerCase();
  }

  return trimmedValue;
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
