import {
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";
import { onAuthStateChanged } from "firebase/auth"
import { initialAuthState, AuthContext, AuthContextState } from "./AuthContext";
import { useUpdateState } from "../../hooks/useUpdateState";
import { auth } from "@/lib/firebase/app";
import { authActions } from "./authActions";
import * as amplitude from "@amplitude/analytics-browser";
import { onIdTokenChanged } from "firebase/auth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, updateState] = useUpdateState<AuthContextState>(initialAuthState)
  const [isInitialAuthLoad, setIsInitialAuthLoad] = useState(true)

  console.log("rendering auth provider", state)

  const authUserId = state.authUser?.uid

  useEffect(() => onIdTokenChanged(auth, async () => {
    await state.authUser?.getIdTokenResult(true)
  }), [state.authUser])

  useEffect(() => onAuthStateChanged(auth, (authUser) => {
    updateState({
      authUser,
      isLoading: isInitialAuthLoad,
    })

    setIsInitialAuthLoad(false)
  }), [isInitialAuthLoad, updateState])

  useEffect(() => {
    amplitude.setUserId(authUserId)
  }, [authUserId])

  const value = useMemo(() => ({
    state,
    actions: authActions
  }), [state])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
