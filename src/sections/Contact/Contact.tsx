import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { Heading } from '@/components/ui/Heading';
import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { siteConfig } from '@/config/site.config';
import { SECTION_IDS } from '@/constants/sections';
import { contactContent } from '@/content/contact.content';
import { whatsappContent } from '@/content/whatsapp.content';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import styles from './Contact.module.css';

const HEADING_ID = 'contact-title';

type ContactChannel = {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
};

/** Banda naranja de marca a todo el ancho. Es una banda: tiene su propio color y no recibe fondo de App.tsx. */
export function Contact() {
  const { detailLabels } = contactContent;
  const { contact, social, whatsapp } = siteConfig;

  const channels: ContactChannel[] = [
    {
      id: 'whatsapp',
      icon: 'whatsapp',
      label: detailLabels.whatsapp,
      value: contact.phone,
      href: buildWhatsAppUrl(whatsapp.phoneNumber, whatsappContent.defaultMessage),
    },
    {
      id: 'instagram',
      icon: 'instagram',
      label: detailLabels.instagram,
      value: social.instagram.handle,
      href: social.instagram.url,
    },
    {
      id: 'location',
      icon: 'map-pin',
      label: detailLabels.location,
      value: contact.address,
      href: contact.mapsUrl,
    },
  ];

  return (
    <Section id={SECTION_IDS.contact} background="brand" className={styles.band} aria-labelledby={HEADING_ID}>
      <Container className={styles.inner}>
        <Reveal className={styles.copy}>
          <Heading id={HEADING_ID} level={2} size="3xl">
            {/* Dos textos según el tamaño de pantalla; el oculto es `display: none`, así que no lo lee el lector de pantalla. */}
            <span className={styles.titlePhone}>{contactContent.titleShort}</span>
            <span className={styles.titleDesktop}>{contactContent.title}</span>
          </Heading>
          <p className={styles.description}>{contactContent.description}</p>
          <WhatsAppButton variant="dark" size="lg" className={styles.cta}>
            {contactContent.ctaLabel}
          </WhatsAppButton>
        </Reveal>
        <Reveal delay={150}>
          <ul className={styles.channels} role="list">
            {channels.map((channel) => (
              <li key={channel.id}>
                <ExternalLink className={styles.channel} href={channel.href}>
                  <Icon name={channel.icon} size={2} className={styles.channelIcon} />
                  <span className={styles.channelText}>
                    <span className={styles.channelLabel}>{channel.label}</span>{' '}
                    <span className={styles.channelValue}>{channel.value}</span>
                  </span>
                  <Icon name="arrow-up-right" size={1.5} className={styles.channelArrow} />
                </ExternalLink>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
