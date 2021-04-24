import React, { useEffect } from 'react'
import {GetStaticProps, GetServerSideProps } from 'next'
import { format, parseISO } from 'date-fns'
import enGB from 'date-fns/locale/en-GB'

import api from '../services/api'
import { converDurationToTimeString } from '../utils/converDurationToTimeString'

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

  console.log('latestEpisodes', latestEpisodes)
  console.log('allEpisodes', allEpisodes)
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
          {latestEpisodes.map(episode => (
            <li>{episode.title}</li>
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
    durationAsString: converDurationToTimeString(Number(episode.file.duration)),
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
