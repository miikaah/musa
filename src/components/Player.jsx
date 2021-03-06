import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { get, isNaN, isEmpty, isNumber } from "lodash-es";
import styled from "styled-components/macro";
import { play, replay, pause, playNext } from "reducers/player.reducer";
import { VOLUME_DEFAULT, updateSettings } from "reducers/settings.reducer";
import { store } from "..";
import { KEYS, getReplaygainDb } from "../util";
import { useKeyPress } from "../hooks";
import PlayerSeek from "./PlayerSeek";
import PlayerVolume from "./PlayerVolume";
import PlayerPlayPauseButton from "./PlayerPlayPauseButton";
import PlayerVolumeButton from "./PlayerVolumeButton";
import PlayerTimeDisplay from "./PlayerTimeDisplay";
import PlayerDrGauge from "./PlayerDrGauge";

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  width: 100%;

  audio {
    display: none;
  }
`;

const PlayerLeftContainer = styled.div`
  display: flex;
  height: 20px;
`;

const PlayerMiddleContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PlayerRightContainer = styled.div`
  margin-top: -4px;
`;

const VOLUME_MUTED = 0;

const Player = ({
  playlist,
  isPlaying,
  volume,
  replaygainType,
  dispatch,
  src,
  currentItem,
}) => {
  const [duration, setDuration] = useState(0);
  const [volumeBeforeMuting, setVolumeBeforeMuting] = useState(VOLUME_DEFAULT);
  const [currentTime, setCurrentTime] = useState(0);

  const player = useRef(null);

  const isMuted = () => volume === VOLUME_MUTED;

  const playOrPause = (event) => {
    if (event) {
      event.preventDefault();
    }
    // PAUSE
    if (isPlaying || isEmpty(playlist)) {
      player.current.pause();
      dispatch(pause());
      setCurrentTime(get(player, "current.currentTime", 0));
      return;
    }
    // PLAY
    if (!isEmpty(src)) {
      // BUGFIX: pause->play starting from beginning
      player.current.currentTime = currentTime;
      player.current.play();
      dispatch(play());
      return;
    }
    // Dispatch first play action
    dispatch(play());
  };
  useKeyPress(KEYS.Space, playOrPause);

  const getVolumeForAudioEl = (volume) => {
    const vol = volume / 100;
    return vol < 0.02 ? VOLUME_MUTED : vol;
  };

  const setVolumeForPlayer = (v) => {
    const vol = isNumber(v) ? v : volume;
    const trackGainPercentage = Math.pow(
      10,
      getReplaygainDb(replaygainType, currentItem) / 20
    );
    const realVolume =
      Math.min(100, Math.max(1, vol * parseFloat(trackGainPercentage))) ||
      VOLUME_DEFAULT;
    player.current.volume = getVolumeForAudioEl(realVolume);
  };

  const setVolumeForStateAndPlayer = (v) => {
    setVolumeForPlayer(v);
    dispatch(updateSettings({ volume: v }));
  };

  const muteOrUnmute = () => {
    // UNMUTE
    if (isMuted()) {
      setVolumeForStateAndPlayer(volumeBeforeMuting);
      return;
    }
    // MUTE
    setVolumeBeforeMuting(volume);
    setVolumeForStateAndPlayer(VOLUME_MUTED);
  };
  useKeyPress(KEYS.M, muteOrUnmute);

  useEffect(() => {
    const handleStoreChange = () => {
      const state = store.getState().player;
      const { replay: shouldReplay, currentItem } = state;

      if (shouldReplay) {
        player.current.currentTime = 0;
        setCurrentTime(0);

        if (!state.isPlaying) {
          // Double click has a delay in it so run this the next time
          // microtask queue gets emptied
          setTimeout(() => playOrPause());
        }
        dispatch(replay(false));
      }

      if (!currentItem || !currentItem.metadata) return;

      document.title = currentItem.metadata.title;
    };
    store.subscribe(handleStoreChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getDuration = () => {
      const duration = get(player, "current.duration", 0);
      return Math.floor(isNaN(duration) ? 0 : duration);
    };

    const handleLoadedData = (event) => {
      setDuration(getDuration());
      player.current.play();
    };
    const dispatchPlayNext = () => dispatch(playNext());

    player.current.addEventListener("loadeddata", handleLoadedData);
    player.current.addEventListener("ended", dispatchPlayNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]);

  useEffect(() => {
    setVolumeForPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, volume, replaygainType, currentItem]);

  return (
    <PlayerContainer>
      <audio controls src={src} ref={player} />
      <PlayerLeftContainer>
        <PlayerVolumeButton volume={volume} muteOrUnmute={muteOrUnmute} />
        <PlayerVolume
          volume={volume}
          setVolumeForStateAndPlayer={setVolumeForStateAndPlayer}
        />
      </PlayerLeftContainer>
      <PlayerMiddleContainer>
        <PlayerPlayPauseButton playOrPause={playOrPause} />
        <PlayerSeek
          player={player}
          duration={duration}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
        />
        <PlayerTimeDisplay
          currentTime={currentTime}
          currentItem={currentItem}
        />
      </PlayerMiddleContainer>
      <PlayerRightContainer>
        <PlayerDrGauge currentItem={currentItem} />
      </PlayerRightContainer>
    </PlayerContainer>
  );
};

export default connect(
  (state) => ({
    src: state.player.src,
    isPlaying: state.player.isPlaying,
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    volume: state.settings.volume,
    replaygainType: state.settings.replaygainType,
  }),
  (dispatch) => ({ dispatch })
)(Player);
