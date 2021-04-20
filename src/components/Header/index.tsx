import format from 'date-fns/format'
import enGB from 'date-fns/locale/en-GB'

import styles from './styles.module.scss'

const Header: React.VFC = () => {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: enGB})
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr"/>

      <p>The best for you listen, always</p>

      <span>{currentDate}</span>
    </header>
  )
}

export default Header
