import React, { useContext, useEffect, useMemo, useState } from "react";
import { PokeMap } from "./PokeMap";
import { cacheFetch } from "./Utils";
import { PokeList, ScoreContext } from "../pages/_app";
import {
  SwitchTransition,
  Transition,
  TransitionGroup,
} from "react-transition-group";
import { twMerge } from "tailwind-merge";
import { GenerationsContext, genRangesPokemon } from "./generations";
import { useRouter } from "next/router";

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
  onHint?: () => any;
  maxTries?: number;
  hintCost?: number;
  customAnswer?: string;
  genRanges?: number[];
  idToName?: (id: number) => string;
}

export default function PkGuesser({
  maxTries = 3,
  hintCost = 0.4,
  genRanges = genRangesPokemon,
  idToName = (id) => PokeMap[id].name,
  ...props
}: Props & { className?: string }) {
  const [animState, setAnimState] = React.useState(0);
  const animRef = React.useRef<any>();
  const contentRef = React.useRef<any>();
  const [text, setText] = useState("");
  const [tries, setTries] = useState(maxTries);
  const [points, setPoints] = useState(1.0);
  const [answer, setAnswer] = useState("");
  // const router = useRouter()

  const [pkName, setPkName] = React.useState<any>(null);
  const firstRender = React.useRef(true);
  const inputRef = React.useRef<HTMLInputElement>();

  const { score, setScore } = useContext(ScoreContext);
  const { generations } = useContext(GenerationsContext);
  const ranges = useMemo(
    () =>
      generations.map(
        (gen) => [genRanges[gen - 1], genRanges[gen]] as [number, number]
      ),
    [generations]
  );

  const pokes = useContext(PokeList);
  const list = props.guessList ?? Object.keys(pokes ?? {});
  // const pokeList = Object.keys(pokes ?? {});
  const rangedList = useMemo(
    () =>
      list.filter((poke, i) =>
        props.guessList ? true : isNumberInRanges(i, ranges)
      ),
    [props.guessList, ranges]
  );
  const filteredPokes = rangedList.filter(
    (poke, i) => text && poke.toLowerCase().includes(text.toLowerCase())
  );

  useEffect(() => {
    if (!firstRender.current) {
      console.log("getting new pokemon ", generations);
      fetchNewPokemon().catch(console.error);
    }
    firstRender.current = false;
  }, [generations]);

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

    const nextQuestion = async () => {
      props?.onGuessedCorrectly?.();
      setAnswer(props.customAnswer ?? pkName);
      setPkName(null);
      setText("");

      setTries(0);
      if (props.delayNewFetch) {
        await props.delayNewFetch();
      }
      fetchNewPokemon()
        .catch(console.error)
        .finally(() => {
          setTries(maxTries);
          setPoints(1);
        });
    };

    if (isCorrect || skipped) {
      // console.log('you are very correct sir')
      setScore({
        correct: score.correct + (skipped ? 0 : points),
        total: score.total + 1,
      });

      setAnimState(1);
      await nextQuestion();
    } else {
      // console.log('try again')
      setAnimState(2);
      setScore({ correct: score.correct, total: score.total + 1 });
      // if (tries <= 1) {
      //   setScore({ correct: score.correct, total: score.total + 1 });
      //   await nextQuestion()
      // } else {
      //   setTries(old => old - 1)
      // }
    }
  }

  async function fetchNewPokemon() {
    // let pkId = Math.ceil(Math.random() * 900);
    const pkId =
      getRandomInRanges(ranges) ?? Math.ceil(Math.random() * list.length);
    // console.log(`custom fetching ${pkId} ${PokeMap[pkId].name}`);
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
        setPkName(idToName(pkId));
      }
    }
  }

  const isCorrect = animState === 1;
  const isWrong = animState === 2;

  return (
    <div
      className={
        `input-container flex flex-col items-center ` + (props.className ?? "")
      }
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
      }}
    >
      <style jsx={true}>{`
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
          // 0% {
          //   transform: translateY(0px);
          // }
          // 25% {
          //   transform: translateY(-8px);
          // }
          // 50% {
          //   transform: translateY(0px);
          // }
          // 75% {
          //   transform: translateY(-4px);
          // }
          // 100% {
          //   transform: translateY(0px);
          // }
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

      {/* <div className="pb-1">
        You have {tries} tries for {points.toFixed(2)} points
      </div> */}

      <SwitchTransition>
        <Transition timeout={0} key={answer} mountOnEnter unmountOnExit>
          {(state) => (
            <div
              className="overflow-clip text-neutral-400"
              style={{
                animationName: answer !== "" ? "show-answer" : "unset",
                animationDuration: "1.5s",
                animationFillMode: "both",
                animationTimingFunction: "ease-in-out",
              }}
            >
              {answer}
            </div>
          )}
        </Transition>
      </SwitchTransition>

      <div
        ref={contentRef}
        className={`relative flex flex-row flex-wrap-reverse justify-center gap-2 items-center content-container content-${
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
            type="search"
            ref={(ref) => {
              inputRef.current = ref ?? undefined;
              inputRef.current?.focus();
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
                inputRef.current?.focus();
              }, 10);
            }}
            placeholder="Enter your guess..."
          />
        </div>

        <div className="flex flex-row gap-2">
          {props.onHint && (
            <button
              className={twMerge(
                "px-3 py-1 rounded-lg transition-all duration-300 hover:scale-90 bg-neutral-700 text-gray-300 text-sm"
              )}
              onClick={() => {
                // setPoints(old => old - hintCost)
                setScore({ correct: score.correct, total: score.total + 1 });
                props.onHint?.();
              }}
            >
              Hint
            </button>
          )}
          <button
            className="skip-button whitespace-pre"
            onClick={() => pkName !== null && submitGuess(true)}
          >
            or skip
          </button>
        </div>
      </div>

      {/* <div className="min-h-10"/> */}

      <div
        className="w-full"
        style={{
          minHeight: 80,
          flex: 1,
          overflow: "auto",
        }}
      >
        {filteredPokes.map(
          (poke, i) =>
            i < 20 && (
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
            )
        )}
      </div>

      {/* {backElement && createPortal(
          <div className="absolute inset-0" onClick={() => inputRef.current?.focus()}>

          </div>
      , backElement)} */}
    </div>
  );
}

export const useQuiz = () => {};

function getRandomInRanges(ranges: [number, number][]) {
  // Calculate the total length of all ranges combined
  const totalLength = ranges.reduce(
    (sum, [min, max]) => sum + (max - min + 1),
    0
  );

  // Pick a random number from 0 to totalLength - 1
  let randomIndex = Math.floor(Math.random() * totalLength);

  // Find which range the random number falls into
  for (const [min, max] of ranges) {
    const rangeLength = max - min + 1;
    if (randomIndex < rangeLength) {
      return min + randomIndex;
    }
    randomIndex -= rangeLength;
  }

  // In case of an empty range array (shouldn't happen if ranges are valid)
  return null;
}

function isNumberInRanges(number, ranges) {
  for (const [min, max] of ranges) {
    if (number >= min && number <= max) {
      return true;
    }
  }
  return false;
}
