import React, { useState } from "react";

type EditorInputProps = {
  field: string | number;
  isDisabled: boolean;
  updateValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const EditorInput = ({ field, isDisabled, updateValue }: EditorInputProps) => {
  const [value, setValue] = useState(field || "");

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (updateValue) {
      updateValue(event.target.value);
    }
  };

  return <input value={value} onChange={update} disabled={isDisabled} />;
};

export default EditorInput;
