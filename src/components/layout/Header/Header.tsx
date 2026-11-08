import { Container } from '@/components/layout/Container';
import { Navbar } from '@/components/layout/Navbar';
import { SECTION_IDS } from '@/constants/sections';
import { brandContent } from '@/content/brand.content';
import { siteConfig } from '@/config/site.config';

import styles from './Header.module.css';

export function Header() {
  const { logo } = brandContent;

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <a className={styles.brand} href={`#${SECTION_IDS.hero}`} aria-label={`${siteConfig.name}: inicio`}>
          <img src={logo.src} alt="" width={48} height={48} className={styles.logo} />
          <span className={styles.name}>{siteConfig.name}</span>
        </a>
        <Navbar />
      </Container>
      <div className={styles.progress} aria-hidden="true" />
    </header>
  );
}
