import React from "react";
import { separator } from "../../util";

type StaticProps = {
  staticField: string;
  isDisabled: boolean;
  field?: never;
  index?: never;
  isMultiValue?: never;
  updateValue?: never;
};

type EditorInputProps = {
  staticField?: never;
  isDisabled: boolean;
  field: string[];
  index: number;
  isMultiValue: boolean;
  updateValue?: (value: string[]) => void;
};

const EditorInput = ({
  staticField,
  field,
  index,
  isMultiValue,
  isDisabled,
  updateValue,
}: StaticProps | EditorInputProps) => {
  const value = isMultiValue
    ? Array.from(new Set(field)).join(separator)
    : (staticField ?? field[index]);

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
