import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface TokenStore {
  tryLoadToken: () => string | null;
  setToken: (token : string) => void;
  token : string | null;
}

const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
        immer((set) => ({
            tryLoadToken: () => {
                const token = localStorage.getItem('token');
                if (token) {
                    set(state => {
                        state.token = token
                    })
                }
                return token;
            },
            setToken: (token : string) => {
               localStorage.setItem('token', token);
                set(state => {
                    state.token = token
                })
            },
            token: null
        })),
      {
        name: 'token-storage',
      },
    ),
  ),
)

export default useTokenStore;