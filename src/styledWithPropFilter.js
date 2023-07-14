import styled, { css as cssImport } from "styled-components/macro";
import isValidProp from "@emotion/is-prop-valid";

// Use this for most use cases so that props don't passthru to React in which case it logs a warning in the console.
// We're doing this because styled-components v6 removed automatic filtering.
export const styledWithPropFilter = (tagName, filterFn) =>
  styled(tagName).withConfig({ shouldForwardProp: filterFn || isValidProp });

export const css = cssImport;

// Use this for HOCs that need to pass props through
export default styled;
