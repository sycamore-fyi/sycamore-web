import { Check } from "lucide-react";
import { CenterPage } from "../../components/layout/CenterPage";

export default function EmailLinkSentPage() {
  return (
    <CenterPage className="space-y-4 text-center">
      <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center m-auto">
        <Check size={80} />
      </div>
      <h2>We sent you an email link</h2>
      <p>Open it to access your account</p>
    </CenterPage>
  )
}