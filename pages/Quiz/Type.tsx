import React from "react";
import PkGuesser from "../../components/PkGuesser";
import { sample } from "lodash";
import { defaultStyle } from "../../components/QuizStyle";
import { cacheFetch } from "../../components/Utils";
import { typeSpan } from "../../components/PkType";

const pkTypes = [
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "grass",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
];

export default function TypeMatchup() {
  const [quiz, setQuiz] = React.useState<any>(1);
  const [types, setTypes] = React.useState<any>(blackTypes());
  const [matchup, setMatchup] = React.useState<any>(blankMatchup());

  function blackTypes() {
    return { 0: "", 1: "" };
  }
  function blankMatchup() {
    return pkTypes.reduce((accum, val) => ({ ...accum, [val]: 1 }), {});
  }

  const adjustedQuiz = () =>
    types[0] === types[1] ? Math.max(0.5, Math.min(2, quiz)) : quiz;

  return (
    <div className="app">
      <style jsx>{defaultStyle}</style>
      <style jsx>{`
        .hidden {
          display: none;
        }
      `}</style>

      <div className={`question `}>
        {`What type does `}
        {Object.values(types).every((t) => t !== "") ? (
          <span>
            {adjustedQuiz()}
            {"x damage to "}
            {types[0] ? typeSpan(types[0]) : ""}
            {types[1] !== types[0] ? (
              <span>
                {" & "}
                {typeSpan(types[1])}
              </span>
            ) : (
              ""
            )}
          </span>
        ) : (
          ""
        )}
      </div>

      <PkGuesser
        guessList={[...pkTypes, 'none']}
        customFetchHandler={() => {
          const randomType = () => Math.ceil(Math.random() * 18);
          setQuiz(sample([0.25, 0.5, 1, 2, 4]));
          [randomType(), randomType()].forEach((t, i) => {
            setMatchup(blankMatchup());
            setTypes(blackTypes());
            cacheFetch(`https://pokeapi.co/api/v2/type/${t}`)
              .then((response) => response?.json())
              ?.then((data) => {
                const getDamageRelations = (prop: "double" | "half" | "no") =>
                  Object.values(
                    data.damage_relations[`${prop}_damage_from`]
                  ).map((item: any) => item.name);
                setTypes((old: any) => ({
                  ...old,
                  [i]: data.name,
                }));

                setMatchup((old: any) => {
                  const next = { ...old };
                  getDamageRelations("double").forEach((nt: any) => {
                    next[nt] *= 2;
                  });
                  getDamageRelations("half").forEach((nt: any) => {
                    next[nt] *= 0.5;
                  });
                  getDamageRelations("no").forEach((nt: any) => {
                    next[nt] *= 0;
                  });
                  return next;
                });
              });
          });
        }}
        verifyGuess={(guess: string) => {
          const q =
            types[0] === types[1]
              ? quiz > 1
                ? 4
                : quiz < 1
                ? 0.25
                : quiz
              : quiz;
          const guessLowered = guess.toLowerCase().replaceAll(" ", "");
          if (
            Object.values(matchup).some(
              (val: any) => Math.round(val * 4) === Math.round(q * 4)
            )
          ) {
            console.log(matchup);
            return matchup.hasOwnProperty(guessLowered)
              ? Math.round(matchup[guessLowered] * 4) === Math.round(q * 4)
              : false;
          } else {
            console.log("answer is none");
            return guessLowered === "none" || guessLowered === "nothing";
          }
        }}
      />
    </div>
  );
}
