import styled from "styled-components";
import isValidProp from "@emotion/is-prop-valid";

// Use this so that props don't passthru to React and the DOM in which case it logs a warning in the console.
// We're doing this because styled-components v6 removed automatic filtering.
export const styledWithPropFilter = (tagName, filterFn) =>
  styled(tagName).withConfig({ shouldForwardProp: filterFn || isValidProp });

export { css, keyframes, ThemeProvider } from "styled-components";

// Use this by default and for HOCs that need to pass props through
export default styled;
