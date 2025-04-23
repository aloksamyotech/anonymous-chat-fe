import { postWithAuth } from "@/api/apiClient";
import { api_url } from "@/api/url";

type VerifyResponse = {
  valid: boolean;
  user?: any;
};

export const tokenVerify = async (token: string) => {
  const comUrl = api_url.baseUrl + api_url.verifyToken.verify;
  const response = await postWithAuth<VerifyResponse>(comUrl, token);
  
};
