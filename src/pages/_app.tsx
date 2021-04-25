import '../styles/global.scss'
import { useState } from 'react'
import Header from '../components/Header'
import Player from '../components/Player'
import styles from '../styles/app.module.scss'
import { Episode, PlayerContext } from '../contexts/PlayerContext'


function MyApp({ Component, pageProps }) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)

  const play = (episode: Episode): void => {
    setEpisodes([episode])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider value={{ episodes, currentEpisodeIndex, play}}>
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
