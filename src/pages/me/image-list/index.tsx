import { View, Image } from "@tarojs/components"
import img1 from '../img/gou.png'
import img2 from '../img/hou.png'
import img3 from '../img/hu.png'
import img4 from '../img/ji.png'
import img5 from '../img/long.png'
import img6 from '../img/ma.png'
import img7 from '../img/niu.png'
import img8 from '../img/she.png'
import img9 from '../img/shu.png'
import img10 from '../img/tu.png'
import img11 from '../img/yang.png'
import img12 from '../img/zhu.png'

import './index.less'

const Images = [
  img1, img2, img3, img4,
  img5, img6, img7, img8, img9, img10, img11, img12
]

export default function ImageList(props: { onClick: (v: string) => void, value: string }) {
  return <View className="ava-list">
    {
      Images.map(i => {
        let style = "ava"
        if (i === props.value) {
          style = 'ava ava-check'
        }
        return <Image style={{ objectFit: 'cover' }} webp={true} onClick={() => props?.onClick?.(i)} className={style} key={i} src={i} />
      })
    }
  </View>
}
