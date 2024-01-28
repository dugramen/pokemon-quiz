import { useRef, useState } from "react";
import PkGuesser from "../../components/PkGuesser";


export default function CriesQuiz() {
  const [name, setName] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  return (
    <div className="flex flex-col justify-center h-full gap-2 items-center w-full">
      <audio
        src={`https://play.pokemonshowdown.com/audio/cries/${name}.mp3`}
        controls
        ref={audioRef}
        // onLoad={() => {
        //   audioRef.current?.play()
        // }}
        autoPlay={true}
        className=""
      />
      <PkGuesser
        onNewData={data => {
          setName(data.name)
        }}
      />
    </div>
  )
}
