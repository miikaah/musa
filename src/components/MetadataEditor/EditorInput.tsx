import React from "react";
import { separator } from "../../util";

type StaticProps = {
  staticField: string;
  id?: never;
  field?: never;
  index?: never;
  isMultiValue?: never;
  isDisabled?: never;
  updateValue?: never;
};

type EditorInputProps = {
  staticField?: never;
  id?: string;
  field: string[];
  index: number;
  isMultiValue: boolean;
  isDisabled: boolean;
  updateValue?: (value: string[]) => void;
};

const EditorInput = ({
  staticField,
  id,
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
      id={id}
      value={value}
      onChange={(event) => {
        if (typeof updateValue === "function") {
          updateValue(event.target.value.split(separator));
        }
      }}
      disabled={!!staticField || isDisabled}
    />
  );
};

export default EditorInput;
