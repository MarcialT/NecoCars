import styles from './Tape.module.css';

/** Cinta de taller: franjas diagonales naranja y negro. Es decorativa y se oculta a lectores de pantalla. */
export function Tape() {
  return <div className={styles.tape} aria-hidden="true" />;
}
