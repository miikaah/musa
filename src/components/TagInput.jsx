import React, { useState } from "react";

const TagInput = ({ field, isDisabled, updateValue }) => {
  const [value, setValue] = useState(field || "");

  const update = (event) => {
    updateValue(event.target.value);
    setValue(event.target.value);
  };

  return <input value={value} onChange={update} disabled={isDisabled} />;
};

export default TagInput;
