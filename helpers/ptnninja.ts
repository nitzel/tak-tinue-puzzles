import { compressToEncodedURIComponent } from "lz-string";

const playTakTheme = {
  "id": "play-tak",
  "boardStyle": "grid2",
  "boardChecker": false,
  "vars": {
    "piece-border-width": 1
  },
  "colors":
  {
    "primary": "#80d184", // "#8bc34a"
    "secondary": "#607d8b",
    "ui": "#263238",
    "accent": "#202a2f",
    "panel": "#78909cc0",
    "board1": "#e0d5a9ff",
    "board2": "#b78d63ff",
    "board3": "#78909c",
    "player1": "#d6b77cff",
    "player1road": "#d6b77c",
    "player1flat": "#cbae76",
    "player1special": "#dabe89",
    "player1border": "#725130",
    "player2": "#59320bff",
    "player2road": "#725130",
    "player2flat": "#725130",
    "player2special": "#6a4723",
    "player2border": "#cbae76",
    "textLight": "#fafafacd",
    "textDark": "#212121cd",
    "umbra": "#00000033",
    "bg": "#607d8bff",
    "player1clear": "#d6b77c00",
    "player2clear": "#59320b00"
  },
  "primaryDark": false,
  "secondaryDark": true,
  "isDark": true,
  "accentDark": true,
  "panelDark": true,
  "player1Dark": false,
  "player2Dark": true,
  "name": "PlayTak"
};

export const playTakThemeString = compressToEncodedURIComponent(JSON.stringify(playTakTheme));

export const ptnNinjaBaseUrl = `https://ptn.ninja`;

export const generatePtnNinjaLink = (ptn: string, ply: number, style?: string) => {
  const ptnNinjaUrl = new URL(compressToEncodedURIComponent(ptn), ptnNinjaBaseUrl);

  const searchParams = {
    ply: `${ply - 1}!`,
    flatCounts: false,
    highlightSquares: false,
    showRoads: false,
    showScrubber: false,
    theme: style,
    showPTN: false,
    showControls: true,
    showText: false, // show comments
  }
  Object.entries(searchParams).forEach(([key, value]) => value != undefined && ptnNinjaUrl.searchParams.set(key, value.toString()));
  return ptnNinjaUrl.href.replace('?', '&'); //ptn.ninja expects no `?` before the arguments
}