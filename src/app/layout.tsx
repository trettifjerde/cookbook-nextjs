import '@/styles/globals.css';
import Navigation from '@/components/ui/navigation/Navigation';
import StoreProvider from '@/store/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <StoreProvider>

          <div className="h-screen px-4 md:px-8 xl:px-20 2xl:px-40 flex flex-col gap-6 py-4 overflow-hidden">
            <Navigation />

            <main className="container mx-auto flex-grow overflow-hidden">
                {children}
            </main>
          </div>

          <div id="confirmation"></div>
          
        </StoreProvider>
      </body>
    </html>
  )
}
