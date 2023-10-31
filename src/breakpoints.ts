export const breakpoints = {
  sm: 511,
  md: 981,
  lg: 1600,
  xl: 1961,
};

type BreakpointAsString = `${number}px`;

export const breakpointsAsPixels: {
  sm: BreakpointAsString;
  md: BreakpointAsString;
  lg: BreakpointAsString;
  xl: BreakpointAsString;
} = {
  sm: `${breakpoints.sm}px`,
  md: `${breakpoints.md}px`,
  lg: `${breakpoints.lg}px`,
  xl: `${breakpoints.xl}px`,
};
