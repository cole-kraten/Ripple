import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext'
import { SocketProvider } from '../context/SocketContext'
import Navbar from '../components/Navbar'
import Notification from '../components/Notification'

export const metadata = {
  title: 'Ripple - Community Exchange System',
  description: 'A community-based system for exchanging goods and services',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Ripple</title>
        <meta name="description" content="Ripple - A modern digital currency platform" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <SocketProvider>
            <Notification />
            <Navbar />
            <main>
              {children}
            </main>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 