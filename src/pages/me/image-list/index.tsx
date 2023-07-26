import { View, Image } from "@tarojs/components"
import img1 from '../img/a1.jpeg'
import img2 from '../img/a2.jpg'
import img3 from '../img/a3.jpg'
import img4 from '../img/a4.jpg'
import img5 from '../img/a5.jpg'
// import img6 from '../img/a6.jpg'
// import img7 from '../img/a7.jpg'
// import img8 from '../img/a8.jpg'
// import img9 from '../img/a9.jpeg'
import './index.less'

const Images = [img1, img2, img3, img4, img5, ]

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
