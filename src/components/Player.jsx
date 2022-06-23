import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash.isempty";
import styled, { css } from "styled-components/macro";
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
import PlayerCurrentlyPlaying from "./PlayerCurrentlyPlaying";

const sharedCss = css`
  min-height: 54px;
`;

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  width: 100%;
  ${sharedCss}

  audio {
    display: none;
  }
`;

const PlayerLeftContainer = styled.div`
  display: flex;
  min-width: 340px;
  max-width: 340px;
  ${sharedCss}
`;

const PlayerMiddleContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 378px;
`;

const PlayerRightContainer = styled.div`
  display: flex;
  height: 20px;
`;

const VOLUME_MUTED = 0;

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

const audioEl = document.createElement("audio");
audioEl.crossOrigin = "anonymous";

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

  const isMuted = () => volume === VOLUME_MUTED;

  const playOrPause = (event) => {
    if (event) {
      event.preventDefault();
    }
    // PAUSE
    if (isPlaying || isEmpty(playlist)) {
      audioEl.pause();
      dispatch(pause());
      setCurrentTime(audioEl.currentTime || 0);
      return;
    }
    // PLAY
    // Have to call resume because of Autoplay Policy. See: https://developer.chrome.com/blog/autoplay/#webaudio
    audioContext.resume();

    if (!isEmpty(src)) {
      // BUGFIX: pause->play starting from beginning
      audioEl.currentTime = currentTime;
      audioEl.play();
      dispatch(play());
      return;
    }
    // Dispatch first play action
    dispatch(play());
  };
  useKeyPress(KEYS.Space, playOrPause);

  useEffect(() => {
    const track = audioContext.createMediaElementSource(audioEl);

    track.connect(gainNode).connect(audioContext.destination);

    return () => {
      audioContext.close();
    };
  }, []);

  const setVolumeForPlayer = (v) => {
    const vol = typeof v === "number" ? v : volume;
    const trackGainPercentage =
      // Clamp the max increase so that well produced music doesn't sound too loud compared to other music
      Math.min(
        3,
        // Clamp the max reduction so that badly compressed music doesn't have too little amplitude
        Math.max(
          0.25,
          Math.pow(10, getReplaygainDb(replaygainType, currentItem) / 20)
        )
      ) || 1; // getReplaygainDb() might return 0 so turn that into 1 so that volume doesn't accidentally go to zero
    console.log(
      "vol",
      vol / 100,
      trackGainPercentage,
      (vol / 100) * trackGainPercentage
    );
    gainNode.gain.value = (vol / 100) * trackGainPercentage;
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
        audioEl.currentTime = 0;
        setCurrentTime(0);

        if (!state.isPlaying) {
          // Double click has a delay in it so run this the next time
          // microtask queue gets emptied
          setTimeout(() => playOrPause());
        }
        dispatch(replay(false));
      }

      const { metadata, name } = currentItem;
      if (!currentItem || !metadata) return;

      document.title = metadata.title || name || "Musa";
    };
    store.subscribe(handleStoreChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getDuration = () => {
      const duration = audioEl.duration || 0;
      return Math.floor(Number.isNaN(duration) ? 0 : duration);
    };

    const handleLoadedData = (event) => {
      setDuration(getDuration());

      audioContext.resume();
      audioEl.play();
    };
    const dispatchPlayNext = () => {
      dispatch(playNext());
    };

    audioEl.addEventListener("loadeddata", handleLoadedData);
    audioEl.addEventListener("ended", dispatchPlayNext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setVolumeForPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, volume, replaygainType, currentItem]);

  useEffect(() => {
    audioEl.currentTime = 0;
    setCurrentTime(0);
  }, [currentItem]);

  useEffect(() => {
    audioEl.src = src;
  }, [src]);

  return (
    <PlayerContainer>
      <PlayerLeftContainer>
        <PlayerCurrentlyPlaying currentItem={currentItem} />
      </PlayerLeftContainer>
      <PlayerMiddleContainer>
        <PlayerPlayPauseButton playOrPause={playOrPause} />
        <PlayerSeek
          player={audioEl}
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
        <PlayerVolumeButton volume={volume} muteOrUnmute={muteOrUnmute} />
        <PlayerVolume
          volume={volume}
          setVolumeForStateAndPlayer={setVolumeForStateAndPlayer}
        />
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
