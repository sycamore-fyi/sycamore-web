import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-grow">
        <Container className="py-12 space-y-4">
          <h1>Assistant</h1>
          <p>Some explaining copy</p>
        </Container>
      </ScrollArea>

      <div className="flex-shrink-0 border-t border-slate-100 bg-white p-2 box-border">
        <Container className="flex gap-2">
          <Textarea placeholder="Ask me a question..."></Textarea>
          <Button variant="secondary" className="p-2 b">
            <Send />
          </Button>

        </Container>
      </div>
    </div>

  )
}