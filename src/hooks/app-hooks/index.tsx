import { Map } from "immutable";
import { ApiConstant } from "@/const";
import { AppService } from "@/services";
import { useAppContext } from "@/context";
import { handleRefactorPythPriceFeeds } from "./helper";
import { AssetInterface, PriceFeedInterface, SupportTokenType } from "@/models";

const useAppService = () => {
  const { setUserInfo } = useAppContext();

  const handleGetUserInfo = async () => {
    try {
      const response = await AppService.getUserInfoService();

      if (response.status === ApiConstant.STT_OK) {
        setUserInfo(response.data);
      } else {
        setUserInfo({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAssets = async () => {
    const res = await AppService.getAssetsService();

    return res?.data || ([] as AssetInterface[]);
  };

  const handleGetPythTokensPriceFeed = async (
    availableAssetsMap: Map<SupportTokenType, AssetInterface>
  ) => {
    const data = await AppService.getPythTokensPriceFeedService(
      availableAssetsMap
    );

    if (!data) return Map() as Map<SupportTokenType, PriceFeedInterface>;

    const refactorPriceFeedData = handleRefactorPythPriceFeeds(
      data,
      availableAssetsMap
    );

    return refactorPriceFeedData as Map<SupportTokenType, PriceFeedInterface>;
  };

  const handleGetElanderEligible = async () => {
    const res = AppService.getElanderEligibleService();

    return res;
  };

  return {
    handleGetAssets,
    handleGetUserInfo,
    handleGetElanderEligible,
    handleGetPythTokensPriceFeed,
  };
};

export default useAppService;
