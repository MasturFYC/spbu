import { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { SSRProvider, Provider, defaultTheme } from '@adobe/react-spectrum'
import fetchJson from '../lib/fetch-json'
import '@styles/style.css'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SSRProvider>
      <Provider
        theme={defaultTheme}
        colorScheme="light"
        breakpoints={{
          S: 340,
          M: 768,
          L: 1024,
          XL: 1280,
          XXL: 1536,
          tablet: 640,
          desktop: 1024,
        }}
      >
        <SWRConfig
          value={{
            fetcher: fetchJson,
            onError: (err) => {
              console.error(err)
            },
          }}
        >
          <Component {...pageProps} />
        </SWRConfig>
      </Provider>
    </SSRProvider>
  )
}
