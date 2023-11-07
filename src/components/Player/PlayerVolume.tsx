import React, { useRef } from "react";
import { connect } from "react-redux";
import ProgressInput from "../ProgressInput";
import { SettingsState } from "../../reducers/settings.reducer";
import { MAIN_BUTTON_DOWN, VOLUME_MUTED, VOLUME_STEP } from "../../config";

type PlayerVolumeProps = {
  volume: number;
  setVolumeForStateAndPlayer: (vol: number) => void;
};

const PlayerVolume = ({
  volume,
  setVolumeForStateAndPlayer,
}: PlayerVolumeProps) => {
  const playerVolumeRef = useRef<HTMLDivElement | null>(null);

  const setVolumeByEvent = (vol: number) => {
    setVolumeForStateAndPlayer(vol <= VOLUME_STEP ? VOLUME_MUTED : vol);
  };

  const handleVolumeChange = (e: React.MouseEvent) => {
    if (e.type === "mousemove" && e.buttons !== MAIN_BUTTON_DOWN) {
      return;
    }
    if (!playerVolumeRef.current) {
      return;
    }

    const x = e.clientX;
    const { left, width } = playerVolumeRef.current.getBoundingClientRect();
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
      ref={playerVolumeRef}
      progress={convertVolumeToPercentage()}
      width={120}
    />
  );
};

export default connect((state: { settings: SettingsState }) => ({
  volume: state.settings.volume,
}))(PlayerVolume);
