import React from "react";

type EditorInputProps = {
  field: string | number;
  isDisabled: boolean;
  updateValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const EditorInput = ({ field, isDisabled, updateValue }: EditorInputProps) => {
  return (
    <input
      value={field}
      onChange={(event) => {
        if (typeof updateValue === "function") {
          updateValue(event.target.value);
        }
      }}
      disabled={isDisabled}
    />
  );
};

export default EditorInput;
