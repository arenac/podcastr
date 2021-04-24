import {GetStaticProps, GetServerSideProps } from 'next'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'

import api from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

interface Episode {
  id: string
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  description: string,
  url: string
}
interface HomeProps {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]

}

const Home: React.VFC<HomeProps> = ({ latestEpisodes, allEpisodes }) => {

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
          {latestEpisodes.map((episode) => (
            <li key={episode.id}>
              <Image 
                src={episode.thumbnail} 
                alt={episode.title} 
                width={192} 
                height={192}
                objectFit="cover"
              />

              <div className={styles.episodesDetails}>
                <a href="">{episode.title}</a>
                <p>{episode.members}</p>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Play episode"/>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>

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
    publishedAt: format(parseISO(episode.published_at), 'd/MMM - yyyy', { locale: enGB }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    description: episode.description,
    url: episode.file.url
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
