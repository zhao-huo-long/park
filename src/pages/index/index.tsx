import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'
import { goToMePage } from './utils'
import { globalInfoContext } from '../../context'
import { useContext } from 'react'

export default function Index() {
  const state = useContext(globalInfoContext)
  console.log('state', state)
  useLoad(() => {
    console.log('Page loaded.')
  })
  return (
    <View className='index'>
      <Text></Text>
      <Button onClick={() => goToMePage()}>我的页面</Button>
    </View>
  )
}
