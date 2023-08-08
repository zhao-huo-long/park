import { View } from '@tarojs/components'
import Taro, { useLoad, } from '@tarojs/taro'
import './index.less'
import ImageList from './image-list'
import { NavBar, Input, Button } from '@nutui/nutui-react-taro';
import { Cell } from '@nutui/nutui-react-taro';
import { useEffect, useState } from 'react';
import ava1 from './img/niu.png'
import { Notify } from '@nutui/nutui-react-taro';
import { globalInfoContext } from '../../context'
import { useContext } from 'react'
import request from '../../request';

export default function Index() {
  const state = useContext(globalInfoContext)
  const [user, setUser] = useState({
    name: '',
    headPortrait: ava1,
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
  })
  useEffect(() => {
    setUser({ ...state.user } as any)
  }, [state?.user]);

  async function submit() {
    const result = await request('/skgy/tour/update', {
      method: 'post',
      data: {
        ...user
      }
    },)
    if (result?.data?.success) {
      changeNotify('更新成功', 'success')
      state.updateUser(user)
    }
    console.log(`result.data`, result)
  }
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
      <Cell title="我的形象" description={<img className='my-ava' src={user.headPortrait} />}>
      </Cell>
      <Cell
        title="昵称"
        description={<Input value={user.name} onChange={(v) => setUser({ ...user, name: v })}
          className='input-nickname' placeholder="请输入你的昵称" />}
      >
      </Cell>
      <Cell title="选择新形象" description={<ImageList value={user.headPortrait} onClick={v => setUser({ ...user, headPortrait: v })} />} >
      </Cell>

      <View className='act'>
        <Button onClick={() => Taro.navigateBack()}>返回</Button>
        <Button onClick={() => { submit() }}>提交</Button>
      </View>
      <View className='backup'>
        蜀ICP备2023019325号-1
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
