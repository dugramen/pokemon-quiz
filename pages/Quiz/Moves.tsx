import { Children, useMemo, useState } from "react";
import { genRangesMoves } from "../../components/generations";
import PkGuesser from "../../components/PkGuesser";

export default function MovesQuiz(p: { moveList: string[] }) {
  const [data, setData] = useState<any>({});
  const [hints, setHints] = useState(0);
  const englishEntries: any[] = useMemo(
    () =>
      data?.flavor_text_entries?.filter?.((entry) => {
        if (entry?.language?.name !== "en") return false;
        const text: string = entry?.flavor_text ?? "";
        if (text.startsWith("This move can't be used.")) return false;
        if (text.includes("--")) return false;
        return true;
      }) ?? [],
    [data]
  );
  const entryText: string = useMemo(
    () =>
      englishEntries[Math.floor(Math.random() * englishEntries.length)]
        ?.flavor_text ?? "...",
    [englishEntries]
  );

  const HintRender = ({ children }) => {
    return <>{Children.toArray(children).slice(0, hints)}</>;
  };

  console.log("move list ", p.moveList);
  return (
    <div className="app flex flex-col gap-2 items-center">
      <div className="text-center text-balance">{entryText}</div>
      <div className="flex flex-col gap-1 items-center">
        <HintRender>
          <div>Type: {data?.type?.name}</div>
          <div>PP: {data?.pp}</div>
          <div>Power: {data?.power ?? 0}</div>
          <div>Accuracy: {data?.accuracy}</div>
        </HintRender>
      </div>
      <PkGuesser
        className="self-center"
        guessList={p.moveList}
        fetchLink={(id) => `https://pokeapi.co/api/v2/move/${id}`}
        idToName={(id) => p.moveList[id]}
        genRanges={genRangesMoves}
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
  const response = await fetch("https://pokeapi.co/api/v2/move?limit=10000")
    .then((res) => res.json())
    .catch(() => {});
  const data = response?.results ?? [];
  // const datas = await Promise.all(responses.map((res) => res?.json()));
  const items = ["None", ...data.map((item) => item.name)];

  return {
    props: {
      moveList: items,
    },
  };
}
