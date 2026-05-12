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

export function getCampaignQuery(searchParams: URLSearchParams): CampaignQuery {
  const query: CampaignQuery = {};

  trackedKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      query[key] = value;
    }
  });

  return query;
}
