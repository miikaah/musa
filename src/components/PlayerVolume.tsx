import React, { useRef } from "react";
import { connect } from "react-redux";
import ProgressInput from "./ProgressInput";
import { SettingsState } from "../reducers/settings.reducer";

const MAIN_BUTTON_DOWN = 1;

const VOLUME_MUTED = 0;
const VOLUME_STEP = 5;

type PlayerVolumeProps = {
  volume: number;
  setVolumeForStateAndPlayer: (vol: number) => void;
};

const PlayerVolume = ({
  volume,
  setVolumeForStateAndPlayer,
}: PlayerVolumeProps) => {
  const playerVolume = useRef<HTMLDivElement | null>(null);

  const setVolumeByEvent = (vol: number) => {
    setVolumeForStateAndPlayer(vol <= VOLUME_STEP ? VOLUME_MUTED : vol);
  };

  const handleVolumeChange = (e: React.MouseEvent) => {
    if (e.type === "mousemove" && e.buttons !== MAIN_BUTTON_DOWN) {
      return;
    }
    if (!playerVolume.current) {
      return;
    }

    const x = e.clientX;
    const { left, width } = playerVolume.current.getBoundingClientRect();
    const vol = Math.floor(((x - left) / width) * 100);
    setVolumeByEvent(vol);
  };

  const convertVolumeToPercentage = () => {
    return 100 - volume;
  };

  return (
    <ProgressInput
      handleMouseDown={handleVolumeChange}
      handleMouseMove={handleVolumeChange}
      ref={playerVolume}
      progress={convertVolumeToPercentage()}
      width={120}
    />
  );
};

export default connect(
  (state: { settings: SettingsState }) => ({
    volume: state.settings.volume,
  }),
  (dispatch) => ({ dispatch }),
)(PlayerVolume);
