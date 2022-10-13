import React from "react";
import PkGuesser from "../../components/PkGuesser";
import {defaultStyle} from '../../components/QuizStyle';

interface PKData {
    [x: number | string | symbol]: any;
}

export default function Pokedex(props: any) {
    const [pkName, setPkName] = React.useState<string>()
    const [pkData, setPkData] = React.useState<PKData>()
    const [clues, setClues] = React.useState<PKData>({})
    const possibleClues: PKData = {
        flavor: (data: PKData) => {
            const entries: Array<any> = data?.flavor_text_entries
            if (!entries) {return}

            const enEntries = entries.find(entry => entry.language.name === 'en')
            const flavor: string = enEntries.flavor_text ?? ""
            const reg = new RegExp(data?.name ?? "", "ig")
            // return flavor?.replaceAll(reg, "-----")
            return flavor?.replaceAll(reg, "-----").split(/[.]+/).map(n => <div>{n}</div>)
        },
        types: (data: PKData) => {
            return `Type: ${data?.types[0].type.name}${data?.types.length > 1? ` & ${data?.types[1].type.name}`: ''}`
        },
        shape: (data: PKData) => {
            return `Shape: ${data?.shape?.name}`
        },
        generation: (data: PKData) => (`${data.generation.name}`),
        title: (data: PKData) => {
            const en = data?.genera.find((entry: any) => entry.language.name === 'en')
            return en.genus
        }
    }

    const addClue = (key?: string) => {
        if (!key) {
            const unusedKeys = Object.keys(possibleClues).filter(k => !clues.hasOwnProperty(k))
            key = unusedKeys.length > 0 ? unusedKeys[Math.floor(unusedKeys.length * Math.random())]: key
        }
        if (key) {
            setClues(old => ({
                ...old,
                [key!]: possibleClues[key!],
            }))
        }
    }

    const renderedClues = Object.values(clues).map(clue => <div>{clue?.(pkData)}</div> ?? "Error")

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
                font-size: 1.17em;
                font-weight: bold;
            }
        `}</style>

        <div className="pokedex-info">
            {renderedClues}
        </div>        

        <PkGuesser
            customFetchHandler={async (id) => {
                fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
                    .then(response => response.json())
                    .then((data) => {
                        setPkName(data.name)
                        setPkData(old => ({...old, ...data}))
                        setClues({})
                        addClue("flavor")
                        console.log('complete species fetch')
                    })
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        setPkData(old => ({...old, ...data}))
                        console.log('complete normal fetch')
                    })
            }}
        />
        
        <button
            onClick={() => {
                addClue()
            }}
        >
            Hint
        </button>
    </div>
    )
}