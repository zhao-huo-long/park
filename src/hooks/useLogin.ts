import { useEffect, useState } from "react";
import request from "../request";
import Taro from "@tarojs/taro";
// import img1 from '../img/a1.jpeg'
import img1 from '../pages/me/img/a1.jpeg'


export default function () {
  const [data, setData] = useState({})
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.login({
        success: async function (res) {
          console.log(res)
          if (res.code) {
            const result = await request('/skgy/login/weiXinLogout', {
              method: 'post',
              params: {
                code: res.code
              },
              data: null,
            })
            if (result?.data?.success) {
              const data = result?.data?.resultSet
              const { data: userRes = {} } = await request('/skgy/tour/query', { params: { logNumber: data?.logNumber } }) || {}
              setData({ ...userRes.resultSet, name: userRes?.resultSet?.name || '游客', headPortrait: userRes?.resultSet?.headPortrait || img1 })
            }
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  }, []);
  return [data, setData]
}
