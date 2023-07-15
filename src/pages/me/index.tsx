import { View } from '@tarojs/components'
import Taro, { useLoad, } from '@tarojs/taro'
import './index.less'
import ImageList from './image-list'
import { NavBar, Input, Button } from '@nutui/nutui-react-taro';
import { Cell } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/esm/NavBar/style/style.css'
import { useState } from 'react';
import ava1 from './img/头像1.jpeg'
import { Notify } from '@nutui/nutui-react-taro';

export default function Index() {
  const [msg, setMsg] = useState({
    name: '小王',
    ava: ava1,
  })
  const [showNotify, SetShowNotify] = useState(false)
  const [states, SetStates] = useState({
    message: '',
    type: 'success',
  })
  const changeNotify = (message: string, type?: string) => {
    const change = Object.assign(states, { message, type })
    SetStates(change)
    SetShowNotify(true)
  }
  useLoad(() => {
    console.log('Page loaded.')

    console.log(Notify)
  })

  return (
    <View className='me'>
      <NavBar
        back={
          <>
            返回
          </>
        }
        onBackClick={() => Taro.navigateBack()}
      >
        我的
      </NavBar>
      <Cell title="我的形象" description={<img className='my-ava' src={msg.ava} />}>
      </Cell>
      <Cell title="昵称" description={<Input value={msg.name} onChange={(v) => setMsg({ ...msg, name: v })} className='input-nickname' placeholder="请输入你的昵称" />}>
      </Cell>
      <Cell title="选择新形象" description={<ImageList value={msg.ava} onClick={v => setMsg({ ...msg, ava: v })} />} >
      </Cell>
      <View className='act'>
        <Button onClick={() => Taro.navigateBack()}>返回</Button>
        <Button onClick={() => { changeNotify('成功', 'success'); console.log(msg) }}>提交</Button>
      </View>
      <Notify
        visible={showNotify}
        type={states.type}
        onClose={() => {
          SetShowNotify(false)
        }}
        onClick={() => {
          console.log('click')
        }}
      >{states.message}</Notify>
    </View>
  )
}
