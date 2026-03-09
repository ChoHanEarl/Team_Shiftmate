const base = {
    fonts: {
        sans: "'DM Sans', 'Noto Sans JP', sans-serif",
        mono: "'JetBrains Mono', monospace",
    },
    radius: {
        sm: '6px', md: '10px', lg: '16px', xl: '24px', full: '9999px',
    },
    transition: 'all 0.18s ease',
};

export const lightTheme = {
    ...base,
    isDark: false,
    colors: {
        primary: '#0F0F0F',
        accent: '#3B82F6',
        accentHover: '#2563EB',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        bg: '#F6F7FB',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        borderLight: '#F3F4F6',
        text: '#111827',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
    },
    shadow: {
        sm: '0 1px 3px rgba(0,0,0,0.06)',
        md: '0 4px 16px rgba(0,0,0,0.08)',
        lg: '0 10px 40px rgba(0,0,0,0.10)',
    },
};

export const darkTheme = {
    ...base,
    isDark: true,
    colors: {
        primary: '#F9FAFB',
        accent: '#60A5FA',
        accentHover: '#3B82F6',
        success: '#34D399',
        danger: '#F87171',
        warning: '#FCD34D',
        bg: '#0F1117',
        surface: '#1A1D27',
        border: '#2D3048',
        borderLight: '#252838',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        textMuted: '#64748B',
    },
    shadow: {
        sm: '0 1px 3px rgba(0,0,0,0.3)',
        md: '0 4px 16px rgba(0,0,0,0.4)',
        lg: '0 10px 40px rgba(0,0,0,0.5)',
    },
};

export const theme = lightTheme;