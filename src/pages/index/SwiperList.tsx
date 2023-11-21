import { } from '@nutui/nutui-react-taro';
import { Swiper, SwiperItem } from '@tarojs/components'

export const list = {
  '龙凤呈祥': [
    'https://www.dygongyuan.cn/static/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E9%BE%99%E5%87%A4%E5%91%88%E7%A5%A5/1.png',
    'https://www.dygongyuan.cn/static/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E9%BE%99%E5%87%A4%E5%91%88%E7%A5%A5/2.png',
  ],
  '中华魂': [
    'https://www.dygongyuan.cn/static/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E4%B8%AD%E5%8D%8E%E9%AD%82/1.png',
    'https://www.dygongyuan.cn/static/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E4%B8%AD%E5%8D%8E%E9%AD%82/2.png',
    'https://www.dygongyuan.cn/static/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E4%B8%AD%E5%8D%8E%E9%AD%82/3.png',
  ],
  '世纪大鼎': [
    'https://www.dygongyuan.cn/static/%E8%BD%AE%E6%92%AD%E5%9B%BE/%E4%B8%96%E7%BA%AA%E5%A4%A7%E9%BC%8E/1.png',
  ],
};


export default (props) => {
  const { name = "龙凤呈祥" } = props
  return <Swiper
    circular
    indicatorDots
    autoplay
  >
    {
      list[name]?.map?.(i => {
        return <SwiperItem key={i}>
          <img width="100%" height="100%" src={i} alt="" />
        </SwiperItem>
      })
    }
  </Swiper>
}
