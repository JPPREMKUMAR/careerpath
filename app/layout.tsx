import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerPath AI — Job Search & Career Planner',
  description: 'A focused workspace for tracking job applications and career momentum.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
