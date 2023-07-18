import { createContext } from 'react'
export const globalInfoContext = createContext<{ user?: Record<string, any>, updateUser?: any }>({})
