import { User as AuthUser } from "firebase/auth"
import { createContext, useContext } from "react"
import { authActions } from "./authActions"

export interface AuthContextState {
  isLoading: boolean,
  authUser?: AuthUser | null,
}

export interface AuthContextProps {
  state: AuthContextState,
  actions: typeof authActions
}

export const initialAuthState: AuthContextState = {
  isLoading: true,
}

export const AuthContext = createContext<AuthContextProps>({
  state: initialAuthState,
  actions: authActions
})

export const useAuth = () => useContext(AuthContext)
