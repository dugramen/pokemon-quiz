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
      window.setTimeout(() => setLoading(false), 2000)
    }
    // const handleComplete = (url: string) => {setLoading(false)}
    router.events.on('routeChangeStart', handleStart)
    // router.events.on('routeChangeComplete', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      // router.events.off('routeChangeComplete', handleComplete)
    }
  })

  return <Context.Provider value={{yo: ''}}>
    <div className='App'>
      <Header/>
      <Component {...pageProps} />

      <style jsx>{`
        @keyframes load-in {
          0% {
            transform: rotate(0deg);
          }
          30% {
            transform: rotate(0deg) scale(.7);
          }
          100% {
            transform: rotate(-30deg);
          }
        }
        @keyframes rotating {
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

        @keyframes top-half {
          from {
            transform: translateY(-50vh);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-in-bottom {
          from {
            transform: translateY(50vh);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-in-top {
          from {
            transform: translateY(calc(-50vh - 100%));
          }
          to {
            transform: translateY(-100%);
          }
        }

        .load-animation {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;

          animation: rotating 1.5s linear infinite, load-in .6s;
          animation-delay: .7s, .2s;
          animation-timing-function: ease-in-out;
        }

        .ball {
          position: absolute;
          left: calc(50vw - 100px);
          width: 200px;
          height: 100px;
          z-index: 20;
          border: 4px solid black;
          top: 50vh;
        }
        .bottom {
          background-color: white;
          border-radius: 0 0 100px 100px;
          animation: slide-in-bottom;
          animation-duration: .2s;
          animation-timing-function: ease-in;
        }
        .top {
          transform: translateY(-100%);
          background-color: red;
          border-radius: 100px 100px 0 0;
          animation: slide-in-top;
          animation-duration: .2s;
          animation-timing-function: ease-in;
        }

        .half {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          right: 0;
          background-color: black;
        }
        .top-half {
          bottom: 50vh;
          animation: top-half;
          animation-duration:  .2s;
          animation-timing-function: ease-in;
        }
        .bottom-half {
          top: 50vh;
          animation: slide-in-bottom;
          animation-duration: .2s;
          animation-timing-function: ease-in;
        }
      `}</style>

      {loading && 
      <div className='load'>
        <div className='half bottom-half'/>
        <div className='half top-half'/>

        <div className='load-animation'>
          <div className='top ball'></div>
          <div className='bottom ball'></div>
        </div>
      </div>
      }
    </div>
  </Context.Provider>
  
}
