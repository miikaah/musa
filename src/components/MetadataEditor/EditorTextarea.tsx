import React from "react";
import { separator } from "../../util";

type EditorTextareaProps = {
  field: string | number | (string | number)[];
  isDisabled: boolean;
  updateValue: (s: string[]) => void;
};

const EditorTextarea = ({
  field,
  isDisabled,
  updateValue,
}: EditorTextareaProps) => {
  const isArray = Array.isArray(field);
  const value = isArray ? field.join(separator) : field;

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
