import { CoverImage, Image, View, } from '@tarojs/components'
import baseImg from './map-min.jpg'
import { useEffect, useState } from 'react'
import './index.less'
import Taro from '@tarojs/taro'

interface Props {
  base?: string,
  dynElements?: {
    src: string,
    width: number,
    height: number,
    x: number,
    y: number,
  }[],
  onClickEle?: (data: any) => void
}

export default function LayoutCnt(props: Props) {
  const { base = baseImg, dynElements = [], onClickEle } = props
  const [renderView, setRenderView] = useState({ width: 0, height: 0 })
  const ratio = renderView.width / 5906
  useEffect(() => {
  }, [])
  console.log(ratio)
  return (
    <View className='layoutCnt'>
      <img
        className='base static-img-ele'
        id='map-base'
        onLoad={(e) => {
          if(process.env.TARO_ENV === 'weapp'){
            const query = Taro.createSelectorQuery()
            query.select('#map-base').boundingClientRect()
            query.exec(function(res){
              setRenderView({
                height: res[0].height as number,
                width: res[0].width as number,
              })
            })
            return
          }
          setRenderView({
            height: e.detail.height as number,
            width: e.detail.width as number,
          })
        }}
        src={base}
      />
      {
        !!ratio && dynElements.map(ele => {
          const x = ele.x * ratio
          const y = ele.y * ratio
          const w = ele.width * ratio
          const h = ele.height * ratio
          return <img key={ele.src} onClick={() => onClickEle?.({ ...ele })} src={ele.src} className='static-img-ele' style={{ top: y, left: x, width: w, height: h }} />
        })
      }
      {/* {
        !!ratio && <View className='static-img-ele' onClick={e => {
          const clientX = e.clientX
          const clientY = e.clientY
        }} style={{ width: renderView.width, height: renderView.height }}>
        </View>
      } */}
    </View>
  )
}
