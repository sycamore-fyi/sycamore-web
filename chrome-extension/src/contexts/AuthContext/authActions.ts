import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  OAuthProvider,
  signInWithCredential
} from "firebase/auth"
import { auth } from "@/lib/firebase/app";
import { LocalStorageKey } from "@/lib/LocalStorageKey";

export const authActions = {
  async signOut() {
    return auth.signOut()
  },
  async sendEmailLink(email: string) {
    const url = "chrome-extension://bakademnfhcofbmpjeccppdokbmopjpj"
    await sendSignInLinkToEmail(auth, email, {
      url,
      handleCodeInApp: true
    })

    chrome.storage.local.set({ [LocalStorageKey.EMAIL_FOR_SIGN_IN]: email })
  },
  async handleEmailLink(email: string, emailLink: string) {
    if (!isSignInWithEmailLink(auth, emailLink)) return
    await signInWithEmailLink(auth, email, emailLink)
    chrome.storage.local.remove(LocalStorageKey.EMAIL_FOR_SIGN_IN)
  },
  async signInWithGoogle() {
    const { token } = await chrome.identity.getAuthToken({ interactive: true })
    const credential = GoogleAuthProvider.credential(null, token)
    return signInWithCredential(auth, credential)
  },
  async signInWithMicrosoft() {
    const provider = new OAuthProvider('microsoft.com');
    provider.setCustomParameters({
      prompt: "consent"
    })

    return signInWithPopup(auth, provider)
  },
}