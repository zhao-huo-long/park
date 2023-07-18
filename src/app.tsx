import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.less'
import useLogin from './hooks/useLogin'
import { globalInfoContext } from './context'

function App({ children }: PropsWithChildren) {
  const [userInfo, setUserInfo] = useLogin()
  useLaunch(() => {
    console.log('App launched.')
  })
  return <globalInfoContext.Provider value={{ user: userInfo, updateUser: setUserInfo }}>{children}</globalInfoContext.Provider>
}

export default App
