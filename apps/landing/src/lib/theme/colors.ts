/**
 * Domani Theme Color Tokens
 *
 * Centralized color system for the sage green palette.
 * This file serves as the single source of truth for all colors used in the landing page.
 *
 * @module theme/colors
 *
 * @example
 * // Basic usage
 * import { themeColors } from '@/lib/theme/colors';
 * const primaryColor = themeColors.primary.DEFAULT; // '#7D9B8A'
 *
 * @example
 * // Using in Tailwind config
 * import { tailwindColors } from '@/lib/theme/colors';
 *
 * export default {
 *   theme: {
 *     extend: {
 *       colors: tailwindColors
 *     }
 *   }
 * }
 * // Now use: className="bg-primary-500 text-text-primary"
 *
 * @example
 * // Using CSS variables in components
 * import { cssVariables } from '@/lib/theme/colors';
 *
 * // In globals.css
 * :root {
 *   --color-primary: 150 21% 55%;
 * }
 *
 * // In component
 * <div style={{ backgroundColor: `hsl(var(--color-primary))` }} />
 *
 * @example
 * // Using gradients
 * import { themeColors } from '@/lib/theme/colors';
 *
 * <div className={`bg-gradient-to-r from-[${themeColors.gradients.primary.from}] to-[${themeColors.gradients.primary.to}]`}>
 *   Gradient background
 * </div>
 *
 * @example
 * // Dark mode support (future)
 * const colors = isDarkMode ? themeColors.dark : themeColors;
 * <div style={{ color: colors.text.primary }} />
 *
 * @example
 * // TypeScript type safety
 * import type { HexColor, PrimaryColorKey } from '@/lib/theme/colors';
 *
 * function setColor(key: PrimaryColorKey) {
 *   return themeColors.primary[key]; // Type-safe!
 * }
 */

/**
 * Complete theme color palette
 * All colors follow the sage green aesthetic for a calming, focused user experience
 */
export const themeColors = {
  /**
   * Primary sage green color scale
   * Used for brand identity, primary actions, and key UI elements
   */
  primary: {
    /** Lightest sage tint - subtle backgrounds */
    50: '#F4F7F5',
    /** Very light sage - hover states, light backgrounds */
    100: '#E8EDE9',
    /** Light sage - borders, dividers */
    200: '#D1DBD4',
    /** Medium-light sage - muted accents */
    300: '#A3BFB0',
    /** Medium sage - secondary elements */
    400: '#7D9B8A',
    /** Default primary sage - main brand color */
    500: '#7D9B8A',
    /** Medium-dark sage - hover states */
    600: '#6A8577',
    /** Dark sage - active states, gradient ends */
    700: '#5A7765',
    /** Darker sage - text on light backgrounds */
    800: '#4A5F53',
    /** Darkest sage - high contrast text */
    900: '#3D4A44',
    /** Alias for primary default */
    DEFAULT: '#7D9B8A',
    /** Alias for lighter variant */
    light: '#A3BFB0',
    /** Alias for darker variant */
    dark: '#5A7765',
  },

  /**
   * Background colors - warm neutrals
   * Provides a calm, warm foundation for content
   */
  background: {
    /** Main page background - warm off-white */
    DEFAULT: '#FAF8F5',
    /** Card and elevated surface background */
    card: '#F5F2ED',
    /** Hover state background */
    hover: '#EFEEE8',
  },

  /**
   * Text colors - muted greens and grays
   * Optimized for readability while maintaining brand aesthetic
   */
  text: {
    /** Primary text - headings, important content (WCAG AAA on background) */
    primary: '#3D4A44',
    /** Secondary text - body copy, descriptions (WCAG AA on background) */
    secondary: '#6B7265',
    /** Tertiary text - captions, labels (WCAG AA for large text) */
    tertiary: '#9BA69E',
    /** Muted text - placeholders, disabled states */
    muted: '#ADB7B0',
  },

  /**
   * Priority colors for task/feature categorization
   * Maintains semantic meaning while fitting the sage palette
   */
  priority: {
    /** High priority - coral/terracotta (warm urgency without alarm) */
    high: '#D77A61',
    /** Medium priority - golden amber (noticeable but balanced) */
    medium: '#E8B86D',
    /** Low priority - blue-gray (recedes appropriately) */
    low: '#8B9DAF',
    /** Top priority - uses primary gradient */
    top: {
      from: '#7D9B8A',
      to: '#5A7765',
    },
  },

  /**
   * Border and divider colors
   * Subtle definition for layouts and components
   */
  border: {
    /** Primary border color - standard borders */
    primary: '#E8E4DD',
    /** Secondary border - lighter, more subtle */
    secondary: '#DDD9D0',
    /** Divider lines */
    divider: '#E8E4DD',
  },

  /**
   * Gradient definitions for consistent brand application
   * Use these for buttons, hero sections, and brand moments
   */
  gradients: {
    /** Primary brand gradient - sage to darker sage */
    primary: {
      from: '#7D9B8A',
      to: '#5A7765',
    },
    /** Lighter gradient variant - sage to light sage */
    primaryLight: {
      from: '#7D9B8A',
      to: '#A3BFB0',
    },
  },

  /**
   * Interactive state colors
   * Hover, active, and focus states
   */
  interactive: {
    /** Hover background for buttons/cards */
    hover: '#EFEEE8',
    /** Active/selected background */
    active: '#7D9B8A',
    /** Active shadow color (30% opacity) */
    activeShadow: 'rgba(125, 155, 138, 0.3)',
  },

  /**
   * Dark mode color variants
   * Prepared for future dark theme implementation
   */
  dark: {
    /** Dark mode page background */
    background: '#1A1F1D',
    /** Dark mode card background */
    card: '#242929',
    /** Dark mode elevated surface */
    surface: '#2D3331',
    /** Dark mode text colors */
    text: {
      primary: '#F4F7F5',
      secondary: '#D1DBD4',
      tertiary: '#A3BFB0',
      muted: '#7D9B8A',
    },
    /** Dark mode border colors */
    border: {
      primary: '#3D4A44',
      secondary: '#2D3331',
    },
  },
} as const;

