import { create } from 'zustand'

export type AppStoreValuesType = {
  siteName: string
}

export type AppStoreType = AppStoreValuesType & {
  setSiteName: (value: string) => void
}

const useAppStore = create<AppStoreType>((set) => ({
  siteName: 'Amuselabs',

  setSiteName: (value) =>
    set((state) => {
      return {
        ...state,
        siteName: value,
      }
    })
}))

export default useAppStore
