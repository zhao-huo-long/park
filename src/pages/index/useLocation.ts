import Taro from "@tarojs/taro"
import { useEffect } from "react"

export default () => {

  useEffect(() => {
    function l(res){
      console.log(res)
    }
    Taro.onLocationChange(l)
    return () => {
      Taro.offLocationChange(l)
    };
  }, [])
  return
}
