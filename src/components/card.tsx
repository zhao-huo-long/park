import { View } from "@tarojs/components"

interface TCard {
  title: string,
  children: any
}

export default function Card(props: TCard) {
  const { title, children } = props
  return <View>
    <View className='text'>{title}</View>
    <View className='line'></View>
    <View>{children}</View>
  </View>
}
