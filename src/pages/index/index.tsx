import {
  View,
  Video
} from '@tarojs/components'
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
import PlayIcon from './play.png'
import VideoIcon from './video.png'
import AduioIcon from './aduio.png'
import LocationIcon from './location.png'
import bg from './v-bg-1.png'

function split(a: string = '') {
  return (a || '').split(',').map(Number)
}

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
  const [dao, setDao] = useState(Taro.getStorageSync('dao'))
  const playPointMusic = async (changeLocation?: any) => {
    let latitude = 0;
    let longitude = 0;
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
        lat: `${longitude},${latitude}`
      }
    })
    //
    const resultSet = res?.data?.resultSet
    if (resultSet?.audioUrl && dao && resultSet?.audioUrl !== myLocationPoint?.audioUrl) {
      Taro.playBackgroundAudio({
        dataUrl: res.data.resultSet.audioUrl,
        title: res.data.resultSet.name,
        success() {
          log(res.data.resultSet.name, res.data.resultSet.audioUrl)
        }
      })
      setMyLocationPoint(res?.data?.resultSet)
    }
  }
  function log(name: string, url: string) {
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
    playBgM()
    const pl = (res) => {
      playPointMusic(res)
    }
    Taro.onLocationChange(pl)
    return () => {
      Taro.offLocationChange(pl)
    }
  }, [])
  const header = state?.user?.headPortrait
  const playIntroVideo = points?.find(i => i?.type === 'home')

  useEffect(() => {
    if (playIntroVideo?.videoUrl) {
      setIntroVideoVis(true)
    }
  }, [playIntroVideo?.videoUrl])
  console.log('introVideoVis', introVideoVis)
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
          <View style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <span onClick={() => setFilterVis(true)}>
              <Search size={22} />
            </span>
          </View>
        }
      >石刻公园</NavBar>
      <LayoutCnt
        onClick={() => {
          setDetailVis(false)
          setIntroVideoVis(false)
        }}
        lines={linesSrc}
        dynElements={points
          .concat({ ...myLocationPoint, type: '*', style: { borderRadius: '50%' }, iconUrl: header, iconSize: "400,400", name: 'me' })
          .filter(i => ['*', i.type].includes(filterKey))
          .map(i => {
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
          })}
        onClickEle={e => {
          if (e.type === 'scenic_spot') {
            setDetail({ ...e });
            setDetailVis(true);
          }
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
        overlay={false}
        // title="景点详情"
        position="bottom"
      >
        <View className="msg">
          {/* <View className={'title'}>景点名称: {detail?.name}
          </View> */}
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
        </View>
      </Popup>
      <Popup
        visible={videoVis}
        onClose={() => setVideoVis(false)}
        style={{ width: '100%', background: 'rgba(1,1,1,0)' }}
        destroyOnClose
      >
        <img
          style={{
            margin: '0 auto',
            height: '260px',
            width: '100%',
            display: 'flex',
            top: 0,
            objectFit: 'cover',
          }}
          src={bg}
        />
        <Video
          style={{ margin: '0 auto', top: 60, height: '200px', position: 'absolute', width: '100%', display: 'flex', }}
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
            style={{
              margin: '0 auto',
              height: '260px',
              width: '100%',
              display: 'flex',
              top: 0,
              objectFit: 'cover',
            }}
            src={bg}
          />
          <Video
            style={{ margin: '0 auto', top: 60, height: '200px', position: 'absolute', width: '100%', display: 'flex', }}
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
