import '@/styles/custom.scss';
import '@/styles/Modal.css';
import LayoutComp from '@/components/LayoutComp';
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
          <LayoutComp>
            {children}
          </LayoutComp>
        </StoreProvider>  
      </body>
    </html>
  )
}
