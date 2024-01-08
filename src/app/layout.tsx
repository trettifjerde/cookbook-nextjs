import localFont from 'next/font/local';
import StoreProvider from '@/store/provider';
import Navigation from '@/components/ui/navigation/Navigation';
import PopUp from '@/components/ui/PopUp';
import '@/styles/globals.css';

export default function RootLayout({children}: {children: React.ReactNode}) {

  return (
    <html lang="en">
      <body className={`h-100svh container mx-auto py-4 flex flex-col overflow-hidden ${iconsFont.variable}`}>

        <StoreProvider>

            <Navigation />

            <main className="flex-grow overflow-hidden">
              {children}
            </main>

            <PopUp />
          
        </StoreProvider>

      </body>
    </html>
  )
}

const iconsFont = localFont({
  src: '../fonts/icomoon.ttf',
  style: 'normal',
  weight: 'normal',
  variable: '--font-icons'
})