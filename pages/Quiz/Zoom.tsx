import React, { Context } from "react";
import PkGuesser from "../../components/PkGuesser";
import {defaultStyle} from '../../components/QuizStyle';
import { Transition, TransitionGroup } from "react-transition-group";

export default function Zoom() {
    const [src, setSrc] = React.useState<string>()
    const [zoom, setZoom] = React.useState(8)
    const [winner, setWinner] = React.useState(false)

    return (
    <div className="app overflow-clip">
        <style jsx>{defaultStyle}</style>
        <style jsx>{`
            .cropped-image {
                width: auto;
                height: 400px;
                aspect-ratio: 1/1;
                // background-image: url(${src});
                // background-size: ${winner? '100%': `${zoom}%`};
                // background-position: center;
                // transition: ${winner? '.7s': '.4s'};
            }
        `}</style>

        <div
            className="cropped-image flex-1 relative min-w-[200px] min-h-[200px] aspect-square overflow-clip"
        >
            <TransitionGroup>
                <Transition key={src} timeout={0} unmountOnExit mountOnEnter>
                    {state => 
                        <img
                            className="absolute inset-0 origin-center transition-all"
                            src={src}
                            style={{
                                transform: `scale(${winner ? '100' : zoom * 100}%)`,
                                transitionDuration: winner? '.7s': '.4s',
                                opacity: state === 'entered' ? 1 : 0,
                            }}
                        />
                    }
                </Transition>
            </TransitionGroup>
        </div>
    
        <PkGuesser
            onNewData={data => {
                setWinner(false)
                setSrc(data?.sprites.other['official-artwork'].front_default)
                setZoom(8)
            }}
            onGuessedCorrectly={() => {
                setWinner(true)
            }}
            delayNewFetch={() => new Promise(resolve => setTimeout(resolve, 1200))}
            onHint={() => setZoom(old => old/2.0)}
        />

        {/* <button
            onClick={() => setZoom(old => old/2.0)}
        >
            Hint
        </button> */}
    </div>
    )
}