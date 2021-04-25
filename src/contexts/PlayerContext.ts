import { createContext } from 'react'
import { Episode } from '../types/Episode'

// export interface Episode {
//   title: string
//   members: string
//   thumbnail: string
//   duration: number
//   utl: string
// }

export interface PlayerContextData {
  episodes: Episode[]
  currentEpisodeIndex: number
  play: (episode: Episode) => void
}

export const PlayerContext = createContext({} as PlayerContextData)