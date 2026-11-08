import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Heading } from '@/components/ui/Heading';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { siteConfig } from '@/config/site.config';
import { SECTION_IDS } from '@/constants/sections';
import { contactContent } from '@/content/contact.content';
import { whatsappContent } from '@/content/whatsapp.content';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import styles from './Contact.module.css';

const HEADING_ID = 'contact-title';

type DetailLinkProps = {
  href: string;
  children: string;
};

function DetailLink({ href, children }: DetailLinkProps) {
  return (
    <ExternalLink className={styles.detailLink} href={href}>
      {children}
    </ExternalLink>
  );
}

/** Banda naranja de marca a todo el ancho. Es una banda: tiene su propio color y no recibe fondo de App.tsx. */
export function Contact() {
  const { detailLabels } = contactContent;

  return (
    <Section id={SECTION_IDS.contact} background="brand" className={styles.band} aria-labelledby={HEADING_ID}>
      <Container className={styles.inner}>
        <Reveal className={styles.copy}>
          <Heading id={HEADING_ID} level={2} size="3xl">
            {contactContent.title}
          </Heading>
          <p className={styles.description}>{contactContent.description}</p>
          <WhatsAppButton variant="dark" size="lg">
            {contactContent.ctaLabel}
          </WhatsAppButton>
        </Reveal>
        <Reveal delay={150}>
          <dl className={styles.details}>
            <div className={styles.detail}>
              <dt>{detailLabels.whatsapp}</dt>
              <dd>
                <DetailLink href={buildWhatsAppUrl(siteConfig.whatsapp.phoneNumber, whatsappContent.defaultMessage)}>
                  {siteConfig.contact.phone}
                </DetailLink>
              </dd>
            </div>
            <div className={styles.detail}>
              <dt>{detailLabels.instagram}</dt>
              <dd>
                <DetailLink href={siteConfig.social.instagram.url}>{siteConfig.social.instagram.handle}</DetailLink>
              </dd>
            </div>
            <div className={styles.detail}>
              <dt>{detailLabels.location}</dt>
              <dd>
                <DetailLink href={siteConfig.contact.mapsUrl}>{siteConfig.contact.address}</DetailLink>
              </dd>
            </div>
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}
