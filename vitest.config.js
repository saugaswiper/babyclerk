import { defineConfig } from 'vitest/config'

// Tests run against the plain-JS engine modules (`src/lib/*`), so they skip the
// app's react + PWA plugins entirely — faster, and nothing to configure when
// those plugins change. Add `@vitejs/plugin-react` here if a component test
// ever needs JSX.
export default defineConfig({
  test: {
    include: ['src/**/*.test.js'],
    environment: 'node',
  },
})
