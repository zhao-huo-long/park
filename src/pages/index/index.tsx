import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.less'
import Taro from '@tarojs/taro'
import { goToMePage } from './utils'

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <Button onClick={() => goToMePage()}>我的页面</Button>
    </View>
  )
}
