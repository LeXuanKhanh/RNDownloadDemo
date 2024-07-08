// @ts-nocheck
// remember to add the config to Tailwind IDE configuration
import plugin from 'tailwindcss/plugin';

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#49cc90',
      },
    },
  },
  plugins: [
    plugin(({addUtilities}) => {
      // @ts-ignore
      addUtilities({
        '.btn': {
          padding: 3,
          borderRadius: 10,
          textTransform: 'uppercase',
          backgroundColor: '#333',
        },
        '.resize-repeat': {
          resizeMode: 'repeat',
        },
      });
    }),
  ],
};
