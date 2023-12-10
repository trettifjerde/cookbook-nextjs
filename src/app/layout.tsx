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
      <body className="h-screen px-4 flex flex-col gap-6 py-4 overflow-hidden">
        <StoreProvider>
          <Navigation />

          <main className="container mx-auto flex-grow overflow-hidden">
              {children}
          </main>

          <div id="confirmation" />

        </StoreProvider>
      </body>
    </html>
  )
}
