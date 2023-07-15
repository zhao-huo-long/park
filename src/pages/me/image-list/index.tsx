import { View, Image } from "@tarojs/components"
import img1 from '../img/头像1.jpeg'
import img2 from '../img/头像2.jpg'
import img3 from '../img/头像3.jpg'
import img4 from '../img/头像4.jpg'
import img5 from '../img/头像5.jpg'
import img6 from '../img/头像6.jpg'
import img7 from '../img/头像7.jpg'
import img8 from '../img/头像8.jpg'
import img9 from '../img/头像9.jpeg'
import './index.less'

const Images = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

export default function ImageList(props: { onClick: (v: string) => void, value: string }) {
  return <View className="ava-list">
    {
      Images.map(i => {
        let style = "ava"
        if(i === props.value){
          style = 'ava ava-check'
        }
        return <Image webp={true} onClick={() => props?.onClick?.(i)} className={style} key={i} src={i} />
      })
    }
  </View>
}
