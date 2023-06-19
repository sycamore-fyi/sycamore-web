import { Button } from "@/components/ui/button";
import { getStartedLink } from "@/lib/links";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="h-screen flex justify-center items-center">
        <div className="text-center space-y-4 px-4 max-w-lg">
          <h1>Turn calls into insights</h1>
          <p className="text-slate-500 text-lg">Increase deal conversion rates and reduce after call work with automated sales call analysis.</p>
          <div>
            <Link href={getStartedLink}>
              <Button size="lg">Get started</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
