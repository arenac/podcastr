import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'
import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import api from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episodes.module.scss'

interface Episode {
  id: string
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: string,
  duration: number,
  durationAsString: string,
  url: string
  description: string,
}

interface EpisodeProps {
  episode: Episode
}

const Episode: React.VFC<EpisodeProps> = ({ episode }) => {
  return(
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Return"/>
          </button>
        </Link>
        <Image 
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button>
          <img src="/play.svg" alt="Play episode"/>
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div 
        className={styles.description} 
        dangerouslySetInnerHTML={{ __html: episode.description}}
      />
    </div>
  )
}

export default Episode

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params
  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'yy/MMM/d', { locale: enGB }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60, // 1 hour
  }
}