import { ApiConstant } from "@/const";
import { useAppContext } from "@/context";
import { axiosInstance } from "@/services/config";

const useAppService = () => {
  const { setUserInfo } = useAppContext();

  const handleGetUserInfo = async (accountId: number) => {
    try {
      const response = await axiosInstance.get(
        ApiConstant.GET_ACCOUNT(accountId)
      );

      if (response.status === ApiConstant.STT_OK) {
        setUserInfo(response.data.data);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleGetUserInfo,
  };
};

export default useAppService;
