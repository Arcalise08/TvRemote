import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface TokenStore {
  setToken: (token : string | null) => void;
  token : string | null;
}

const useTokenStore = create<TokenStore>()(
  devtools(
      immer(
          persist((set) => ({
              setToken: (token : string | null) => {
                  set(state => {
                      state.token = token
                  })
              },
              token: null
          }),
          {
              name: 'token-storage',
          })
      )
  ),
)

export default useTokenStore;