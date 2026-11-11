// Pictogram geometry shared by all directions (24×24). Each direction applies its own stroke style.
export const ICON_PATHS = {
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  'arrow-down': '<path d="M12 4v15M6 13l6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  menu: '<path d="M3 8h18M3 16h18"/>',
  search: '<path d="M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.5 15.5L20 20"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  compare: '<path d="M4 6h7v12H4zM13 6h7v12h-7z"/>',
  // surface types
  dur: '<path d="M3 17l9-5 9 5-9 5zM3 12l9-5 9 5"/>',
  textile: '<path d="M4 7c2.5-2 5.5-2 8 0s5.5 2 8 0M4 12c2.5-2 5.5-2 8 0s5.5 2 8 0M4 17c2.5-2 5.5-2 8 0s5.5 2 8 0"/>',
  exterieur: '<path d="M3 20h18M6 20V10l6-5 6 5v10M12 14v6"/>',
  escalator: '<path d="M3 19h4l9-11h5M7 19l9-11M5 15l2 2"/>',
  // sectors
  sante: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  logistique: '<path d="M3 20V9l9-5 9 5v11M7 20v-7h10v7M7 16h10"/>',
  industrie: '<path d="M3 20V10l5 3V10l5 3V6h4l1 14zM3 20h18"/>',
  commerce: '<path d="M4 8h16l-1.5 12h-13zM8.5 8a3.5 3.5 0 0 1 7 0"/>',
  hotellerie: '<path d="M3 18h18M5 18v-5a7 7 0 0 1 14 0v5M12 6V4M10 4h4"/>',
  collectivites: '<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M3 10l9-6 9 6z"/>',
};
