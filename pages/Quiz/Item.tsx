import React from "react";
import { defaultStyle } from "../../components/QuizStyle";
import PkGuesser from "../../components/PkGuesser";
import { cacheFetch } from "../../components/Utils";

const categories = {
  items: [
    "held-items",
    "choice",
    "effort-training",
    "training",
    "bad-held-items",
    "type-enhancement",
    "evolution",
    "spelunking",
    "species-specific",
  ],
  medicine: [
    // 'stat-boosts',
    "healing",
    "pp-recovery",
    "revival",
    "status-cures",
  ],
  "poke-balls": ["standard-balls", "special-balls", "apricorn-balls"],
};

interface Props {
  items: { name: ""; url: "" }[];
}

export default function Item(props: Props) {
  const [itemName, setItemName] = React.useState<any>();
  const [itemData, setItemData] = React.useState({
    sprite: "",
    description: "",
  });
  const [hintShown, setHintShown] = React.useState(false);

  return (
    <div className="app">
      <style jsx>{defaultStyle}</style>
      <style jsx>{`
        img {
          width: 100px;
          height: 100px;
          image-rendering: pixelated;
        }
        .description {
          font-size: 16px;
          font-weight: normal;
        }
      `}</style>

      <img src={itemData.sprite} />

      {hintShown && <h3 className="description">{itemData.description}</h3>}

      <PkGuesser
        onHint={() => setHintShown(true)}
        guessList={props.items.map((item) => item.name)}
        customFetchHandler={() => {
          const id = Math.floor(Math.random() * props.items.length);
          const name = props.items[id].name;
          console.log(name);
          setItemName(name);
          setHintShown(false);
          cacheFetch(props.items[id].url)
            .then((response) => response?.json())
            .then((data) => {
              setItemData({
                sprite: data.sprites.default,
                description: data.flavor_text_entries.find(
                  (entry: any) => entry.language.name === "en"
                ).text,
              });
            });
        }}
        verifyGuess={(guess) => {
          const alphaNum = (str: string) =>
            str
              .toLowerCase()
              .replace(/[^a-zA-Z0-9 ]/g, "")
              .replaceAll(" ", "");
          return alphaNum(guess) === alphaNum(itemName);
        }}
      />

      {/* <button
            className="hint-button"
            onClick={() => setHintShown(true)}
        >
            Hint
        </button> */}
    </div>
  );
}

export async function getStaticProps() {
  const tags = categories["items"]
    .concat(categories.medicine)
    .concat(categories["poke-balls"]);
  const responses = await Promise.all(
    tags.map((tag) => fetch(`https://pokeapi.co/api/v2/item-category/${tag}`))
  );
  const datas = await Promise.all(responses.map((res) => res?.json()));
  const items = datas.reduce((accum, val) => accum.concat(val.items), []);

  return {
    props: {
      items: items,
    },
  };
}
