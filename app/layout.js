import './globals.css'
import { Kanit } from 'next/font/google'

const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300','400','500','600'],
  display: 'swap',
})

export const metadata = {
  title: 'MODS-EDU',
  description: 'Child Development System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={kanit.className}>
        {children}
      </body>
    </html>
  )
}