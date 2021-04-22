import React, { useEffect } from 'react'
import {GetStaticProps, GetServerSideProps } from 'next'
import api from '../services/api'

interface Episode {
  id: string
  title: string
  description: string
  members: string
  published_at: string
  file: {
    type: string
    duration: number
    url: string
  }
}
interface HomeProps {
  episodes: Episode[]

}

const Home: React.VFC<HomeProps> = (props) => {

  console.log(props.episodes)
  // SPA
  // useEffect(() => {
  //   fetch('http://localhost:3333/episodes')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }, [])

  return (
    <h1>Index</h1>
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

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60, // will request each our the API
  }
}
