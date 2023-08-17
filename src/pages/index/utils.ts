import Taro from '@tarojs/taro'

export function goToMePage() {
  Taro.navigateTo({
    url: '/pages/me/index',
    success: function (res) {
      console.log(`跳转成功`, res)
    }
  })
}

export function createHotImg(width: number, height: number, mark: { x: number, y: number, src: string }) {
  if (process.env.TARO_ENV === 'weapp') {
    const cans = Taro.createOffscreenCanvas({ type: '2d', width, height })
    const context = cans.getContext('2d')
    if (mark) {
      const img = cans.createImage()
      console.log('mark', mark, width, height)
      return new Promise(res => {
        img.onload = function () {
          context.drawImage(img, 300, 300, 300, 150)
          const d = cans.toDataURL(0, 0, width, height)
          return res(d)
        }
        img.src = mark.src
      })
    }
    // return cans.getContext('2d').getImageData(0, 0, width, height)
    // return mark.src
    return cans.toDataURL(0, 0, width, height)
  }
}
export function isHotClick(clickPoint: { x: number, y: number }, hotPoint: { x: number, y: number }, ratio: number) {
  return Math.pow(ratio * 100, 2) >= Math.pow(Math.abs(hotPoint.x - clickPoint.x), 2) + Math.pow(Math.abs(hotPoint.y - clickPoint.y), 2)
}

export function getLocation() {
  if (process.env.TARO_ENV === 'weapp') {
    return new Promise(resolve => {
      Taro.getLocation({
        type: 'wgs84',
        success: function (res) {
          const latitude = res.latitude
          const longitude = res.longitude
          resolve({ latitude, longitude })
        },
        fail(e){
          console.log('e', e)
        }
      })
    })

  }
}

export const filterOption = [
  {
    value: '*',
    text: '全部'
  },
  {
    value: 'scenic_spot',
    text: '景点'
  },
  {
    value: 'wc',
    text: '公厕'
  },
  {
    value: 'bm',
    text: '便民'
  },
  {
    value: 'recreation',
    text: '娱乐'
  },
]
