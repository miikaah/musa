import React from "react";
import { connect } from "react-redux";
import ThemeLibrary from "./ThemeLibrary";
import ReplaygainSetting from "./ReplaygainSetting";
import MusicLibrarySetting from "./MusicLibrarySetting";
import Button from "./Button";
import "./Settings.scss";

const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const Settings = ({ isVisible, musicLibraryPaths }) => {
  const runInitialScan = () => {
    ipcRenderer.send("runInitialScan", musicLibraryPaths);
  };

  return (
    <>
      <h1>Settings</h1>
      <div className="settings-block">
        <h3>Library</h3>
        <MusicLibrarySetting />
      </div>
      <div className="settings-block">
        <h3>Theme</h3>
        <ThemeLibrary update={isVisible} />
      </div>
      <div className="settings-block">
        <h3>Replaygain</h3>
        <ReplaygainSetting />
      </div>
      <div className="settings-block">
        <h3>Advanced</h3>
        <Button onClick={runInitialScan} isPrimary>
          Re-run initial scan
        </Button>
      </div>
    </>
  );
};

export default connect(
  state => ({
    musicLibraryPaths: state.settings.musicLibraryPaths
  }),
  dispatch => ({ dispatch })
)(Settings);
