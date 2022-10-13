import React from "react";
import { PokeMap } from "./PokeMap";
import { cacheFetch } from "./Utils";

export interface PkDataInterface {
    name: string,
    id: number,
    sprites: {
        front_default: string,
        [x: string | number | symbol]: any,
    },
    [x: string | number | symbol]: any,
}

interface Props {
    customFetchHandler?: (id: number) => void,
    verifyGuess?: (guess: string) => boolean,

    fetchLink?: (pkID: number) => string,
    onNewData?: (data: any) => void,
    onGuessedCorrectly?: () => void,
    delayNewFetch?: () => Promise<any>,
}

export default function PkGuesser(props: Props) {
    const [animState, setAnimState] = React.useState(0)
    const animRef = React.useRef<any>()
    const contentRef = React.useRef<any>()

    const [pkName, setPkName] = React.useState<any>(null)
    const firstRender = React.useRef(true)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (firstRender.current) {
            console.log('getting new pokemon')
            fetchNewPokemon().catch(console.error);
        } 
        firstRender.current = false;
    }, [])

    function resetAnimation(ref: any) {
        ref.current.style.animation = 'none';
        ref.current.offsetHeight; /* trigger reflow */
        ref.current.style.animation = null; 
    }

    async function submitGuess(skipped = false) {
        resetAnimation(animRef)
        resetAnimation(contentRef)

        const val = inputRef.current?.value ?? ""
        if (inputRef.current) { inputRef.current.value = "" }
        if (!pkName) {return}

        const isCorrect = props.verifyGuess?.(val) ?? 
            (pkName.toLowerCase().replace('-', '').replace(' ', '') === val.toLowerCase().replace('-', '').replace(' ', ''))
        if (isCorrect || skipped) {
            console.log('you are very correct sir')
            props?.onGuessedCorrectly?.()
            setPkName(null)
            setAnimState(1)

            if (props.delayNewFetch) {
                await props.delayNewFetch()
            }
            fetchNewPokemon().catch(console.error);
        }
        else {
            console.log('try again')
            setAnimState(2)
        }
    }

    async function fetchNewPokemon() {
        const pkId = Math.ceil(Math.random() * 900)
        setPkName(PokeMap[pkId].name)
        console.log(`custom fetching ${PokeMap[pkId].name}`)
        if (props.customFetchHandler) {
            props?.customFetchHandler?.(pkId)
        }
        else {
            const res = await cacheFetch(props.fetchLink?.(pkId) ?? `https://pokeapi.co/api/v2/pokemon/${pkId}`)
            if (res) {
                const data = await res.json()
                props?.onNewData?.(data)
            }
        }
    }

    const isCorrect = animState === 1
    const isWrong = animState === 2

    return (
    <div className={`input-container`}>

        <style jsx>{`
            .input-container {
                position: relative;
                z-index: 0;
            }

            @keyframes expand {
                from {
                    opacity: .85;
                }
                to {
                    transform: scaleX(1.5) scaleY(3);
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
                border-radius: 8px;
                opacity: 0;

                background-color: green;
                animation-name: expand;
                animation-duration: .75s;
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
                animation-duration: .2s;
            }
            .content-correct {
                animation-name: correct;
                animation-duration: .5s;
            }
        `}</style>

        <div ref={animRef} className={`animator ${isCorrect?'correct':''} ${isWrong?'wrong':''}`}></div>

        <div ref={contentRef} className={`content-${isCorrect?'correct':''}${isWrong?'wrong':''}`}>
            <input
                ref={inputRef}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {submitGuess()}
                }}
            />

            <button
                onClick={() => submitGuess}
            >{'->'}</button>

            <button
                onClick={() => submitGuess(true)}
            >Skip</button>
        </div>
    </div>
    )
}