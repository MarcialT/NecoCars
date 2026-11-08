import { Fragment } from 'react';
import type { ReactElement } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import type { SectionBackground } from '@/components/layout/Section';
import { Tape } from '@/components/ui/Tape';
import { SECTION_IDS } from '@/constants/sections';
import { reviewsContent } from '@/content/reviews.content';
import { Contact } from '@/sections/Contact';
import { GeneralMechanics } from '@/sections/GeneralMechanics';
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks';
import { Reviews } from '@/sections/Reviews';
import { Services } from '@/sections/Services';
import { AboutUs } from '@/sections/AboutUs';
import { Works } from '@/sections/Works';

type PageSection = {
  id: string;
  /** Una banda tiene su propio color: no recibe fondo ni cuenta para alternar. */
  isBand?: boolean;
  /** La banda lleva bloques negros: sus secciones vecinas van en gris para que el borde se distinga. */
  hasDarkBlocks?: boolean;
  render: (background: SectionBackground) => ReactElement;
};

/*
 * Secciones que van después del Hero (que es negro), en el orden en que aparecen.
 * El fondo se alterna automáticamente: nunca quedan dos secciones seguidas con el mismo color,
 * aunque se añada, quite u oculte una (p. ej. Reseñas mientras no haya reseñas reales).
 */
const PAGE_SECTIONS: PageSection[] = [
  { id: SECTION_IDS.services, render: (background) => <Services background={background} /> },
  { id: SECTION_IDS.generalMechanics, isBand: true, render: () => <GeneralMechanics /> },
  { id: SECTION_IDS.howItWorks, render: (background) => <HowItWorks background={background} /> },
  { id: SECTION_IDS.aboutUs, isBand: true, hasDarkBlocks: true, render: () => <AboutUs /> },
  { id: SECTION_IDS.works, render: (background) => <Works background={background} /> },
  ...(reviewsContent.reviews.length > 0
    ? [{ id: SECTION_IDS.reviews, render: (background: SectionBackground) => <Reviews background={background} /> }]
    : []),
  { id: SECTION_IDS.contact, isBand: true, render: () => <Contact /> },
];

function assignBackgrounds(sections: PageSection[]): SectionBackground[] {
  let previous: SectionBackground = 'default'; // El Hero es negro.

  return sections.map((section, index) => {
    if (section.isBand) return 'default';

    const touchesDarkBlocks = sections[index - 1]?.hasDarkBlocks === true || sections[index + 1]?.hasDarkBlocks === true;
    const background: SectionBackground = touchesDarkBlocks || previous === 'default' ? 'subtle' : 'default';
    previous = background;

    return background;
  });
}

const SECTION_BACKGROUNDS = assignBackgrounds(PAGE_SECTIONS);

export function App() {
  return (
    <>
      <SkipLink targetId={SECTION_IDS.main} />
      <Header />
      <main id={SECTION_IDS.main} tabIndex={-1}>
        <Hero />
        <Tape />
        {PAGE_SECTIONS.map((section, index) => (
          <Fragment key={section.id}>{section.render(SECTION_BACKGROUNDS[index] ?? 'default')}</Fragment>
        ))}
      </main>
      <Footer />
    </>
  );
}
