import React, { useState } from "react";
import styled from "styled-components";

type EditorTextareaProps = {
  field: string;
  isDisabled: boolean;
  updateValue: (s: string) => void;
};

const EditorTextarea = ({
  field,
  isDisabled,
  updateValue,
}: EditorTextareaProps) => {
  const [value, setValue] = useState(field || "");

  const update = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <textarea value={value} onChange={update} disabled={isDisabled} rows={4} />
  );
};

export default EditorTextarea;
