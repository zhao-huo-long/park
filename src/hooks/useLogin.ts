import { useEffect, useState } from "react";
import request from "../request";
import Taro from "@tarojs/taro";
// import img1 from '../img/a1.jpeg'
import img1 from '../pages/me/img/niu.png'


export default function () {
  const [data, setData] = useState({})
  useEffect(() => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.login({
        success: async function (res) {
          const b = await Taro.getUserInfo()
          if (res.code) {
            const result = await request('/skgy/login/weiXinLogout', {
              method: 'post',
              data: {
                code: res.code,
                iv: b.iv,
                encryptedData: b.encryptedData
              },
            })
            if (result?.data?.success) {
              const data = result?.data?.resultSet
              const { data: userRes = {} } = await request('/skgy/tour/query', { params: { logNumber: data?.logNumber } }) || {}
              setData({
                ...userRes.resultSet,
                name: userRes?.resultSet?.name || '游客',
                headPortrait: userRes?.resultSet?.headPortrait || img1,
                wxMsg: b.userInfo,
              })
            }
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  }, []);
  console.log('user', data)
  return [data, setData]
}
