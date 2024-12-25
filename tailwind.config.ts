import { type Config } from "tailwindcss";
import animate from "tailwindcss-animate";
export default {
	darkMode: ["class"],
	content: ["./src/**/*.tsx"],
	theme: {
    	container: {
    		center: true,
    		padding: {
    			DEFAULT: '1rem',
    			sm: '2rem',
    			lg: '4rem',
    			xl: '6rem',
    			'2xl': '8rem'
    		},
    		screens: {
    			sm: '640px',
    			md: '768px',
    			lg: '1024px',
    			xl: '1280px',
    			'2xl': '1536px'
    		}
    	},
    	extend: {
    		fontFamily: {
    			heading: [
    				'var(--font-heading)'
    			],
    			text: [
    				'var(--font-text)'
    			]
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			light: '#fec76f',
    			text: '#252525',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			},
    			sidebar: {
    				DEFAULT: 'hsl(var(--sidebar-background))',
    				foreground: 'hsl(var(--sidebar-foreground))',
    				primary: 'hsl(var(--sidebar-primary))',
    				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
    				accent: 'hsl(var(--sidebar-accent))',
    				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
    				border: 'hsl(var(--sidebar-border))',
    				ring: 'hsl(var(--sidebar-ring))'
    			}
    		},
    		keyframes: {
    			pulseBackground2: {
    				'0%': {
    					backgroundPosition: '200% 0%'
    				},
    				'50%': {
    					backgroundPosition: '100% 0%',
    					opacity: '1'
    				},
    				'100%': {
    					backgroundPosition: '0% 0%',
    					opacity: '0.8'
    				}
    			},
    			pulseBackground: {
    				'0%': {
    					backgroundPosition: '200% 0%'
    				},
    				'100%': {
    					backgroundPosition: '-200% 0%'
    				}
    			},
    			backgroundSlide: {
    				'0%': {
    					backgroundPosition: '200% 0%'
    				},
    				'100%': {
    					backgroundPosition: '-200% 0%'
    				}
    			},
    			shine: {
    				'0%': {
    					transform: 'translateX(-100%) translateY(-100%) rotate(45deg)',
    					opacity: '0'
    				},
    				'50%': {
    					opacity: '0.5'
    				},
    				'100%': {
    					transform: 'translateX(100%) translateY(100%) rotate(45deg)',
    					opacity: '0'
    				}
    			},
    			wave: {
    				'0%, 100%': {
    					clipPath: 'polygon(0% 45%, 25% 50%, 50% 45%, 75% 50%, 100% 45%, 100% 100%, 0% 100%)'
    				},
    				'50%': {
    					clipPath: 'polygon(0% 50%, 25% 45%, 50% 50%, 75% 45%, 100% 50%, 100% 100%, 0% 100%)'
    				}
    			},
    			waveBorder: {
    				'0%, 100%': {
    					clipPath: 'polygon(0% 45%, 25% 50%, 50% 45%, 75% 50%, 100% 45%, 100% 100%, 0% 100%)'
    				},
    				'50%': {
    					clipPath: 'polygon(0% 50%, 25% 45%, 50% 50%, 75% 45%, 100% 50%, 100% 100%, 0% 100%)'
    				}
    			},
    			flash: {
    				'0%': {
    					transform: 'translateX(-100%) skewX(-25deg)',
    					opacity: '0'
    				},
    				'50%': {
    					opacity: ' 0.3'
    				},
    				'100%': {
    					transform: 'translateX(100%) skewX(-25deg)',
    					opacity: '0'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			shine: 'shine 3s forwards',
    			wave: 'wave 2s ease-in-out infinite',
    			'background-slide': 'backgroundSlide 1s ease-in-out infinite',
    			'pulse-background-2': 'pulseBackground2 1.5s ease-in-out infinite',
    			'pulse-background': 'pulseBackground 1.5s ease-in-out infinite',
    			'wave-border': 'waveBorder 2s ease-in-out infinite',
    			flash: 'flash 1s ease-in-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [animate],
} satisfies Config;
