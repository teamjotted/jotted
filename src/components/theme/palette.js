import { alpha } from "@mui/material/styles";

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

const PRIMARY = {
  lighter: "#def4ff",
  light: "#498dcb",
  main: "#000",
  dark: "#264f8c",
  darker: "#273855",
};
const SECONDARY = {
  lighter: "#96cbf4",
  light: "#d3ebff",
  main: "#0c70c3",
  dark: "#498dcb",
  darker: "#264e98",
};
const INFO = {
  lighter: "#d0f2ff",
  light: "#98e5ff",
  main: "#50b6ff",
  dark: "#50b6ff",
  darker: "#498dcb",
};
const SUCCESS = {
  lighter: "#e4ffb1",
  light: "#beee04",
  main: "#a8d200",
  dark: "#99be01",
  darker: "#8aae03",
};
const WARNING = {
  lighter: "#fff7cd",
  light: "#ffc884",
  main: "#f5a942",
  dark: "#d39847",
  darker: "#a37644",
};
const ERROR = {
  lighter: "#ffe7d9",
  light: "#ee806c",
  main: "#e6492d",
  dark: "#c5412b",
  darker: "#a23428",
};

const GREY = {
  0: "#FFFFFF",
  100: "#f9fafb",
  200: "#f4f6f8",
  300: "#dfe3e8",
  400: "#c4cdd5",
  500: "#919eab",
  600: "#637381",
  700: "#454f5b",
  800: "#212b36",
  900: "#161c24",
  500_8: alpha("#919EAB", 0.08),
  500_12: alpha("#919EAB", 0.12),
  500_16: alpha("#919EAB", 0.16),
  500_24: alpha("#919EAB", 0.24),
  500_32: alpha("#919EAB", 0.32),
  500_48: alpha("#919EAB", 0.48),
  500_56: alpha("#919EAB", 0.56),
  500_80: alpha("#919EAB", 0.8),
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const CHART_COLORS = {
  violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
  blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
  green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
  yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
  red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  info: { ...INFO, contrastText: "#fff" },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
  error: { ...ERROR, contrastText: "#fff" },
  grey: GREY,
  gradients: GRADIENTS,
  chart: CHART_COLORS,
  divider: GREY[500_24],
  action: {
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  light: {
    ...COMMON,
    mode: "light",
    text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
    background: { paper: "#fff", default: "#fff", neutral: GREY[200] },
    action: { active: GREY[600], ...COMMON.action },
  },
  dark: {
    ...COMMON,
    mode: "dark",
    text: { primary: "#fff", secondary: GREY[500], disabled: GREY[600] },
    background: { paper: GREY[800], default: GREY[900], neutral: GREY[500_16] },
    action: { active: GREY[500], ...COMMON.action },
  },
};

export default palette;
