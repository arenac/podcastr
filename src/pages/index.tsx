import {GetStaticProps, GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'

import api from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'
import { PlayerContext } from '../contexts/PlayerContext'
import { Episode } from '../types/Episode'

// export interface Episode {
//   id: string
//   title: string
//   thumbnail: string
//   members: string
//   publishedAt: string
//   duration: number
//   durationAsString: string
//   url: string
// }
interface HomeProps {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]

}

const Home: React.VFC<HomeProps> = ({ latestEpisodes, allEpisodes }) => {
  const { playList } = useContext(PlayerContext)

  const episodeList = [...latestEpisodes, ...allEpisodes]

  // SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [])

  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Latest launches</h2>
        <ul>
          {latestEpisodes.map((episode, index) => (
            <li key={episode.id}>
              <Image 
                src={episode.thumbnail} 
                alt={episode.title} 
                width={192} 
                height={192}
                objectFit="cover"
              />

              <div className={styles.episodesDetails}>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button" onClick={() => playList(episodeList, index)}>
                <img src="/play-green.svg" alt="Play episode"/>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
      <h2>All Episodes</h2>

      <table cellSpacing={0}>
        
        <thead>
          <tr>
            <th></th>
            <th>Podcast</th>
            <th>Members</th>
            <th>Date</th>
            <th>Duration</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {allEpisodes.map((episode, index) => (
            <tr key={episode.id}>
              <td style={{ width: 72}}>
                <Image
                  width={120}
                  height={120}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
              </td>
              <td>
                <Link href={`/episodes/${episode.id}`}>
                  <a>{episode.title}</a>
                </Link>
              </td>
              <td>{episode.members}</td>
              <td style={{ width: 120}}>{episode.publishedAt}</td>
              <td>{episode.durationAsString}</td>
              <td>
                <button onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                  <img src="/play-green.svg" alt="Play episode"/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </section>
    </div>
  )
}

export default Home

// SSR
// export const getServerSideProps: GetServerSideProps = async () => {
//   const response = await api.get('episodes?_limit=12&_sort=published_at&_order=desc')
//   console.log(response.data)

//   return {
//     props: {
//       episodes: response.data
//     }
//   }
// }

// SSG (works just as production)
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), 'yy/MMM/d', { locale: enGB }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    url: episode.file.url,

  })) as Episode[]

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60, // will request each our the API
  }
}
