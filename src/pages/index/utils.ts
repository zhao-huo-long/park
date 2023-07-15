import Taro from '@tarojs/taro'

export function goToMePage() {
  Taro.navigateTo({
    url: '/pages/me/index',
    success: function (res) {
      console.log(`跳转成功`, res)
    }
  })
}
