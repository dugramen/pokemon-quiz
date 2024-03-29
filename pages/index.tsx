import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={'app'}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx>{`
        @keyframes in {
          from {
            transform: translateY(-100px);
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 150px;
          justify-content: center;
          // height: calc(100vh - 100px);
        }

        h1 {
          margin-bottom: 0px;
          margin-top: 0px;
          animation: in 1s;
        }
        
        .second {
          opacity: 0;
          margin-top: 10px;
          animation: in 1s forwards;
          animation-delay: .9s;
        }
      `}</style>

      <main className={'main text-2xl h-full min-h-0 flex-1'}>

        <h1>Hello</h1>
        <h1 className='second'>Choose a quiz from above</h1>
      </main>

    </div>
  )
}

export default Home
