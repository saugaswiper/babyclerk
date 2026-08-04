// Cohesive line-icon set (stroke-based, currentColor, offline, theme-aware) —
// replaces decorative emoji across the app. 24px grid, ~1.75 stroke, round caps.
// Rotation identities map to clean medical-adjacent glyphs (see rotation data
// `icon` fields). Feather-style geometry for the common UI icons.

const P = {
  // --- UI ---
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></>,
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  'arrow-left': <><path d="M19 12H5M12 19l-7-7 7-7" /></>,
  'arrow-right': <><path d="M5 12h14M12 5l7 7-7 7" /></>,
  'chevron-left': <><path d="M15 18l-6-6 6-6" /></>,
  'chevron-right': <><path d="M9 18l6-6-6-6" /></>,
  play: <><path d="M6 4.5v15l13-7.5-13-7.5z" fill="currentColor" stroke="none" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.6" /></>,
  calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  check: <><path d="M20 6L9 17l-5-5" /></>,
  'check-circle': <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  sparkles: <><path d="M12 3l1.8 4.9L19 9.7l-4.9 1.8L12 16l-1.8-4.5L5 9.7l5.2-1.8L12 3z" /><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M4 21h16" /></>,
  image: <><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><circle cx="8.5" cy="10" r="1.8" /><path d="M5 18l4.5-4.5 3 3L16 12l3 3.5" /></>,
  book: <><path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H11v16H5.5A1.5 1.5 0 0 0 4 20.5zM20 4.5A1.5 1.5 0 0 0 18.5 3H13v16h5.5a1.5 1.5 0 0 1 1.5 1.5z" /></>,
  cards: <><rect x="4" y="6.5" width="13" height="13" rx="2.5" /><path d="M8 4.5h9A2.5 2.5 0 0 1 19.5 7v9" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20.5l1.3-4.2A8 8 0 1 1 21 12z" /></>,
  clipboard: <><rect x="5" y="4.5" width="14" height="16" rx="2.5" /><path d="M9 4.5V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v1M8.5 12.5l2.5 2.5 4.5-5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="M4 7l8 6 8-6" /></>,
  shuffle: <><path d="M16 4h4v4M20 4l-7 7M4 20l7-7M16 20h4v-4M4 4l6 6" /></>,
  'trend-up': <><path d="M4 17l6-6 4 4 6-7M17 8h4v4" /></>,
  'trend-down': <><path d="M4 7l6 6 4-4 6 7M17 16h4v-4" /></>,
  seedling: <><path d="M12 21v-8M12 13c0-3 2.5-5 5.5-5-.2 3-2.5 5-5.5 5zM12 15c0-3-2.5-5-5.5-5 .2 3 2.5 5 5.5 5z" /></>,
  pulse: <><path d="M2 12h4l2.5-6 4 12 2.5-6H22" /></>,
  // --- Rotation identities ---
  activity: <><path d="M2 12h4l2.5-6 4 12 2.5-6H22" /></>,
  scissors: <><circle cx="6" cy="7" r="2.4" /><circle cx="6" cy="17" r="2.4" /><path d="M8.2 8.2L20 18M8.2 15.8L20 6" /></>,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0" /><path d="M9 9.5h.01M15 9.5h.01" /></>,
  heart: <><path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5C19 15.4 12 20 12 20z" /></>,
  brain: <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 8 18a3 3 0 0 0 1 .2V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 16 18a3 3 0 0 1-1 .2V4z" /></>,
  zap: <><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></>,
  home: <><path d="M4 11l8-7 8 7M6 10v10h12V10" /></>,
}

export default function Icon({ name, size = 20, strokeWidth = 1.75, className, style, title }) {
  const glyph = P[name]
  if (!glyph) return null
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {glyph}
    </svg>
  )
}
