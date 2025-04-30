import { postApi } from "@/api/apiClient"
import { api_url } from "@/api/url"

export const loginFunction = async (data : object)=>{
    const comUrl = api_url.baseUrl + api_url.user.login
    const response = await postApi(comUrl, data)
    
    
    return response
    
}

export const verifyOtp = async (data : object)=>{
    const comUrl = api_url.baseUrl + api_url.user.verifyOtp 
    const response = await postApi(comUrl ,data)
    return response
    
    
}