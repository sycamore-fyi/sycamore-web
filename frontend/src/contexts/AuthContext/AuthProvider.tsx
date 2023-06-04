import {
  ReactNode,
  useEffect,
  useMemo
} from "react";
import { onAuthStateChanged } from "firebase/auth"
import { initialAuthState, AuthContext, AuthContextState } from "./AuthContext";
import { useUpdateState } from "../../hooks/useUpdateState";
import { auth } from "@/lib/firebase/app";
import { authActions } from "./authActions";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, updateState] = useUpdateState<AuthContextState>(initialAuthState)

  console.log("rendering auth provider", state)

  useEffect(() => onAuthStateChanged(auth, (authUser) => {
    updateState({
      authUser,
      isLoading: false,
    })
  }), [updateState])

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
