import styled, {
  css as cssImport,
  keyframes as keyframesImport,
  ThemeProvider as ThemeProviderImport,
} from "styled-components/macro";
import isValidProp from "@emotion/is-prop-valid";

// Use this so that props don't passthru to React and the DOM in which case it logs a warning in the console.
// We're doing this because styled-components v6 removed automatic filtering.
export const styledWithPropFilter = (tagName, filterFn) =>
  styled(tagName).withConfig({ shouldForwardProp: filterFn || isValidProp });

export const css = cssImport;
export const keyframes = keyframesImport;
export const ThemeProvider = ThemeProviderImport;

// Use this by default and for HOCs that need to pass props through
export default styled;
