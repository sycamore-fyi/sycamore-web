import {
  deleteUser,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  OAuthProvider
} from "firebase/auth"
import { auth } from "@/lib/firebase/app";
import { LocalStorageKey } from "@/lib/LocalStorageKey";

export const authActions = {
  async signOut() {
    return auth.signOut()
  },
  async sendEmailLink(email: string, returnPath: string) {
    const redirectUrl = new URL(window.location.href)
    redirectUrl.pathname = "/auth/email-link"
    redirectUrl.searchParams.set("returnPath", encodeURIComponent(returnPath))

    await sendSignInLinkToEmail(auth, email, {
      url: redirectUrl.href,
      handleCodeInApp: true
    })

    localStorage.setItem(LocalStorageKey.EMAIL_FOR_SIGN_IN, email)
  },
  async handleEmailLink(email: string, emailLink: string) {
    if (!isSignInWithEmailLink(auth, emailLink)) return
    await signInWithEmailLink(auth, email, emailLink)
    localStorage.removeItem(LocalStorageKey.EMAIL_FOR_SIGN_IN)
  },
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    provider.addScope("email")

    return signInWithPopup(auth, provider)
  },
  async signInWithMicrosoft() {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: "consent"
    })

    return signInWithPopup(auth, provider)
  },
  async deleteUser() {
    if (!auth.currentUser) throw new Error("no user logged in")
    return deleteUser(auth.currentUser)
  }
}