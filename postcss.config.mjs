/**
 * Tailwind runs only where a stylesheet imports it.
 *
 * The landing page's globals.css does not, so adding this plugin leaves it
 * untouched: no preflight, no reset, none of its hand-written CSS overridden.
 * Only the docs stylesheet pulls Tailwind in, and Next ships that file solely
 * on the /docs route.
 */
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
