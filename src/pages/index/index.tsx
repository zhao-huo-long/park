import { View, Audio } from '@tarojs/components'
import Taro, { } from '@tarojs/taro'
import './index.less'
import LayoutCnt from './LayoutCnt'
import { useEffect, useRef, useState } from 'react'
import request from '../../request'
import { Popup, Picker } from '@nutui/nutui-react-taro'
import { PlayStart, Voice, Search } from '@nutui/icons-react-taro'
import { Video } from '@nutui/nutui-react-taro';
// import { globalInfoContext } from '../../context'
import { NavBar, Tabbar, } from '@nutui/nutui-react-taro';
import { Home, My } from '@nutui/icons-react-taro';
import { getLocation, goToMePage, } from './utils'

function split(a: string = '') {
  return a.split(',').map(Number)
}

export default function Index() {
  const [points, setPoints] = useState<any>([])
  const [detailVis, setDetailVis] = useState(false)
  const [videoVis, setVideoVis] = useState(false)
  const [filterVis, setFilterVis] = useState(false)
  const [audioVis, setAudioVis] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [filterKey, setFilterKey] = useState('*')
  const audio = useRef<any>()
  const playPointMusic = async () => {
    const { latitude, longitude } = await getLocation() as any
    console.log('latitude, longitude', latitude, longitude)
    const res = await request('/skgy/tour/locationScenicSpot', {
      params: {
        lat: `${latitude},${longitude}`
      }
    })
    if (res?.data?.resultSet?.audioUrl) {
      Taro.playBackgroundAudio({ dataUrl: res.data.resultSet.audioUrl, title: res.data.resultSet.name })
    }
  }

  useEffect(() => {
    const innerAudioContext = Taro.createInnerAudioContext()
    audio.current = innerAudioContext
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    console.log(innerAudioContext)
    request('/skgy/tour/queryScenicSpot', {})
      .then((e: any) => {
        setPoints(e.data.resultSet || e.resultSet || [])
      })
    playPointMusic()
  }, [])
  return (
    <View className='index'>
      {/* <NavBar
        style={{
          marginBottom: 'var(--nutui-navbar-margin-bottom, 0)',
          visibility: 'hidden'
        }}
      >石刻公园</NavBar> */}
      <NavBar
        style={{
          marginBottom: 'var(--nutui-navbar-margin-bottom, 0)'
        }}
        fixed
        right={
          <span onClick={() => setFilterVis(true)}>
            <Search />
          </span>
        }
      >石刻公园</NavBar>
      <LayoutCnt dynElements={points.filter(i => ['*', i.type].includes(filterKey)).map(i => {
        const [x, y] = split(i.location)
        const [w, d] = split(i.iconSize)
        return {
          ...i,
          src: i.iconUrl,
          x,
          y,
          width: w,
          height: d,
        }
      })} onClickEle={e => {
        setDetail({ ...e })
        setDetailVis(true)
      }} />
      <View className='pad'></View>
      <Tabbar fixed value={0} >
        <Tabbar.Item key={'title'} title="首页" icon={<Home width={20} height={20} />} />
        <Tabbar.Item title="我的" icon={<My onClick={() => goToMePage()} width={20} height={20} />} />
      </Tabbar>
      <Popup visible={detailVis}
        onClose={() => {
          setDetailVis(false)
        }}
        title="景点详情"
        position="bottom"
      >
        <View className="msg">
          <View className={'title'}>景点名称: {detail?.name}</View>
          <View className={'content'}>
            <img className={'cover'} src={detail?.coverUrl} />
            <View className={'intro'}>
              {detail?.name || '景区介绍'}
            </View>
          </View>
          <View className='act'>
            <PlayStart onClick={() => setVideoVis(true)} size={30} />
            <View className='blank'></View>
            <Voice onClick={() => {
              Taro.playBackgroundAudio({ dataUrl: detail.audioUrl, title: detail.name })
            }} size={30} />
          </View>
        </View>
      </Popup>
      <Popup
        visible={videoVis}
        onClose={() => setVideoVis(false)}
        title="景点视频介绍"
        style={{ width: '90%' }}
      >
        <View className="msg" >
          <View className='title'>景点视频介绍</View>
          {
            <Video className='video'
              onPlay={() => {
                request('/skgy/tour/add', {
                  method: 'post',
                  data: {
                    ...detail
                  }
                })
              }}
              options={{ controls: true, autoplay: true }} source={detail?.videoUrl}>
            </Video>
          }
        </View>
      </Popup>
      <Popup
        visible={audioVis}
        onClose={() => setAudioVis(false)}
        title="景点音频介绍"
        style={{ width: '90%' }}
      >
        <View className="msg" >
          <View className='title'>景点音频介绍</View>
          {/* <Audio
            autoPlay={false}
            url="//storage.360buyimg.com/jdcdkh/SMB/VCG231024564.wav"
            src='//storage.360buyimg.com/jdcdkh/SMB/VCG231024564.wav'
            loop={false}
            preload="auto"
            onPlay={e => alert(e)}
            controls
            muted={false}
            onCanPlay={() => {
              console.log('22222')
            }}
            onPlayEnd={() => alert('ended!')}
          /> */}

          {
            // <Audio
            //   onPlay={() => {
            //     request('/skgy/tour/add', {
            //       method: 'post',
            //       data: {
            //         ...detail
            //       }
            //     })
            //   }}
            //   loop
            //   src={detail?.audioUrl}>
            // </Audio>

            // <Audio
            //   src={detail?.audioUrl}
            //   controls={true}
            //   autoplay={false}
            //   loop={false}
            //   muted={true}
            //   initialTime='30'
            //   id='video'
            // />
          }
        </View>
      </Popup>
      <Picker
        onClose={() => setFilterVis(false)}
        visible={filterVis}
        onConfirm={(v) => setFilterKey(v[0].value)}
        options={[
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
        ]}
      >
      </Picker>
    </View>
  )
}
