import { createContext, useState, useContext } from 'react'
import { Episode } from '../types/Episode'

export interface PlayerContextData {
  episodes: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episode: Episode) => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  setIsPlayingState: (state: boolean) => void
  hasPrevious: boolean
  playPrevious: () => void
  hasNext: boolean
  playNext: () => void
}

const PlayerContext = createContext({} as PlayerContextData)

const PlayerContextProvider: React.FC = ({ children }) => {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

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

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling)
  }

  const setIsPlayingState = (state: boolean): void => {
    setIsPlaying(state)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = (currentEpisodeIndex + 1)  < episodes.length

  const playPrevious = (): void => {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  const playNext = (): void => {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodes.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext) {
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
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setIsPlayingState,
        hasPrevious,
        playPrevious,
        hasNext,
        playNext,
      }}
    >
      { children }
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider

export const usePlayer = () => {
  return useContext(PlayerContext)
}