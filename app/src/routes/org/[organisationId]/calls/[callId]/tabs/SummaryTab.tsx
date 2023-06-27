import { TabsContent } from "@/components/ui/tabs";
import { useCall } from "@/contexts/CallContext/CallContext";
import ReactMarkdown from "react-markdown"

export default function SummaryTab() {
  const { state: { callSummary } } = useCall()
  return (
    <TabsContent value="summary">
      {
        callSummary
          ? (
            <div className="markdown">
              <ReactMarkdown>{callSummary.markdown}</ReactMarkdown>
            </div>
          )
          : "Loading"
      }
    </TabsContent>
  )
}