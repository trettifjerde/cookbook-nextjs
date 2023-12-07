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
          <Navigation />

          <main className="container mx-auto">
              {children}
          </main>

          <div id="confirmation" />

        </StoreProvider>
      </body>
    </html>
  )
}
