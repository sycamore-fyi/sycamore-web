import { createContext, useContext } from "react"
import { User } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"

export interface UserContextState {
  isLoading: boolean,
  user?: DocumentSnapshot<User> | null,
}

export interface UserContextActions {
  update?: (data: Partial<User>) => Promise<void>
}

export interface UserContextProps {
  state: UserContextState,
  actions: UserContextActions
}

export const initialUserState: UserContextState = {
  isLoading: true,
}

export const UserContext = createContext<UserContextProps>({
  state: initialUserState,
  actions: {}
})

export const useUser = () => useContext(UserContext)
