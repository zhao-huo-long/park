import { CoverImage, Image, View, } from '@tarojs/components'
import baseImg from './map.jpg'
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
  lines?: string[]
  onClickEle?: (data: any) => void
}

export default function LayoutCnt(props: Props) {
  const { base = baseImg, dynElements = [], onClickEle } = props
  const [renderView, setRenderView] = useState({ width: 0, height: 0 })
  const xratio = renderView.width / 5906
  const yratio = renderView.height / 11811
  useEffect(() => {
  }, [])
  return (
    <View className='layoutCnt'>
      <img
        className='base static-img-ele'
        id='map-base'
        onLoad={(e) => {
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
          setRenderView({
            height: e.detail.height as number,
            width: e.detail.width as number,
          })
        }}
        src={base}
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
          return <img crossOrigin="anonymous" onError={(e) => console.log('图片加载错误', e)} key={ele?.src?.replace(/^https:/, 'http:')} data-x={ele.x} data-y={ele.y} onClick={() => onClickEle?.({ ...ele })} src={ele.src} className='static-img-ele' style={{ top: y, left: x, width: w, height: h }} />
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
