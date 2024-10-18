import React from "react";
import PkGuesser from "../../components/PkGuesser";
import { defaultStyle } from "../../components/QuizStyle";
import { typeSpan } from "../../components/PkType";
import { capitalize } from "../../components/Utils";

interface PKData {
  [x: number | string | symbol]: any;
}

export default function Pokedex(props: any) {
  const [pkName, setPkName] = React.useState<string>();
  const [pkData, setPkData] = React.useState<PKData>();
  const [clues, setClues] = React.useState<PKData>({});
  const possibleClues: PKData = {
    flavor: (data: PKData) => {
      const entries: Array<any> = data?.flavor_text_entries;
      if (!entries) {
        return;
      }

      const enEntries = entries.find((entry) => entry.language.name === "en");
      const flavor: string = enEntries.flavor_text ?? "";
      const reg = new RegExp(data?.name ?? "", "ig");
      // return flavor?.replaceAll(reg, "-----")
      return flavor
        ?.replaceAll(reg, "-----")
        .split(/[.]+/)
        .map((n, i) => <div key={i}>{n}</div>);
    },
    types: (data: PKData) => {
      return (
        <span>
          {`Type: `}
          {typeSpan(data?.types[0].type.name)}
          {data?.types.length > 1 ? (
            <span>
              {" & "}
              {typeSpan(data?.types[1].type.name)}
            </span>
          ) : (
            ""
          )}
        </span>
      );
    },
    shape: (data: PKData) => {
      return `Shape: ${capitalize(data?.shape?.name)}`;
    },
    generation: (data: PKData) => `${capitalize(data.generation.name)}`,
    title: (data: PKData) => {
      const en = data?.genera.find(
        (entry: any) => entry.language.name === "en"
      );
      return capitalize(en.genus);
    },
  };

  const unusedKeys = Object.keys(possibleClues).filter(
    (k) => !clues.hasOwnProperty(k)
  );
  const addClue = (key?: string) => {
    if (!key) {
      key =
        unusedKeys.length > 0
          ? unusedKeys[Math.floor(unusedKeys.length * Math.random())]
          : key;
    }
    if (key) {
      setClues((old) => ({
        ...old,
        [key!]: possibleClues[key!],
      }));
    }
  };

  const renderedClues = Object.values(clues).map(
    (clue, i) => clue ? <div key={i}>{clue?.(pkData)}</div> : "Error"
  );

  return (
    <div className="app">
      <style jsx>{defaultStyle}</style>
      <style jsx>{`
        .app {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .pokedex-info {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          font-size: 16px;
        }
      `}</style>

      <div className="pokedex-info">{renderedClues}</div>

      <PkGuesser
        onHint={unusedKeys.length > 0 ? addClue : undefined}
        hintCost={0.2}
        customFetchHandler={async (id) => {
          setClues({});

          fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .then((response) => response.json())
            .then((data) => {
              setPkName(data.name);
              setPkData((old) => ({ ...old, ...data }));
              setClues({});
              addClue("flavor");
              console.log("complete species fetch");
            });

          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then((data) => {
              setPkData((old) => ({ ...old, ...data }));
              console.log("complete normal fetch");
            });
        }}
      />

      {/* <button
            onClick={() => {
                addClue()
            }}
        >
            Hint
        </button> */}
    </div>
  );
}
