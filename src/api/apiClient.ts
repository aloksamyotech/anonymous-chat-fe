import axios from "axios";
import { api_url } from "./url";

export const getApi = async (
  url: string,
  params: Record<string, any> = {},
  headers: Record<string, any> = {}
): Promise<any> => {
  try {
    const response = await axios.get(url, {
      params,
    });
    return response?.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postApi = async (url: string, data: Object): Promise<any> => {
  try {
    const response = await axios.post(url, data);

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export async function postWithAuth<T>(
  url: string,
  token: string,
  data?: any
): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result as T;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
}
