import { useContext, useMemo, useState } from "react";
import { allGenerations, GenerationsContext } from "../components/generations";
import { useRouter } from "next/router";

export default function SettingsPage() {
  // const router = useRouter();
  const { generations, setGenerations } = useContext(GenerationsContext);
  const [tempGens, setTempGens] = useState(generations);
  const genMap = new Set(generations ?? []);
  const tempGenMap = new Set(tempGens ?? []);
  // const genMap = useMemo(() => new Set(generations), [generations]);

  // console.log({genMap, tempGens})

  return (
    <form
      className="flex flex-col items-center self-center"
      onSubmit={(e) => {
        e.preventDefault();
        const gens = allGenerations.filter(
          (gen) => e.target[`gen-${gen}`]?.checked
        );
        console.log({ gens });
        allGenerations.forEach((gen) => {
          const key = `gen-${gen}`;
          localStorage.setItem(key, e.target[key]?.checked);
        });
        setGenerations(gens);
      }}
    >
      <label className="flex flex-row items-center py-2 w-full">
        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.currentTarget.checked;
            setTempGens(checked ? allGenerations : []);
            // const form = e.target.form;
            // if (form) {
            //   allGenerations.forEach((gen) => {
            //     form.elements[`gen-${gen}`].checked = checked;
            //   });
            // }
          }}
          checked={tempGens.length > 0}
          // className="self-start my-1"
        />
        <div className="min-w-0 flex-1"></div>
      </label>
      {allGenerations.map((gen) => (
        <label key={gen} className="flex flex-row gap-2 py-1 items-center">
          <input
            name={`gen-${gen}`}
            type="checkbox"
            // defaultChecked={useMemo(() => {
            //   return generations.includes(gen)
            // }, [generations])}
            checked={tempGens.includes(gen)}
            onChange={(e) => {
              const ns = new Set(tempGens);
              e.currentTarget.checked ? ns.add(gen) : ns.delete(gen);
              setTempGens(Array.from(ns));
            }}
          />
          {`Generation ${gen}`}
        </label>
      ))}
      <button
        className="px-3 py-1 my-2 rounded-md bg-neutral-800 disabled:opacity-50"
        disabled={allGenerations.every(
          (gen) => tempGenMap.has(gen) === genMap.has(gen)
        )}
      >
        Save
      </button>
    </form>
  );
}
