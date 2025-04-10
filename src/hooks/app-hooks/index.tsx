import { ApiConstant } from "@/const";
import { useAppContext } from "@/context";

const useAppService = () => {
  const { setUserInfo } = useAppContext();

  const handleGetUserInfo = async () => {
    try {
      const response = { status: ApiConstant.STT_OK, data: {} } as any; // Replace with actual API call

      if (response.status === ApiConstant.STT_OK) {
        // setUserInfo(response.data);
        setUserInfo({
          address: "Da Nang",
          email: "vertext@gmail.com",
          userName: "Vertext",
        });
      } else {
        setUserInfo({});
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
