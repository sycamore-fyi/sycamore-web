import {
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { UserContext, UserContextState, initialUserState } from "./UserContext";
import { userActions } from "./userActions";
import { useAuth } from "../AuthContext/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";

export default function UserProvider({ children }: { children: ReactNode }) {
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid

  const [state, updateState] = useUpdateState<UserContextState>(initialUserState)

  console.log("rendering user provider", state)

  useEffect(() => {
    updateState({
      isLoading: !!authUserId,
      user: null
    })

    if (!authUserId) {
      console.log("no auth user id in provider, returning")
      return
    }

    onSnapshot(doc(Collection.User, authUserId), user => {
      updateState({
        user,
        isLoading: false
      })
    })
  }, [updateState, authUserId])

  const value = useMemo(() => ({
    state,
    actions: userActions
  }), [state])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
