import { createContext, useState } from 'react'
import { Episode } from '../types/Episode'

export interface PlayerContextData {
  episodes: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  setIsPlayingState: (state: boolean) => void
  playPrevious: () => void
  playNext: () => void
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

  const playList = (list: Episode[], index: number) => {
    setEpisodes(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = (): void => {
    setIsPlaying(!isPlaying)
  }

  const setIsPlayingState = (state: boolean): void => {
    setIsPlaying(state)
  }

  const playPrevious = (): void => {
    if(currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  const playNext = (): void => {
    if((currentEpisodeIndex + 1)  < episodes.length) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodes, 
        currentEpisodeIndex, 
        play,
        playList,
        isPlaying, 
        togglePlay, 
        setIsPlayingState,
        playPrevious,
        playNext,
      }}
    >
      { children }
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider