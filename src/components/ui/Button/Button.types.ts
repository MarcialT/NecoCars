import type { ComponentPropsWithoutRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
};

export type ButtonAsButtonProps = ButtonOwnProps &
  ComponentPropsWithoutRef<'button'> & {
    href?: undefined;
  };

export type ButtonAsLinkProps = ButtonOwnProps &
  ComponentPropsWithoutRef<'a'> & {
    href: string;
    /** Abre en pestaña nueva de forma segura y avisa a los lectores de pantalla. */
    isExternal?: boolean;
  };

/** Con `href` se renderiza un <a> (navegación); sin `href`, un <button> (acción). */
export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;
