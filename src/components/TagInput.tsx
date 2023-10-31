import React, { useState } from "react";

type TagInputProps = {
  field: string | number;
  isDisabled: boolean;
  updateValue?: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const TagInput = ({ field, isDisabled, updateValue }: TagInputProps) => {
  const [value, setValue] = useState(field || "");

  const update = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    if (updateValue) {
      updateValue(event.target.value);
    }
  };

  return <input value={value} onChange={update} disabled={isDisabled} />;
};

export default TagInput;
