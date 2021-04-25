
import Image from 'next/image'
import { useContext, useRef, useEffect } from 'react'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { PlayerContext } from '../../contexts/PlayerContext'

import styles from './styles.module.scss'

const Player: React.VFC = () => {
  const audioRef = useRef<HTMLAudioElement>(null)

  const { 
    episodes, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setIsPlayingState,
    playPrevious,
    playNext,
  } = useContext(PlayerContext)

  useEffect(() => {
    if(!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }

  }, [isPlaying])
  const episode = episodes[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Playing now"/>
        Playing now
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Select a podcast to listen</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>00:00</span>
          <div className={styles.slider}>
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04d361'}}
                railStyle={{ backgroundColor: '#9f75ff'}}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>00:00</span>
        </div>

        { episode && (
          <audio 
            ref={audioRef}
            src={episode.url}
            autoPlay
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
          />
        )}
        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Shuffle"/>
          </button>
          <button type="button" disabled={!episode} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Previous"/>
          </button>
          <button 
            className={styles.playButton} 
            type="button" 
            disabled={!episode}
            onClick={() => togglePlay()}
          >
            { isPlaying 
              ? <img src="/pause.svg" alt="Pause"/>
              : <img src="/play.svg" alt="Play"/>
            }
          </button>
          <button type="button" disabled={!episode} onClick={playNext}>
            <img src="/play-next.svg" alt="Next"/>
          </button>
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repeat"/>
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Player
