/**
 * CSS class name utility functions
 */

type ClassValue = string | number | bigint | boolean | undefined | null | ClassValue[];
type ClassObject = { [key: string]: boolean | undefined | null };

/**
 * Conditionally join class names together
 * Similar to the popular 'clsx' or 'classnames' libraries
 */
export function cn(...inputs: (ClassValue | ClassObject)[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'number') {
      classes.push(String(input));
    } else if (typeof input === 'bigint') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(' ');
}

/**
 * Create variant class resolver
 */
export function createVariantResolver<T extends string>(
  baseClass: string,
  variants: Record<T, string>
): (variant: T) => string {
  return (variant: T) => cn(baseClass, variants[variant]);
}

/**
 * Merge Tailwind classes, handling conflicts
 * Simple version - for full conflict resolution use tailwind-merge
 */
export function twMerge(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate responsive class names
 */
export function responsive(
  base: string,
  sm?: string,
  md?: string,
  lg?: string,
  xl?: string
): string {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`
  );
}

/**
 * Generate hover class names
 */
export function withHover(base: string, hover: string): string {
  return `${base} hover:${hover}`;
}

/**
 * Generate focus class names
 */
export function withFocus(base: string, focus: string): string {
  return `${base} focus:${focus}`;
}

/**
 * Generate disabled class names
 */
export function withDisabled(base: string, disabled: string): string {
  return `${base} disabled:${disabled}`;
}
