import type { Config } from 'tailwindcss';

export default {
	darkMode: ['class'],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		screens: {
			xs: '480px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1440px',
		},
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
				black: '#000000',
				white1: '#ffffff',
				black1: '#172123',
				black2: '#121017',
				blackBlur: 'rgba(0, 0, 0, 0.5)',
				neutral1: '#FFFFFF',
				neutral2: '#F9FAFB',
				neutral3: '#E5E7EB',
				neutral4: '#C4C9D3',
				neutral5: '#6B7280',
				neutral6: '#525A68',
				neutral7: '#374151',
				neutral8: '#374151',
				neutral9: '#111827',
				darkBlue: '#0F0A32',

				primary3: '#84CAFF',
				primary4: '#53B1FD',
				primary5: '#597EF7',
				primary6: '#1570EF',

				warning2: '#FAAD14',

				purple1: '#DED2F5',
				purple2: '#A978B2',
				characterDown: '#F759AB',
				characterBackground1: '#0C111D',
				characterBackground2: '#1F242F',
				characterBackground3: '#171C27',
				characterUpcoming: '#294B86',
				characterUp: '#13C2C2',

				brandColorTertiary: '#50E796',
				error2: '#FF4D4F',

				success2: '#66C61C',
				success1: '#00FFC0',
				success3: '#97E3C2',
			},
			fontFamily: {
				inter: ['var(--font-inter)', 'sans-serif'],
				whiteRabbit: ['White Rabbit', 'sans-serif'],
				jersey: ['Jersey20-Regular', 'sans-serif'],
				kumbhSans: ['var(--font-kumbhSans)', 'sans-serif'],
				fugazOne: ['var(--font-fugaz-one)', 'sans-serif'],
			},
			backgroundImage: {
				bgGreenLinearButton:
					'linear-gradient(83.86deg, #29DB7C 0.28%, #926BE3 98.75%)',
				bgSelectChainTabItem:
					'linear-gradient(0deg, rgba(25, 251, 155, 0.1), rgba(25, 251, 155, 0.1)),radial-gradient(55.11% 81.25% at 50.53% 100%, rgba(25, 251, 155, 0.5) 0%, rgba(25, 251, 155, 0) 77.5%)',
				bgLinearWhite:
					'linear-gradient(214.9deg, rgba(255, 255, 255, 0.4) 9%, rgba(255, 255, 255, 0.04) 104.69%)',
				bgExploreCard:
					'linear-gradient(180deg, rgba(182, 149, 239, 0.05) 0%, rgba(182, 149, 239, 0.05) 45.5%)',
				bgCardDao:
					'linear-gradient(180deg, #2D8154 0%, rgba(45, 129, 84, 0) 65.93%)',
				bgCardPoint:
					'linear-gradient(180deg, #2D8154 0%, rgba(45, 129, 84, 0.3) 100%)',
				bgBeta:
					'linear-gradient(214.9deg, rgba(255, 255, 255, 0.4) 9%, rgba(255, 255, 255, 0.04) 104.69%),linear-gradient(0deg, #9F4716, #9F4716)',
				textLinear: 'linear-gradient(83.86deg, #29DB7C 0.28%, #926BE3 98.75%)',
			},
			boxShadow: {
				shadowGreenLinearButton: ' 0px 1.97px 46.8px 0px #37CEC57A;',
			},
			keyframes: {
				popUp: {
					from: {
						opacity: '0',
						transform: 'translate(-50%, -48%) scale(0.96)',
					},
					to: {
						opacity: '1',
						transform: 'translate(-50%, -50%) scale(1)',
					},
				},
				fadeIn: {
					from: {
						opacity: '0',
					},

					to: {
						opacity: '1',
					},
				},
				revealUp: {
					from: {
						opacity: '0',
						transform: 'translatey(-10%)',
					},

					to: {
						opacity: '1',
						transform: 'translatey(0%)',
					},
				},
				revealLeft: {
					from: {
						opacity: '0',
						transform: 'translatex(-35%)',
					},

					to: {
						opacity: '1',
						transform: 'translatex(0%)',
					},
				},

				revealRight: {
					from: {
						opacity: '0',
						transform: 'translatex(35%)',
					},

					to: {
						opacity: '1',
						transform: 'translatex(0%)',
					},
				},

				slide: {
					'0%': { transform: 'translateX(calc(0% - 50px))' },
					'100%': { transform: 'translateX(calc(-220%))' },
				},

				slideUpDown: {
					'0%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-50%)',
					},
					'100%': {
						transform: 'translateY(0)',
					},
				},
				rotateHalf: {
					'0%': { transform: 'rotate(90deg)' },
					'100%': {
						transform: 'rotate(0deg)',
					},
				},
				bounceBlinker: {
					'0%, 100%': {
						transform: 'translateY(-25%)',
					},
					'50%': {
						opacity: '0',
						transform: 'translateY(0)',
					},
				},
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				fadeIn: '1s fadeIn ease',
				revealUp: '1.5s revealUp ease',
				hovering: 'hovering 3s infinite',
				revealLeft: '1.5s revealLeft ease',
				revealRight: '1.5s revealRight ease',
				slide: 'slide 20s linear infinite',
				rotateHalf: 'rotateHalf 0.2s ease',
				slideUpDown: 'slideUpDown 5s infinite',
				bounceBlinker: 'bounceBlinker 1s infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
