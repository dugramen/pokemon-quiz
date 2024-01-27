import React, { useContext, useEffect, useState } from "react";
import { PokeMap } from "./PokeMap";
import { cacheFetch } from "./Utils";
import { PokeList } from "../pages/_app";
import { createPortal } from "react-dom";

export interface PkDataInterface {
  name: string;
  id: number;
  sprites: {
    front_default: string;
    [x: string | number | symbol]: any;
  };
  [x: string | number | symbol]: any;
}

interface Props {
  customFetchHandler?: (id: number) => void;
  verifyGuess?: (guess: string) => boolean;

  fetchLink?: (pkID: number) => string;
  onNewData?: (data: any) => void;
  onGuessedCorrectly?: () => void;
  delayNewFetch?: () => Promise<any>;

  guessList?: string[];
  onHint?: () => any
}

export default function PkGuesser(props: Props) {
  const [animState, setAnimState] = React.useState(0);
  const animRef = React.useRef<any>();
  const contentRef = React.useRef<any>();
  const [text, setText] = useState("");

  const [pkName, setPkName] = React.useState<any>(null);
  const firstRender = React.useRef(true);
  const inputRef = React.useRef<HTMLInputElement>();

  const pokes = useContext(PokeList);
  const list = props.guessList ?? Object.keys(pokes ?? {});
  // const pokeList = Object.keys(pokes ?? {});
  const filteredPokes = list.filter(
    (poke) => text && poke.toLowerCase().includes(text.toLowerCase())
  );

  React.useEffect(() => {
    if (firstRender.current) {
      // console.log('getting new pokemon')
      fetchNewPokemon().catch(console.error);
    }
    firstRender.current = false;
  }, []);

  function resetAnimation(ref: any) {
    ref.current.style.animation = "none";
    ref.current.offsetHeight; /* trigger reflow */
    ref.current.style.animation = null;
  }

  async function submitGuess(skipped = false) {
    if (pkName === null) {
      console.log("still loading bro");
      return;
    }
    resetAnimation(animRef);
    resetAnimation(contentRef);

    const val = inputRef.current?.value ?? "";
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (!pkName) {
      return;
    }

    const isCorrect =
      props.verifyGuess?.(val) ??
      pkName.toLowerCase().replace("-", "").replace(" ", "") ===
        val.toLowerCase().replace("-", "").replace(" ", "");
    if (isCorrect || skipped) {
      // console.log('you are very correct sir')
      props?.onGuessedCorrectly?.();
      setPkName(null);
      setAnimState(1);
      setText("");

      if (props.delayNewFetch) {
        await props.delayNewFetch();
      }
      fetchNewPokemon().catch(console.error);
    } else {
      // console.log('try again')
      setAnimState(2);
    }
  }

  async function fetchNewPokemon() {
    const pkId = Math.ceil(Math.random() * 900);
    console.log(`custom fetching ${PokeMap[pkId].name}`);
    if (props.customFetchHandler) {
      props?.customFetchHandler?.(pkId);
      setPkName(PokeMap[pkId].name);
    } else {
      const res = await cacheFetch(
        props.fetchLink?.(pkId) ?? `https://pokeapi.co/api/v2/pokemon/${pkId}`
      );
      if (res) {
        const data = await res.json();
        props?.onNewData?.(data);
        setPkName(PokeMap[pkId].name);
      }
    }
  }

  const isCorrect = animState === 1;
  const isWrong = animState === 2;


  return (
    <div
      className={`input-container`}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
      }}
    >
      <style jsx>{`
        .input-container {
          position: relative;
          z-index: 0;
        }
        input {
          border: none;
          outline: none;
          background-color: rgba(255, 255, 255, 0.25);
          border-radius: 40px;
          padding: 12px 16px;
          z-index: -1;
        }
        input::placeholder {
          transition: 0.2s;
          color: hsl(0, 0%, 70%);
        }
        input:hover::placeholder {
          color: white;
        }
        .skip-button {
          border: none;
          background: none;
          outline: none;
          text-decoration: underline;
          cursor: pointer;
          color: hsl(0, 0%, 70%);
          transition: 0.2s;
        }
        .skip-button:hover {
          color: white;
        }

        @keyframes expand {
          from {
            opacity: 0.85;
            width: 100%;
            height: 100%;
          }
          to {
            top: -100%;
            left: -25%;
            width: 150%;
            height: 300%;
            opacity: 0;
          }
        }
        @keyframes wrong {
          0% {
            transform: translateX(0px);
          }
          25% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0px);
          }
        }
        @keyframes correct {
          0% {
            transform: translateY(0px);
          }
          25% {
            transform: translateY(-8px);
          }
          50% {
            transform: translateY(0px);
          }
          75% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .animator {
          position: absolute;
          padding: 4px;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          z-index: -2;
          border-radius: 100000000000000px;
          opacity: 0;

          background-color: green;
          animation-name: expand;
          animation-duration: 0.75s;
          animation-timing-function: ease-out;
        }
        .correct {
          background-color: green;
        }
        .wrong {
          background-color: darkred;
        }
        .content-wrong {
          animation-name: wrong;
          animation-duration: 0.2s;
        }
        .content-correct {
          animation-name: correct;
          animation-duration: 0.5s;
        }
      `}</style>

      <div
        ref={contentRef}
        className={`relative flex flex-row gap-2 items-center content-container content-${
          isCorrect ? "correct" : ""
        }${isWrong ? "wrong" : ""}`}
      >
        <div>
          <div
            ref={animRef}
            className={`animator ${isCorrect ? "correct" : ""} ${
              isWrong ? "wrong" : ""
            }`}
          ></div>

          <input
            ref={ref => {
              inputRef.current = ref ?? undefined;
              inputRef.current?.focus()
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitGuess();
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                inputRef.current?.focus()
              }, 10)
            }}
            placeholder="Enter your guess..."
          />
        </div>

        <div className="flex flex-row gap-2">
          {props.onHint && <button
            className="px-3 py-1 rounded-lg transition-all duration-300 hover:px-4 bg-neutral-700 text-gray-300 text-sm"
            onClick={() => props.onHint?.()}
          >
            Hint
          </button>}
          <button
            className="skip-button"
            onClick={() => pkName !== null && submitGuess(true)}
          >
            or skip
          </button>
        </div>
      </div>

      <div
        style={{
          minHeight: 0,
          flex: 1,
          overflow: "auto",
        }}
      >
        {filteredPokes.map((poke) => (
          <div
            key={poke}
            className="hover:bg-gray-900 px-2 rounded-lg cursor-pointer"
            onClick={() => {
              // setText(poke);
              inputRef.current && (inputRef.current.value = poke);
              submitGuess(false);
              // inputRef.current && (inputRef.current.value = "");
            }}
          >
            {poke}
          </div>
        ))}
      </div>

      {/* {backElement && createPortal(
          <div className="absolute inset-0" onClick={() => inputRef.current?.focus()}>

          </div>
      , backElement)} */}
    </div>
  );
}
