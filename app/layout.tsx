
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AttendEye - AI Face Recognition Attendance',
  description: 'Advanced AI-powered face recognition attendance system for modern workplaces',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen">
        {children}
      </body>
    </html>
  )
}
