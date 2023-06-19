import NavBar from "@/components/layout/NavBar"
import './globals.css'
import { Jost } from 'next/font/google'

const jost = Jost({ subsets: ['latin'] })

export const metadata = {
  title: 'Sycamore',
  description: 'Increase deal conversion rates and reduce after call work with automated sales call analysis.',
  "og:image": "https://sycamore.fyi/logo.svg"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <NavBar />
        {children}
      </body>
    </html>
  )
}
