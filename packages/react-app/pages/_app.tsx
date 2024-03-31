import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/globals.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default App
