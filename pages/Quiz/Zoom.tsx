import React, { Context } from "react";
import PkGuesser from "../../components/PkGuesser";
import {defaultStyle} from '../../components/QuizStyle';

export default function Zoom() {
    const [src, setSrc] = React.useState<string>()
    const [zoom, setZoom] = React.useState(800)
    const [winner, setWinner] = React.useState(false)

    return (
    <div className="app">
        <style jsx>{defaultStyle}</style>
        <style jsx>{`
            .cropped-image {
                background-image: url(${src});
                width: 400px;
                height: 400px;
                background-size: ${winner? '100%': `${zoom}%`};
                background-position: center;
                transition: ${winner? '.7s': '.4s'};
            }
        `}</style>

        <div
            className="cropped-image"
        ></div>
    
        <PkGuesser
            onNewData={data => {
                setWinner(false)
                setSrc(data?.sprites.other['official-artwork'].front_default)
                setZoom(800)
            }}
            onGuessedCorrectly={() => {
                setWinner(true)
            }}
            delayNewFetch={() => new Promise(resolve => setTimeout(resolve, 1200))}
        />

        <button
            onClick={() => setZoom(old => old/2.0)}
        >
            Hint
        </button>
    </div>
    )
}