import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AdWinner PRO — Full AI Meta Ads Engine',
  description: 'Analizează clipuri video, detectează publicul țintă și generează copy Meta Ads care convertește la CPA minim.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&f[]=clash-display@400,500,600,700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  )
}
