import './globals.css'
import { Jost } from 'next/font/google'

const inter = Jost({ subsets: ['latin'] })

export const metadata = {
  title: 'Sycamore',
  description: 'Increase deal conversion rates and reduce after call work with automated sales call analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
