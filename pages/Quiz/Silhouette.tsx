import React from "react";
import PkGuesser from "../../components/PkGuesser";
import { sample } from "lodash";
import { defaultStyle } from "../../components/QuizStyle";
import { SwitchTransition, Transition } from "react-transition-group";

export default function Silhouette(props: any) {
  const [imgSource, setImgSource] = React.useState<string>("");
  const eventRef = React.useRef(new Event("correct-animation-end"));

  enum Guess {
    none,
    correct,
  }
  const guessState = React.useRef<Guess>(Guess.none);
  const [ghostGuess, setGhostGuess] = React.useState<Guess>(Guess.none);
  const setGuessState = (val: Guess) => {
    setGhostGuess(val);
    guessState.current = val;
  };

  return (
    <div className="app">
      <style jsx>{defaultStyle}</style>

      <style jsx>{`
        .image-wrapper {
          width: 400px;
          height: 400px;
          position: relative;
          z-index: -5;

          opacity: ${guessState.current === Guess.correct ? "0" : "1"};
          transition: 0.5s;
          transition-delay: ${guessState.current === Guess.correct
            ? "1.3s"
            : ".2s"};
        }

        .poke-image {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;

          image-rendering: pixelated;
        }

        .silhouette {
          filter: brightness(0) invert(0.8);
          opacity: ${guessState.current === Guess.correct ? "0" : "1"};
          transition: ${guessState.current === Guess.correct ? "1s" : "0s"};
        }
      `}</style>

      <SwitchTransition>
        <Transition key={imgSource} timeout={0} unmountOnExit mountOnEnter>
          {(state) => (
            <div
              className="w-auto h-[400px] aspect-square min-h-[200px] relative flex-1 transition-all duration-500"
              style={{ opacity: state === "entered" ? 1 : 0 }}
            >
              <img className="poke-image" src={imgSource ?? ""} />
              <img className="poke-image silhouette" src={imgSource ?? ""} />
            </div>
          )}
        </Transition>
      </SwitchTransition>

      <PkGuesser
        onNewData={(data) => {
          console.log([guessState.current]);
          function getVals(object: any): Array<any> {
            let results: Array<any> = [];
            for (const [key, val] of Object.entries(object)) {
              if (key === "generation-i" || key === "generation-ii") {
                continue;
              }
              if (typeof val === "object" && val !== null) {
                results = [...results, ...getVals(val)];
              } else {
                results = [...results, val];
              }
            }
            return results;
          }

          const validSprites: any = getVals(data?.sprites).filter(
            (sprite) => sprite !== null
          );
          const val = sample(validSprites);

          if (guessState.current === Guess.correct) {
            addEventListener("correct-animation-end", () => setImgSource(val), {
              once: true,
            });
          } else {
            setImgSource(val);
          }
        }}
        onGuessedCorrectly={() => {
          console.log("guessed correctly");
          setGuessState(Guess.correct);
          setImgSource((old) => old);

          setTimeout(() => {
            setGuessState(Guess.none);
            setImgSource((old) => old);
            dispatchEvent(eventRef.current);
          }, 1800);
        }}
      />
    </div>
  );
}
