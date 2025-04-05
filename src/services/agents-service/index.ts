import { ApiConstant } from "@/const";
import { ApiResponse } from "apisauce";
import { AgentName } from "@/models/app.model";
import { createAgentServices } from "../config";
import { AgentsResponseInterface } from "@/models";

interface AgentsResponseData {
  agents?: AgentsResponseInterface[];
}

const getAgentResponseData = (response: ApiResponse<any>) => {
  const status = response?.status;
  const data = response?.data;

  if (!status || !data) return undefined;

  if (status >= 400 && status <= 500) return undefined;

  if (status >= 200 && status <= 300) {
    return response.data;
  } else {
    return undefined;
  }
};

export const getAgentService = async (agentName: AgentName) => {
  const response: ApiResponse<AgentsResponseData> =
    await createAgentServices().get(
      `agent/api/${ApiConstant.GET_AGENTS}/${agentName}`
    );

  const responseData = getAgentResponseData(response);

  if (responseData) {
    return responseData.data.agents as AgentsResponseInterface[];
  } else {
    return undefined;
  }
};

export const getRemainingCredits = async () => {
  const response: ApiResponse<{
    remainingCredits: number;
  }> = await createAgentServices().get(ApiConstant.GET_REMAINING_CREDIT);

  const responseData = getAgentResponseData(response);

  if (responseData) {
    return responseData.data;
  } else {
    return undefined;
  }
};
