import { TabsContent } from "@/components/ui/tabs";

export function BillingTab() {
  return (
    <TabsContent value="billing" className="space-y-4">
      <h2>Billing</h2>
      <p>You're on the free plan.</p>
    </TabsContent>
  )
}