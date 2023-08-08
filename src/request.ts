import Taro from "@tarojs/taro";
import axios from "axios";
import res from "./res";

const request = axios.create({
  baseURL: "http://www.dygongyuan.cn",
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

export default async (path: string, config: any) => {
  // if(path){
  //   return res[path]
  // }
  return request(path, config)
}
