import Link from 'next/link';
import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Link href="/" className={styles.navbarBrand}>
          PEBS Online
        </Link>
      </div>
      <div className={styles.navbarRight}>
        <Link href="/exchanges" className={styles.navLink}>
          Exchanges
        </Link>
        <Link href="/users" className={styles.navLink}>
          Users
        </Link>
        <Link href="/about" className={styles.navLink}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 