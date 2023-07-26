import { View, Text, Button, WebView, Image } from '@tarojs/components'
import Taro, { useLoad, createSelectorQuery } from '@tarojs/taro'
import './index.less'
import { globalInfoContext } from '../../context'
import { useContext, useEffect, useRef, useState } from 'react'
import { NavBar, Popup, Tabbar } from '@nutui/nutui-react-taro';
import { Home, My } from '@nutui/icons-react-taro';
import { createHotImg, getLocation, goToMePage, isHotClick } from './utils'
import mapImg from './map-min.jpg'
import request from '../../request'
import img1 from "./a1.jpeg"
import { PlayStart, Voice } from '@nutui/icons-react-taro'
import { Video } from '@nutui/nutui-react-taro';


const oWidth = 5906

export default function Index() {
  const state = useContext(globalInfoContext)
  // const [ratio, setRatio] = useState(1)
  const [info, setState] = useState({
    ratio: 1,
    hotImg: '',
    point: [],
    detail: 0,
    location: [],
  })
  const {
    ratio,
    hotImg,
    point = [],
    detail = 0,
    location: []
  } = info
  const config = useRef({
    width: 0,
    height: 0
  })
  useEffect(() => {
    request('/skgy/tour/queryScenicSpot', {}).then(e => {
      console.log(e)
      setState({
        ...info, point: e.resultSet || []
      } as any)
    })

  }, [])
  console.log(point[detail])
  const detailMsg = point[detail]
  return (
    <View className='index'>
      <View style={{ position: 'relative', }}>
        <Image style={{ 'width': '100%', position: 'absolute', 'top': 0 }} id='test' onLoad={() => {
          console.log(process.env.TARO_ENV)
          if (process.env.TARO_ENV === 'weapp') {
            const query = createSelectorQuery()
            query.select('#test').boundingClientRect()
            query.exec(function ([wdom]) {
              config.current.height = wdom.height
              config.current.width = wdom.width
              setState({ ...info, ratio: wdom.width / oWidth, hotImg: createHotImg(wdom.width, wdom.height) })
              // getLocation()?.then((e: any) => {
              //   const innerAudioContext = Taro.createInnerAudioContext()
              //   innerAudioContext.autoplay = true
              //   innerAudioContext.src = 'https://storage.360buyimg.com/jdrd-blog/27.mp3'
              //   innerAudioContext.onPlay(() => {
              //     console.log('开始播放')
              //   })
              //   createHotImg(config.current.width, config.current.height, { x: 1, y: 2, src: img1 })
              //     .then(res => {
              //       setState((info) => ({ ...info, hotImg: res }))
              //     })
              // })
            })
          }
        }
        } src={mapImg} mode="widthFix" />
        {
          hotImg && <Image className='faker' onClick={(e) => {
            point.some((i, index) => {
              const [x, y] = i['location'].split(',').map(i => Number(i) * ratio)
              const isClick = isHotClick(e.detail, { x, y }, ratio)
              console.log('isClick', isClick, x, y)
              if (isClick) {
                setState({ ...info, detail: index, vis: true })
              }
              return isClick
            })
          }} style={{ position: 'absolute', 'top': 0, 'width': '100%' }} mode="widthFix" src={hotImg}></Image>
        }
      </View>
      <Tabbar style={{ visibility: "hidden" }} value={0} >
        <Tabbar.Item key={'title'} title="首页" icon={<Home width={20} height={20} />} />
        <Tabbar.Item title="我的" icon={<My onClick={() => goToMePage()} width={20} height={20} />} />
      </Tabbar>
      <Tabbar fixed value={0} >
        <Tabbar.Item key={'title'} title="首页" icon={<Home width={20} height={20} />} />
        <Tabbar.Item title="我的" icon={<My onClick={() => goToMePage()} width={20} height={20} />} />
      </Tabbar>
      <Popup visible={info.vis}
        onClose={() => {
          setState({ ...info, vis: false })
        }}
        position="bottom"
      >
        <View className="msg">
          <View className={'title'}>景点名称: {detailMsg?.name}</View>
          <View className={'content'}>
            <Image className={'cover'} mode="widthFix" src={detailMsg?.coverUrl} alt="img" />
            <View className={'intro'}>
              {detail?.coverUrl || '景区介绍'}
            </View>
          </View>
          <View className='act'>
            <PlayStart onClick={() => {
              setState({ ...info, videoVis: true })
            }} size={30} />
            <View className='blank'></View>
            <Voice size={30} />
          </View>
        </View>
      </Popup>
      <Popup
        visible={info.videoVis}
        onClose={() => {
          setState({ ...info, videoVis: false })
        }}
        style={{ width: '90%' }}
      >
        <View className="msg" >
          <View className={'title'}>景点介绍</View>
          <Video className='video'
            options={{ controls: true, }} source={detailMsg?.videoUrl}></Video>
        </View>
      </Popup>
    </View>
  )
}
