import type { AppProps } from 'next/app'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useRouter } from 'next/router'

function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter()
  return <div>{asPath.split('/')[2]}</div>
}

export default App
