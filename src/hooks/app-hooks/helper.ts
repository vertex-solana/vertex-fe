import {
  AssetInterface,
  SupportTokenType,
  PriceFeedsResponseInterface,
} from "@/models";
import { Map } from "immutable";

export const handleRefactorPythPriceFeeds = (
  data: PriceFeedsResponseInterface[],
  availableAssets: Map<SupportTokenType, AssetInterface>
) => {
  let priceFeeds = Map();

  if (data && data.length) {
    Array.from(availableAssets.values()).map((asset, index) => {
      if (!asset.priceFeedId) return;

      const price = data[index]?.price
        ? Number(data[index]?.price?.price) *
          Math.pow(10, data[index]?.price?.expo)
        : 0;

      priceFeeds = priceFeeds.set(asset.symbol, {
        price: isNaN(price) ? 0 : price,
        priceFeedIf: asset.priceFeedId,
      });
    });
  }

  return priceFeeds;
};
