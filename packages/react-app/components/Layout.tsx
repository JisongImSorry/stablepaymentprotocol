import { FC, ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

interface Props {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto w-full h-full">{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default Layout
