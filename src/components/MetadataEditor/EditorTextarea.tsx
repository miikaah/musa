import React from "react";
import { separator } from "../../util";

type EditorTextareaProps = {
  field: string[];
  index: number;
  isMultiValue: boolean;
  isDisabled: boolean;
  updateValue: (s: string[]) => void;
};

const EditorTextarea = ({
  field,
  index,
  isMultiValue,
  isDisabled,
  updateValue,
}: EditorTextareaProps) => {
  const value = isMultiValue
    ? Array.from(new Set(field)).join(separator)
    : field[index];

  return (
    <textarea
      value={value}
      onChange={(event) => {
        if (typeof updateValue === "function") {
          updateValue(event.target.value.split(separator));
        }
      }}
      disabled={isDisabled}
      rows={4}
    />
  );
};

export default EditorTextarea;
