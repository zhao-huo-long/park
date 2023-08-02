import { View, Video } from '@tarojs/components'
import Taro, { } from '@tarojs/taro'
import './index.less'
import LayoutCnt from './LayoutCnt'
import { useContext, useEffect, useRef, useState } from 'react'
import request from '../../request'
import { Popup, Picker, Switch } from '@nutui/nutui-react-taro'
import { PlayStart, Voice, Search } from '@nutui/icons-react-taro'
// import { Video } from '@nutui/nutui-react-taro';
import { globalInfoContext } from '../../context'
import { NavBar, Tabbar, } from '@nutui/nutui-react-taro';
import { Home, My, Location2 } from '@nutui/icons-react-taro';
import { filterOption, getLocation, goToMePage, } from './utils'

function split(a: string = '') {
  return (a || '').split(',').map(Number)
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
  const [linesSrc, setLinesSrc] = useState<string[]>([])
  const [myLocationPoint, setMyLocationPoint] = useState({})
  const state = useContext(globalInfoContext)
  const [dao, setDao] = useState(Taro.getStorageSync('dao'))

  const playPointMusic = async () => {
    const { latitude, longitude } = await getLocation() as any
    console.log('latitude, longitude', latitude, longitude)
    const res = await request('/skgy/tour/locationScenicSpot', {
      params: {
        lat: `${latitude},${longitude}`
      }
    })
    setMyLocationPoint(res?.data?.resultSet)
    if (res?.data?.resultSet?.audioUrl && dao) {
      Taro.playBackgroundAudio({
        dataUrl: res.data.resultSet.audioUrl,
        title: res.data.resultSet.name,
        success() {
          log(res.data.resultSet.name, res.data.resultSet.audioUrl)
        }
      })
    }
  }
  function log(name: string, url: string) {
    request(`/skgy/tour/add`, {
      method: 'post',
      data: {
        scenicSpotName: name,
        url,
        userName: state.user?.name
      }
    })
  }

  function addLine(targetId: number) {
    Taro.showLoading({
      title: `规划路线中`
    })
    request('/skgy/tour/navigation', {
      method: 'get',
      params: {
        destinationId: targetId,
        originId: myLocationPoint.id,
      }
    })
      .then((e: any) => {
        setLinesSrc(e.data.resultSet.urlList)
      }).finally(() => {
        setDetailVis(false)
        setTimeout(() => {
          Taro.hideLoading()
        }, 200)
      })
  }
  useEffect(() => {
    Taro.setStorageSync('dao', dao)
  }, [dao])
  useEffect(() => {
    const innerAudioContext = Taro.createInnerAudioContext()
    audio.current = innerAudioContext
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    request('/skgy/tour/queryScenicSpot', {})
      .then((e: any) => {
        setPoints(e.data.resultSet || e.resultSet || [])
      })
    playPointMusic()
  }, [])
  const header = state?.user?.headPortrait
  console.log(myLocationPoint)
  return (
    <View className='index'>
      <NavBar
        left={<>智能导览：
          <Switch
            checked={dao}
            onChange={(v) => setDao(v)}
          /></>
        }
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
      <LayoutCnt
        lines={linesSrc}
        dynElements={points.concat({ ...myLocationPoint, type: '*', iconUrl: header }).filter(i => ['*', i.type].includes(filterKey)).map(i => {
          if (!i) {
            return
          }
          const [x, y] = split(i.location)
          const [w, h] = split(i.iconSize)
          return {
            ...i,
            src: i.iconUrl,
            x: x - w / 2,
            y: y - h / 2,
            width: w,
            height: h,
          }
        })} onClickEle={e => {
          console.log(e)
          // if (dao) {
          // addLine(e.id)
          // } else if (e.type === 'scenic_spot') {
          setDetail({ ...e });
          setDetailVis(true);
          // }
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
          <View className={'title'}>景点名称: {detail?.name}
            <Location2 onClick={() => {
              addLine(detail.id, detail)
            }} /> </View>
          <View className={'content'}>
            <img className={'cover'} src={detail?.coverUrl} />
            <View className={'intro'}>
              {detail?.name || '景区介绍'}
            </View>
          </View>
          <View className='act'>
            <PlayStart style={{ visibility: !detail.videoUrl ? 'hidden' : undefined }} onClick={() => setVideoVis(true)} size={30} />
            <View className='blank'></View>
            <Voice style={{ visibility: !detail.audioUrl ? 'hidden' : undefined }} onClick={() => {
              if (!detail.audioUrl) {
                return
              }
              Taro.showToast({
                title: '播放',
                icon: 'success'
              })
              Taro.playBackgroundAudio({
                dataUrl: detail.audioUrl, title: detail.name, success() {
                  log(detail.name, detail.audioUrl)
                }
              })
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
            <video className='video'
              onPlay={() => {
                log(detail.name, detail.videoUrl)
              }}
              src={detail?.videoUrl}
              controls
            // options={{ controls: true, autoplay: true }}
            >
            </video>
          }
        </View>
      </Popup>
      <Picker
        onClose={() => setFilterVis(false)}
        visible={filterVis}
        onConfirm={(v) => setFilterKey(v[0].value)}
        options={filterOption}
      >
      </Picker>
    </View>
  )
}
