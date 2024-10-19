import { Children, useMemo, useState } from "react";
import PkGuesser from "../../components/PkGuesser";
import { genRangesAbilities } from "../../components/generations";

export default function AbilityQuiz(p: { abilities: string[] }) {
  const [data, setData] = useState<any>({});
  const [hints, setHints] = useState(0);
  const englishEntries: any[] = useMemo(
    () =>
      data?.flavor_text_entries?.filter?.(
        (entry) => entry?.language?.name == "en"
      ) ?? [],
    [data]
  );
  const entryText: string = useMemo(
    () =>
      englishEntries[Math.floor(Math.random() * englishEntries.length)]
        ?.flavor_text ?? "Nothing here",
    [englishEntries]
  );
  const pokesWithAbility = useMemo<any[]>(
    () => shuffleArray(data?.pokemon ?? []),
    [data]
  );

  console.log("ability list ", p.abilities);
  return (
    <div className="app flex flex-col gap-2 items-center">
      <div className="text-center text-balance">{entryText}</div>
      {hints >= 1 && (
        <>
          <div className="grid grid-cols-[auto_1fr] gap-1">
            <div className="col-span-2">Pokemon:</div>
            {pokesWithAbility.slice(0, hints).map((item, i) => (
              <>
                <div>-</div>
                <div key={i}>{item?.pokemon?.name}</div>
              </>
            ))}
          </div>
        </>
      )}
      <PkGuesser
        className="self-center"
        guessList={p.abilities}
        fetchLink={(id) => `https://pokeapi.co/api/v2/ability/${id}`}
        idToName={(id) => p.abilities[id]}
        genRanges={genRangesAbilities}
        onNewData={(d) => {
          setData(d);
          setHints(0);
        }}
        onHint={() => setHints((old) => old + 1)}
      />
    </div>
  );
}

export async function getStaticProps() {
  const response = await fetch("https://pokeapi.co/api/v2/ability?limit=10000")
    .then((res) => res.json())
    .catch(() => {});
  const data = response?.results ?? [];
  // const datas = await Promise.all(responses.map((res) => res?.json()));
  const items = ["None", ...data.map((item) => item.name)];

  return {
    props: {
      abilities: items,
    },
  };
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
