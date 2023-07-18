import Taro from "@tarojs/taro";
import axios from "axios";

const request = axios.create({
  baseURL: "http://39.107.79.30",
});

request.interceptors.response.use(function(result){
  if(!result?.data?.success){
    Taro.showToast({
      icon: 'error',
      title: result?.data?.resultMsg
    })
    console.log(result?.request, JSON.stringify(result?.data))
  }
  return result
})

export default request;
