import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { SettingsState } from "../../reducers/settings.reducer";
import { TranslateFn } from "../../i18n";
import { EditorMode } from "../../types";

const metadataEditorButttonId = "metadataEditorButttonId";

const Container = styled.div<{ coordinates: ContextMenuCoordinates }>`
  background: white;
  max-width: 200px;
  border-radius: var(--border-radius);
  position: absolute;
  left: ${({ coordinates }) => coordinates.x}px;
  top: ${({ coordinates }) => coordinates.y}px;
  z-index: 2;
`;

const RowButton = styled.button`
  display: block;
  border: 0;
  color: black;
  padding: 8px 20px;
  width: 100%;
  text-align: left;

  &:hover {
    background: #e1e1e1;
    border-radius: var(--border-radius);
  }

  &:first-of-type:hover {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  &:last-of-type:hover {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
  }
`;

export type ContextMenuCoordinates = {
  x: number;
  y: number;
};

type ContextMenuProps = {
  coordinates: ContextMenuCoordinates;
  openEditor: (mode: EditorMode) => void;
  t: TranslateFn;
};

const ContextMenu = ({ coordinates, openEditor, t }: ContextMenuProps) => {
  const onClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    mode: EditorMode,
  ) => {
    event.stopPropagation();
    event.preventDefault();

    openEditor(mode);
  };
  return (
    <Container coordinates={coordinates}>
      <RowButton
        id={metadataEditorButttonId}
        onClick={(event) => onClick(event, "metadata")}
      >
        {t("contextMenu.playlist.metadataEditorButton")}
      </RowButton>
      <RowButton onClick={(event) => onClick(event, "normalization")}>
        {t("contextMenu.playlist.normalizationEditorButton")}
      </RowButton>
    </Container>
  );
};

export default connect((state: { settings: SettingsState }) => ({
  t: state.settings.t,
}))(ContextMenu);
