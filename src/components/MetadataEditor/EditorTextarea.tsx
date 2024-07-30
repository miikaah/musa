import React from "react";

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
  return (
    <textarea
      value={field}
      onChange={(event) => updateValue(event.target.value)}
      disabled={isDisabled}
      rows={4}
    />
  );
};

export default EditorTextarea;
