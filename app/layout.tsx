import './globals.css'
import { Prompt } from 'next/font/google'
import type { Metadata } from 'next'

const prompt = Prompt({
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
      <body className={prompt.className}>{children}</body>
    </html>
  )
}