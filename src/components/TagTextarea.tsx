import React, { useState } from "react";
import styled from "styled-components";

const Textarea = styled.textarea`
  resize: none;
`;

const TagTextarea = ({ field, isDisabled, updateValue }) => {
  const [value, setValue] = useState(field || "");

  const update = (event) => {
    updateValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <Textarea value={value} onChange={update} disabled={isDisabled} rows={4} />
  );
};

export default TagTextarea;
