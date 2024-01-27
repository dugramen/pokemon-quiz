import "../styles/globals.css";
// import '@/styles/globals.css'
// import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";

export const PokeList = React.createContext({});
export const ScoreContext = React.createContext({
  score: { correct: 0, total: 0 },
  setScore: (() => {}) as any,
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [pokes, setPokes] = useState({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then((res) => res.json())
      .then((data) => {
        const p = {};
        data.results?.forEach((poke) => {
          p[poke.name] = poke.url;
        });
        console.log({ p });
        setPokes(p);
      });
  }, []);

  useEffect(() => {
    setScore({correct: 0, total: 0})
  }, [Component])

  React.useEffect(() => {
    const handleStart = (url: string) => {
      setLoading(true);
      setTimeout(() => setLoading(false), 1000);
    };
    const handleComplete = (url: string) => {
      setLoading(false);
    };
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
    };
  }, []);

  return (
    <PokeList.Provider value={pokes}>
      <ScoreContext.Provider value={{ score, setScore }}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, interactive-widget=resizes-content"></meta>
        <div
          className="App relative max-h-[100vh]"
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div className="absolute inset-0" id="back-layer" />

          <Header />

          <div className="self-center">Score {score.correct} / {score.total}</div>

          <Component {...pageProps} />

          <style jsx>{`
            @keyframes rotating {
              /* ease-in-out */
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
              animation: three-sixty 0.5s linear infinite;
              opacity: 0.9;
            }
            .loading {
              display: flex;
              flex-direction: column;
              transition: 0.3s;
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
            <div className={`loading ${loading ? "in" : "out"}`}>
              <div className="ball top" />
              <div className="ball bottom" />
              <div className="dot" />
            </div>
          </div>
        </div>
      </ScoreContext.Provider>
    </PokeList.Provider>
  );
}

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  const data = await res.json();
  const pokes = {};
  data.results?.forEach((poke) => {
    pokes[poke.name] = poke.url;
  });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      pokes: data,
    },
  };
}
