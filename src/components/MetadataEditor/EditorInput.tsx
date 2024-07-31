import React from "react";
import { separator } from "../../util";

type EditorInputProps = {
  field: string | number | (string | number)[];
  isDisabled: boolean;
  updateValue?: (value: string[]) => void;
};

const EditorInput = ({ field, isDisabled, updateValue }: EditorInputProps) => {
  const isArray = Array.isArray(field);
  const value = isArray ? field.join(separator) : field;

  return (
    <input
      value={value}
      onChange={(event) => {
        if (typeof updateValue === "function") {
          updateValue(event.target.value.split(separator));
        }
      }}
      disabled={isDisabled}
    />
  );
};

export default EditorInput;
