'use client';
import { Provider } from 'react-redux'
import '@/styles/custom.scss';
import { store } from '@/store/store'
import LayoutComp from '@/components/LayoutComp';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <LayoutComp>
            {children}
          </LayoutComp>
        </Provider>
      </body>
    </html>
  )
}