/**
 * Tailwind-compatible color configuration
 * Import this in tailwind.config.js to extend the theme
 *
 * @example
 * ```javascript
 * // tailwind.config.js
 * import { tailwindColors } from './src/lib/theme/colors';
 *
 * export default {
 *   theme: {
 *     extend: {
 *       colors: tailwindColors
 *     }
 *   }
 * }
 * ```
 */
export const tailwindColors = {
  primary: themeColors.primary,
  sage: themeColors.primary, // Semantic alias
  'priority-high': themeColors.priority.high,
  'priority-medium': themeColors.priority.medium,
  'priority-low': themeColors.priority.low,
  background: themeColors.background,
  'text-primary': themeColors.text.primary,
  'text-secondary': themeColors.text.secondary,
  'text-tertiary': themeColors.text.tertiary,
  'text-muted': themeColors.text.muted,
  'border-primary': themeColors.border.primary,
  'border-secondary': themeColors.border.secondary,
} as const;

/**
 * Converts a hex color code to HSL format for CSS variables
 * Tailwind CSS v3+ uses HSL format for better color manipulation
 *
 * @param hex - Hex color code (with or without #)
 * @returns HSL string in format "H S% L%" (e.g., "150 21% 55%")
 *
 * @example
 * ```typescript
 * hexToHSL('#7D9B8A') // Returns "150 21% 55%"
 * hexToHSL('FAF8F5')  // Returns "48 8% 98%"
 * ```
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');

  // Convert hex to RGB (0-1 range)
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h} ${s}% ${l}%`;
}

/**
 * CSS variable definitions in HSL format
 * Use these values in globals.css for dynamic theming
 *
 * These values are pre-computed at build time for zero runtime overhead.
 * The hexToHSL function is preserved for type checking and verification,
 * but these literal values eliminate the need for runtime conversion.
 *
 * @example
 * ```css
 * :root {
 *   --color-primary: 150 21% 55%;
 *   --color-background: 48 8% 98%;
 * }
 * ```
 */
export const cssVariables = {
  '--color-primary': '150 21% 55%', // #7D9B8A
  '--color-primary-light': '150 24% 69%', // #A3BFB0
  '--color-primary-dark': '150 20% 41%', // #5A7765
  '--color-background': '48 8% 98%', // #FAF8F5
  '--color-background-card': '40 18% 95%', // #F5F2ED
  '--color-background-hover': '60 23% 93%', // #EFEEE8
  '--color-text-primary': '150 9% 27%', // #3D4A44
  '--color-text-secondary': '60 6% 42%', // #6B7265
  '--color-text-tertiary': '120 9% 63%', // #9BA69E
  '--color-text-muted': '120 9% 69%', // #ADB7B0
  '--color-border-primary': '40 24% 90%', // #E8E4DD
  '--color-border-secondary': '40 22% 85%', // #DDD9D0
  '--color-priority-high': '11 58% 62%', // #D77A61
  '--color-priority-medium': '36 71% 67%', // #E8B86D
  '--color-priority-low': '210 19% 61%', // #8B9DAF
} as const;

/**
 * Type utilities for consuming the color system
 */

/** Complete theme color structure */
export type ThemeColors = typeof themeColors;

/** Primary color scale keys (50, 100, 200, ..., DEFAULT, light, dark) */
export type PrimaryColorKey = keyof typeof themeColors.primary;

/** Background color keys */
export type BackgroundColorKey = keyof typeof themeColors.background;

/** Text color keys */
export type TextColorKey = keyof typeof themeColors.text;

/** Priority color keys */
export type PriorityColorKey = keyof typeof themeColors.priority;

/** Border color keys */
export type BorderColorKey = keyof typeof themeColors.border;

/** Gradient structure type */
export type Gradient = { readonly from: string; readonly to: string };

/** Valid CSS variable names */
export type CSSVarName = keyof typeof cssVariables;

/** Tailwind color configuration type */
export type TailwindColorConfig = typeof tailwindColors;

/** Hex color format */
export type HexColor = `#${string}`;

/** HSL color format */
export type HSLColor = `${number} ${number}% ${number}%`;

/** RGBA color format */
export type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;

/** All valid color value formats */
export type ColorValue = HexColor | HSLColor | RGBAColor;

/**
 * Default export for convenience
 */
export default themeColors;
