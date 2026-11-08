import { Container } from '@/components/layout/Container';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { Tape } from '@/components/ui/Tape';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { siteConfig } from '@/config/site.config';
import { brandContent } from '@/content/brand.content';
import { footerContent } from '@/content/footer.content';
import { navigationContent } from '@/content/navigation.content';
import { whatsappContent } from '@/content/whatsapp.content';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import styles from './Footer.module.css';

const CURRENT_YEAR = new Date().getFullYear();

type FooterLink = {
  id: string;
  icon: IconName;
  /** Dato visible (usuario, teléfono o dirección). */
  label: string;
  /** Nombre de la red o canal: solo para lectores de pantalla, porque el icono es decorativo. */
  accessibleName: string;
  href: string;
};

const FOOTER_LINKS: FooterLink[] = [
  {
    id: 'instagram',
    icon: 'instagram',
    label: siteConfig.social.instagram.handle,
    accessibleName: footerContent.instagramLabel,
    href: siteConfig.social.instagram.url,
  },
  {
    id: 'whatsapp',
    icon: 'whatsapp',
    label: siteConfig.contact.phone,
    accessibleName: footerContent.whatsappLabel,
    href: buildWhatsAppUrl(siteConfig.whatsapp.phoneNumber, whatsappContent.defaultMessage),
  },
  {
    id: 'address',
    icon: 'map-pin',
    label: siteConfig.contact.address,
    accessibleName: footerContent.addressLabel,
    href: siteConfig.contact.mapsUrl,
  },
];

export function Footer() {
  const { logo } = brandContent;

  return (
    <footer>
      <Tape />
      <Container>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <img
              src={logo.src}
              alt=""
              width={96}
              height={96}
              loading="lazy"
              decoding="async"
              className={styles.logo}
            />
            <div className={styles.brandText}>
              <p className={styles.name}>{siteConfig.name}</p>
              <p className={styles.tagline}>{footerContent.tagline}</p>
            </div>
          </div>

          <nav className={styles.column} aria-label={footerContent.navigationTitle}>
            <Heading level={2} size="lg" className={styles.columnTitle}>
              {footerContent.navigationTitle}
            </Heading>
            <ul className={styles.list} role="list">
              {navigationContent.links.map((link) => (
                <li key={link.id}>
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.column}>
            <Heading level={2} size="lg" className={styles.columnTitle}>
              {footerContent.contactTitle}
            </Heading>
            <ul className={styles.list} role="list">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <ExternalLink className={styles.link} href={link.href}>
                    <Icon name={link.icon} className={styles.icon} />
                    <span>
                      <VisuallyHidden>{link.accessibleName}:</VisuallyHidden> {link.label}
                    </span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {CURRENT_YEAR} {siteConfig.name}. {footerContent.rights}
          </p>
          <p className={styles.availability}>{siteConfig.contact.availability}</p>
        </div>
      </Container>
    </footer>
  );
}
