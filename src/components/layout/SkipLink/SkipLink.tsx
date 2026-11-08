import { uiContent } from '@/content/ui.content';

import styles from './SkipLink.module.css';

type SkipLinkProps = {
  targetId: string;
};

export function SkipLink({ targetId }: SkipLinkProps) {
  return (
    <a className={styles.skipLink} href={`#${targetId}`}>
      {uiContent.skipToContent}
    </a>
  );
}
