import {
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { UserContext, UserContextProps, UserContextState, initialUserState } from "./UserContext";
import { useAuth } from "../AuthContext/AuthContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";

export default function UserProvider({ children }: { children: ReactNode }) {
  const { state: { authUser, isLoading: isAuthLoading } } = useAuth()
  const authUserId = authUser?.uid

  const [state, updateState] = useUpdateState<UserContextState>(initialUserState)

  console.log("rendering user provider", state)

  useEffect(() => {
    updateState({
      isLoading: !!authUserId || isAuthLoading,
      user: null
    })

    if (!authUserId) {
      console.log("no auth user id in provider, returning")
      return
    }

    onSnapshot(doc(Collection.User, authUserId), async user => {
      updateState({
        user,
        isLoading: false
      })
    })
  }, [updateState, authUserId, isAuthLoading])

  const value: UserContextProps = useMemo(() => ({
    state,
    actions: {
      async update(data) {
        const userId = state.user?.id
        if (!userId) return
        return updateDoc(
          doc(Collection.User, userId),
          data
        )
      },
    }
  }), [state])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
