import { } from '@nutui/nutui-react-taro';
import { Swiper, SwiperItem } from '@tarojs/components'

const list = {
  '龙凤呈祥': [
    'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
    'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
    'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
    'https://storage.360buyimg.com/jdc-article/fristfabu.jpg'
  ],
  '中华魂': [
    'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
    'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
    'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
    'https://storage.360buyimg.com/jdc-article/fristfabu.jpg'
  ],
  '世纪大鼎': [
    'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
    'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
    'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
    'https://storage.360buyimg.com/jdc-article/fristfabu.jpg'
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
