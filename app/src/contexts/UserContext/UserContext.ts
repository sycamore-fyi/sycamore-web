import { createContext, useContext } from "react"
import { userActions } from "./userActions"
import { User } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"

export interface UserContextState {
  isLoading: boolean,
  user?: DocumentSnapshot<User> | null,
}

export interface UserContextProps {
  state: UserContextState,
  actions: typeof userActions
}

export const initialUserState: UserContextState = {
  isLoading: true,
}

export const UserContext = createContext<UserContextProps>({
  state: initialUserState,
  actions: userActions
})

export const useUser = () => useContext(UserContext)
