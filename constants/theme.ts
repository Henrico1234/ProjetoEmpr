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