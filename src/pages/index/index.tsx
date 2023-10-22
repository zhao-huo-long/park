import {
  View,
  Video,
  RichText
} from '@tarojs/components'
import Taro, { } from '@tarojs/taro'
import './index.less'
import LayoutCnt from './LayoutCnt'
import { useContext, useEffect, useRef, useState } from 'react'
import request from '../../request'
import { Popup, Picker, Switch } from '@nutui/nutui-react-taro'
import { Search } from '@nutui/icons-react-taro'
import { globalInfoContext } from '../../context'
import { NavBar, Tabbar, } from '@nutui/nutui-react-taro';
import { Home, My, } from '@nutui/icons-react-taro';
import { filterOption, getLocation, goToMePage, } from './utils'
import PlayIcon from './play.png'
import VideoIcon from './video.png'
import AduioIcon from './aduio.png'
import LocationIcon from './location.png'
import bg from './v-bg-1.png'
import throttle from 'lodash/throttle'
import bo from './bo.gif'

function split(a: string = '') {
  return (a || '').split(',').map(Number)
}
const h5 = process.env.TARO_ENV === 'h5'

export default function Index() {
  const [points, setPoints] = useState<any>([])
  const [detailVis, setDetailVis] = useState(false)
  const [videoVis, setVideoVis] = useState(false)
  const [filterVis, setFilterVis] = useState(false)
  const [introVideoVis, setIntroVideoVis] = useState(false)
  const [detail, setDetail] = useState<any>({})
  const [filterKey, setFilterKey] = useState('*')
  const audio = useRef<any>()
  const [linesSrc, setLinesSrc] = useState<string[]>([])
  const [myLocationPoint, setMyLocationPoint] = useState({})
  const state = useContext(globalInfoContext)
  const [secIds, setSecIds] = useState<number[]>([])
  const [dao, setDao] = useState(Taro.getStorageSync('dao'))
  const playPointMusic = async (changeLocation?: any) => {
    let latitude = 0;
    let longitude = 0;
    if (process.env.TARO_ENV === 'h5') {
      const res = await request('/skgy/tour/locationScenicSpot', {
        params: {
          lat: `${latitude},${longitude}`
        }
      })
      setMyLocationPoint(res?.data?.resultSet)
      return
    }

    if (changeLocation?.longitude) {
      longitude = changeLocation.longitude
      latitude = changeLocation.latitude
    } else {
      const wxLocation = await getLocation() as any
      longitude = wxLocation?.longitude
      latitude = wxLocation?.latitude
    }
    console.log('latitude, longitude', latitude, longitude)
    const res = await request('/skgy/tour/locationScenicSpot', {
      params: {
        lat: `${latitude},${longitude}`
      }
    })
    const resultSet = res?.data?.resultSet
    if (!myLocationPoint?.id) {
      setMyLocationPoint(res?.data?.resultSet || {})
      setSecIds(v => v.includes(res?.data?.resultSet?.id) ? v : v.concat(res?.data?.resultSet?.id))
      return
    }
    if (resultSet?.id !== myLocationPoint?.id) {
      setMyLocationPoint(res?.data?.resultSet)
      setSecIds(v => v.includes(res?.data?.resultSet?.id) ? v : v.concat(res?.data?.resultSet?.id))
    }
  }
  useEffect(() => {
    if (h5) {
      return
    }
    if (myLocationPoint?.audioUrl && dao) {
      Taro.playBackgroundAudio({
        dataUrl: myLocationPoint?.audioUrl,
        title: myLocationPoint.name,
        success() {
          log(myLocationPoint?.name, myLocationPoint?.audioUrl)
        }
      })
    }
  }, [myLocationPoint, dao])
  function log(name: string, url: string) {
    if (h5) {
      return
    }
    if (!state.user?.wxMsg?.nickName) {
      return
    }
    request(`/skgy/tour/add`, {
      method: 'post',
      data: {
        scenicSpotName: name,
        url,
        userName: state.user?.wxMsg.nickName
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
  const playBgM = () => {
    const innerAudioContext = Taro.createInnerAudioContext()
    audio.current = innerAudioContext
    innerAudioContext.autoplay = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    playPointMusic()
  }
  useEffect(() => {
    request('/skgy/tour/queryScenicSpot', {})
      .then((e: any) => setPoints(e.data.resultSet || e.resultSet || []))
    if (h5) {
      return
    }
    playBgM()
    const pl = throttle((res) => {
      console.log('位置变化:', res)
      playPointMusic(res)
    }, 5000)
    Taro.authorize({
      scope: 'scope.userLocation',
      success() {
        Taro.startLocationUpdate({
          success(res) {
            console.log(res);
          }
        })
      }
    })
    Taro.onLocationChange(pl)
    return () => {
      Taro.offLocationChange(pl)
    }
  }, [])
  const header = state?.user?.headPortrait
  console.log(`ids`, secIds)
  const playIntroVideo = points?.find(i => i?.type === 'home')
  useEffect(() => {
    if (h5) {
      return
    }
    if (playIntroVideo?.videoUrl) {
      setIntroVideoVis(true)
    }
  }, [playIntroVideo?.videoUrl])
  console.log('myLocationPoint', myLocationPoint)
  return (
    <View className='index'>
      {
        process.env.TARO_ENV === 'h5' ? null : <NavBar
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
            <View style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <span onClick={() => setFilterVis(true)}>
                <Search size={22} />
              </span>
            </View>
          }
        >石刻公园</NavBar>
      }

      <LayoutCnt
        onClick={() => {
          setDetailVis(false)
          setIntroVideoVis(false)
        }}
        lines={linesSrc}
        dynElements={points
          .concat({ ...myLocationPoint, type: '*', style: { borderRadius: '50%' }, iconUrl: bo, iconSize: "400,400", id: 'me' })
          .filter(i => ['*', i.type].includes(filterKey))
          .map(i => {
            if (!i) {
              return
            }
            const [x, y] = split(i.location)
            const [w, h] = split(i.iconSize)
            return {
              ...i,
              src: i.id !== 'me' && i.prepositionIco && !secIds.includes(i.id) ? i.prepositionIco : i.iconUrl,
              x: x - w / 2,
              y: y - h / 2,
              width: w,
              height: h,
            }
          })}
        onClickEle={e => {
          if (e.prepositionIco && !secIds.includes(e.id) && e.id !== 'me') {
            setSecIds((v) => [...v, e.id])
            return
          }
          if (e.type === 'scenic_spot' || e.id === 'me') {
            setDetail({ ...e });
            setDetailVis(true);
          }
        }} />
      {
        process.env.TARO_ENV === 'h5' ? null : <View className='pad'></View>
      }

      {process.env.TARO_ENV === 'h5' ? null : <Tabbar fixed value={0} >
        <Tabbar.Item key={'title'} title="首页" icon={<Home width={20} height={20} />} />
        <Tabbar.Item title="我的" icon={<My onClick={() => goToMePage()} width={20} height={20} />} />
      </Tabbar>}
      <Popup visible={detailVis}
        onClose={() => {
          setDetailVis(false)
        }}
        overlay={false}
        position="bottom"
      >
        <View className="msg">
          <View className={'content'}>
            <img className={'cover'} src={detail?.coverUrl} />
            <View className={'intro'}>
              <View className={'title'}>{detail?.name}
              </View>
              <View>
                {detail?.buildTime} {detail?.buildTime && '建设'}
              </View>
              <View className='act'>
                {
                  detail.videoUrl && <img src={VideoIcon} style={{ width: 32, height: 32 }} onClick={() => setVideoVis(true)} />
                }
                {
                  detail.audioUrl && <img src={AduioIcon} style={{ width: 32, height: 32 }} onClick={() => {
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
                }
                {
                  LocationIcon && <img style={{ width: 32, height: 32 }} src={LocationIcon} onClick={() => {
                    addLine(detail.id, detail)
                  }} />
                }
              </View>
            </View>
          </View>
          {
            !!detail.memo && <View style={{
              width: '100%', marginTop: 10, maxHeight: 200, overflow: 'auto',
              border: '2px solid orange',
              borderRadius: '4px',
            }}>
              <RichText style={{ width: '100%' }} nodes={detail.memo} />
            </View>
          }
        </View>
      </Popup>
      <Popup
        visible={videoVis}
        onClose={() => setVideoVis(false)}
        style={{ width: '100%', background: 'rgba(1,1,1,0)' }}
        destroyOnClose
      >
        <img
          className='vbg'
          src={bg}
        />
        <Video
          className='vvideo'
          objectFit="fill"
          onPlay={() => {
            log(detail.name, detail.videoUrl)
          }}
          src={detail?.videoUrl}
          controls={true}
          autoplay={true}
        >
        </Video>
      </Popup>
      <Popup
        overlay={false}
        visible={introVideoVis}
        onClose={() => setIntroVideoVis(false)}
        style={{ width: '100%', background: 'rgba(1,1,1,0)' }}
        destroyOnClose
      >
        <View style={{ background: 'rgba(1,1,1,0)' }}>
          <img
            className='vbg'
            src={bg}
          />
          <Video
            className='vvideo'
            objectFit="fill"
            // style={{ margin: '0 auto', top: 60, height: '200px', position: 'absolute', width: '100%', display: 'flex', }}
            src={playIntroVideo?.videoUrl}
            controls={true}
            autoplay={true}
            loop={true}
          >
          </Video>
        </View>
      </Popup>
      <Picker
        onClose={() => setFilterVis(false)}
        visible={filterVis}
        onConfirm={(v) => setFilterKey(v[0].value)}
        options={filterOption}
      />
      {
        playIntroVideo?.videoUrl && <img
          src={PlayIcon}
          onClick={() => { setIntroVideoVis(true); console.log(123) }}
          alt=""
          style={{ width: 24, height: 24, marginRight: 0, position: 'fixed', right: 10, top: 100 }}
        />
      }
    </View>
  )
}
