import React, { useState } from "react";
import styled from "styled-components";

const Textarea = styled.textarea`
  resize: none;
`;

type TagTextareaProps = {
  field: string;
  isDisabled: boolean;
  updateValue: (s: string) => void;
};

const TagTextarea = ({ field, isDisabled, updateValue }: TagTextareaProps) => {
  const [value, setValue] = useState(field || "");

  const update = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <Textarea value={value} onChange={update} disabled={isDisabled} rows={4} />
  );
};

export default TagTextarea;
