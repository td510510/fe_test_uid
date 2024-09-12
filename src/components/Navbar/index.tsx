import { ROUTES } from '@/constant';
import styles from './navbar.module.scss';
import { Link } from 'react-router-dom';
const NavBar = () => {
  return (
    <nav className={styles.container}>
      <ul className={styles.menu} role="list">
        {
          ROUTES.map((item: { link: string, menu: string }) => (
            <li key={item.menu}>
              <Link to={item.link}>
                {item.menu}
              </Link>
            </li>
          ))
        }
      </ul>
    </nav>
  )
}

export default NavBar
