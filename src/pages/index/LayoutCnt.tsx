import { View, } from '@tarojs/components'
import baseImg from './map-new.jpeg'
import { useEffect, useState } from 'react'
import './index.less'
import Taro from '@tarojs/taro'
const h5 = process.env.TARO_ENV === 'h5'

interface Props {
  base?: string,
  dynElements?: {
    src: string,
    width: number,
    height: number,
    x: number,
    y: number,
    style?: any
  }[],
  onClick?: () => void
  lines?: string[]
  onClickEle?: (data: any) => void
}

export default function LayoutCnt(props: Props) {
  const { base = baseImg, dynElements = [], onClickEle } = props
  const [renderView, setRenderView] = useState({ width: 0, height: 0 })
  let xratio = renderView.width / 5906
  let yratio = renderView.height / 11811
  if(h5){
    xratio = renderView.width /  11811
    yratio = renderView.height / 5906
  }
  useEffect(() => {
  }, [])
  console.log(props.dynElements)
  return (
    <View className='layoutCnt'
      style={{
        marginTop: h5 ? 0 : undefined,
        width: h5 ? '100%' : undefined
      }}
      onClick={props?.onClick}>
      <img
        className='base static-img-ele'
        id='map-base'
        onLoad={(e) => {
          console.log('e', e)
          if (process.env.TARO_ENV === 'weapp') {
            const query = Taro.createSelectorQuery()
            query.select('#map-base').boundingClientRect()
            query.exec(function (res) {
              setRenderView({
                height: res[0].height as number,
                width: res[0].width as number,
              })
            })
            return
          }
          if (h5) {
            const el = document.getElementById('map-base')!
            setRenderView({
              height: el.clientHeight as number,
              width: el.clientWidth as number,
            })
          }

        }}
        src={h5? 'http://localhost:3000/static/hen.jpg' : base}
      />
      {
        props.lines?.map(i => {
          return <img className='base static-img-ele'
            src={i}
          />
        })
      }
      {
        !!xratio && dynElements.map(ele => {
          const x = ele.x * xratio
          const y = ele.y * yratio
          const w = ele.width * xratio
          const h = ele.height * yratio
          if (!ele?.src) {
            return null
          }
          return <img
            crossOrigin="anonymous"
            onError={(e) => console.log('图片加载错误', e)}
            key={ele?.src}
            data-x={ele.x}
            data-y={ele.y}
            onClick={(e) => {
              e.stopPropagation()
              onClickEle?.({ ...ele });
            }}
            src={ele.src}
            className='static-img-ele'
            style={{ ...(ele.style || {}), top: y, left: x, width: w, height: h, }}
          />
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
