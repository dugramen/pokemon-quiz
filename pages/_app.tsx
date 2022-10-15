import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const Context = React.createContext({});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = (url: string) => {
      setLoading(true)
      setTimeout(() => setLoading(false), 1000)
    }
    const handleComplete = (url: string) => {setLoading(false)}
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
    }
  })

  return <Context.Provider value={{yo: ''}}>
    <div className='App'>
      <Header/>
      <Component {...pageProps} />

      <style jsx>{`
        @keyframes rotating { /* ease-in-out */
          0% {
            transform: rotate(-30deg);
          }
          5% {
            transform: rotate(-30deg);
          }
          50% {
            transform: rotate(390deg);
          }
          55% {
            transform: rotate(390deg);
          }
          100% {
            transform: rotate(330deg);
          }
        }
        @keyframes three-sixty {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .loading-container {
          position: fixed;
          bottom: 12px;
          right: 12px;
          animation: three-sixty .5s linear infinite;
          opacity: .9;
        }
        .loading {
          display: flex;
          flex-direction: column;
          transition: .3s;
          transform: scale(1);
        }
        .out {
          transform: scale(0);
        }
        .ball {
          width: 50px;
          height: 25px;
          border-radius: 25px;
          border: solid 4px black;
        }
        .top {
          background-color: red;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        .bottom {
          background-color: white;
          border-top-left-radius: 0;
          border-top-right-radius: 0;
        }
        .dot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15px;
          height: 15px;
          border: solid 4px black;
          border-radius: 15px;
          transform: translateX(-50%) translateY(-50%);
          background-color: white;
        }
      `}</style>

      <div className={`loading-container`}>
        <div className={`loading ${loading? "in": "out"}`}>
          <div className='ball top'/>
          <div className='ball bottom'/>
          <div className='dot'/>
        </div>
      </div>
    </div>
  </Context.Provider>
  
}
