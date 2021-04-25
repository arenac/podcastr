import { createContext, useState } from 'react'
import { Episode } from '../types/Episode'

export interface PlayerContextData {
  episodes: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episode: Episode) => void
  togglePlay: () => void
  setIsPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData)

const PlayerContextProvider: React.FC = ({ children }) => {
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
    <PlayerContext.Provider 
      value={{ 
        episodes, 
        currentEpisodeIndex, 
        play, 
        isPlaying, 
        togglePlay, 
        setIsPlayingState 
      }}
    >
      { children }
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider