import '../styles/global.scss'
import { useState } from 'react'
import Header from '../components/Header'
import Player from '../components/Player'
import styles from '../styles/app.module.scss'
import { PlayerContext } from '../contexts/PlayerContext'
import { Episode } from '../types/Episode'


function MyApp({ Component, pageProps }) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const play = (episode: Episode): void => {
    setEpisodes([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying)
  }

  const setIsPlayingState = (state: boolean): void => {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{ episodes, currentEpisodeIndex, play, isPlaying, togglePlay, setIsPlayingState }}>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
