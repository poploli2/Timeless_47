/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // 主色系 - 更加高级的恋爱粉
                love: {
                    50: '#fff0f3', // 更干净的背景
                    100: '#ffe3e8',
                    200: '#ffcdd7',
                    300: '#ffaebf',
                    400: '#fb7193',
                    500: '#f43f6e', // 稍微提亮
                    600: '#e11d53',
                    700: '#be1242',
                    800: '#9f123d',
                    900: '#88133a',
                    950: '#4c051d', // 新增深色
                },
                // 辅助色系 - 优雅的玫瑰金/紫调
                rose: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#ec4899',
                    600: '#db2777',
                    700: '#be185d',
                    800: '#9d174d',
                    900: '#831843',
                },
                // 暖色系 - 柔和的香槟金
                warm: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                // 中性色 - 高级灰
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                }
            },
            fontFamily: {
                // 优化中文字体栈：优先系统字体，最后才是通用字体
                sans: [
                    'PingFang SC',      // 苹果系统默认
                    'Hiragino Sans GB', // 冬青黑体
                    'Microsoft YaHei',  // 微软雅黑
                    'Noto Sans SC',     // Google Fonts (如果加载了)
                    'Inter',
                    'ui-sans-serif',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif'
                ],
                handwriting: ['LXGW WenKai', 'Dancing Script', 'cursive'],
                serif: ['Noto Serif SC', 'Songti SC', 'SimSun', 'serif'], // 增加衬线体用于特定场景
            },
            animation: {
                'fade-in': 'fade-in 0.5s ease-out',
                'fade-in-up': 'fade-in-up 0.6s ease-out',
                'fade-in-down': 'fade-in-down 0.5s ease-out',
                'slide-in-right': 'slide-in-right 0.5s ease-out',
                'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                'fade-in-down': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                },
                'slide-in-right': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateX(-30px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateX(0)'
                    },
                },
                'bounce-in': {
                    '0%': {
                        opacity: '0',
                        transform: 'scale(0.3)'
                    },
                    '50%': {
                        transform: 'scale(1.05)'
                    },
                    '70%': {
                        transform: 'scale(0.9)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'scale(1)'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            boxShadow: {
                'love': '0 4px 14px 0 rgba(244, 63, 94, 0.15)',
                'love-lg': '0 10px 25px -3px rgba(244, 63, 94, 0.2)',
                'rose': '0 4px 14px 0 rgba(249, 50, 108, 0.15)',
                'inner-love': 'inset 0 2px 4px 0 rgba(244, 63, 94, 0.06)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-love': 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
                'gradient-warm': 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
        }
    },
    plugins: [],
}
