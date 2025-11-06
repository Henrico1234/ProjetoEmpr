<<<<<<< HEAD
import { Platform } from 'react-native';

// Paleta de cores mais moderna
const palette = {
  primary: '#2563eb',    // Azul vibrante moderno
  primaryDark: '#1e40af',
  success: '#059669',    // Verde esmeralda (menos agressivo que o verde puro)
  danger: '#dc2626',     // Vermelho moderno
  warning: '#d97706',    // Laranja escuro para pendentes
  backgroundLight: '#f8fafc', // Cinza muito suave para fundo, melhor que branco puro
  cardLight: '#ffffff',
  textPrimaryLight: '#1e293b', // Quase preto, mais suave para leitura
  textSecondaryLight: '#64748b', // Cinza azulado para subtítulos
};

export const Colors = {
  light: {
    text: palette.textPrimaryLight,
    textSecondary: palette.textSecondaryLight,
    background: palette.backgroundLight,
    card: palette.cardLight,
    tint: palette.primary,
    icon: palette.textSecondaryLight,
    tabIconDefault: '#94a3b8',
    tabIconSelected: palette.primary,
    // Cores semânticas
    primary: palette.primary,
    success: palette.success,
    danger: palette.danger,
    warning: palette.warning,
    border: '#e2e8f0',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    background: '#0f172a', // Azul noite profundo
    card: '#1e293b',       // Azul acinzentado escuro
    tint: '#38bdf8',       // Azul claro para contraste no escuro
    icon: '#9ca3af',
    tabIconDefault: '#64748b',
    tabIconSelected: '#38bdf8',
    // Cores semânticas dark
    primary: '#38bdf8',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
    border: '#334155',
  },
};

// ... (mantenha o resto do ficheiro Fonts como está)
=======
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
>>>>>>> c4b61244c7ce19a54d290dc0128c37525eb13cfe
