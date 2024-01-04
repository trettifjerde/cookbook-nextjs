import Navigation from '@/components/ui/navigation/Navigation';
import StoreProvider from '@/store/provider';

import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className='h-screen container mx-auto py-4 flex flex-col overflow-hidden"'>

        <StoreProvider>

            <Navigation />

            <main className="flex-grow overflow-hidden">
              {children}
            </main>

            <div id="modal" />
          
        </StoreProvider>

      </body>
    </html>
  )
}
