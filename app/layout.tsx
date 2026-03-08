import './globals.css'
import { Kanit } from 'next/font/google'
import type { Metadata } from 'next'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MODS-EDU-DSPM',
  description: 'Child Development System',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={kanit.className}>{children}</body>
    </html>
  )
}