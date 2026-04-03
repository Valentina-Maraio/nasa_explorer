export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-green': '#00ff9f',
        'cyber-cyan': '#00ffff',
        'cyber-dark': '#0f0a14',
      },
      fontFamily: {
        mono: ["'Courier New'", 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 255, 159, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.3)',
      },
      textShadow: {
        glow: '0 0 10px rgba(0, 255, 159, 0.6)',
        'glow-cyan': '0 0 10px rgba(0, 255, 255, 0.6)',
      },
    },
  },
  plugins: [],
}
