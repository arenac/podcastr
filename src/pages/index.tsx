import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../components/Header'

export default function Home(props) {

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

// SSR
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()
//   console.log(data)

//   return {
//     props: {
//       episodes: data
//     }
//   }
// }

// SSG (works just as production)
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()
  console.log(data)

  return {
    props: {
      episodes: data
    },
    revalidate: 60 * 60, // will request each our the API
  }
}
