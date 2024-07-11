import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled, { css } from "styled-components";
import {
  play,
  replay,
  pause,
  playNext,
  PlayerState,
} from "../../reducers/player.reducer";
import { SettingsState, updateSettings } from "../../reducers/settings.reducer";
import { setVisualizerData } from "../../reducers/visualizer.reducer";
import { store } from "../../store";
import { getReplaygainDb, dispatchToast, getSrc } from "../../util";
import { KEYS, VOLUME_DEFAULT } from "../../config";
import { useKeyPress, useAnimationFrame } from "../../hooks";
import PlayerSeek from "./PlayerSeek";
import PlayerVolume from "./PlayerVolume";
import PlayerCurrentlyPlaying from "./PlayerCurrentlyPlaying";
import PlayerPlayPauseButton from "./PlayerPlayPauseButton";
import PlayerVolumeButton from "./PlayerVolumeButton";
import PlayerTimeDisplay from "./PlayerTimeDisplay";

const sharedCss = css`
  min-height: 54px;
`;

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  width: 100%;
  position: relative;
  ${sharedCss}

  audio {
    display: none;
  }

  ${({ theme }) => theme.breakpoints.down("md")} {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
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

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: unset;
  }
`;

const PlayerRightContainer = styled.div`
  display: flex;
  height: 20px;
`;

const FirEnabledIndicator = styled.div`
  width: 4px;
  height: 4px;
  background: var(--color-primary-highlight);
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: 0;
`;

const VOLUME_MUTED = 0;

const audioContext = new AudioContext();
const preGainNode = audioContext.createGain();
const gainNode = audioContext.createGain();
const convolver = audioContext.createConvolver();
const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 4096;
analyzer.minDecibels = -100;
analyzer.maxDecibels = -1;

preGainNode.connect(analyzer);

const dataArray = new Uint8Array(analyzer.frequencyBinCount);
const peakMeterBuffer = new Float32Array(analyzer.fftSize);

const splitter = audioContext.createChannelSplitter(2);
const analyzerL = audioContext.createAnalyser();
const analyzerR = audioContext.createAnalyser();
analyzerL.fftSize = 4096;
analyzerL.minDecibels = -100;
analyzerL.maxDecibels = -1;
analyzerR.fftSize = 4096;
analyzerR.minDecibels = -100;
analyzerR.maxDecibels = -1;

const dataArrayL = new Uint8Array(analyzerL.frequencyBinCount);
const dataArrayR = new Uint8Array(analyzerR.frequencyBinCount);
const peakMeterBufferL = new Float32Array(analyzer.fftSize);
const peakMeterBufferR = new Float32Array(analyzer.fftSize);

const audioEl = document.createElement("audio");
audioEl.crossOrigin = "anonymous";
let track: MediaElementAudioSourceNode;

type PlayerProps = {
  playlist: PlayerState["items"];
  isPlaying: PlayerState["isPlaying"];
  volume: SettingsState["volume"];
  replaygainType: SettingsState["replaygainType"];
  preAmpDb: SettingsState["preAmpDb"];
  firMakeUpGainDb: SettingsState["firMakeUpGainDb"];
  firFile: SettingsState["firFile"];
  src: PlayerState["src"];
  currentItem: PlayerState["currentItem"];
  dispatch: Dispatch;
};

const Player = ({
  playlist,
  isPlaying,
  volume,
  replaygainType,
  preAmpDb,
  firMakeUpGainDb,
  firFile,
  src,
  currentItem,
  dispatch,
}: PlayerProps) => {
  const [duration, setDuration] = useState(0);
  const [volumeBeforeMuting, setVolumeBeforeMuting] = useState(VOLUME_DEFAULT);
  const [currentTime, setCurrentTime] = useState(0);

  const isMuted = () => volume === VOLUME_MUTED;

  const playOrPause = (event?: Event) => {
    if (event) {
      event.preventDefault();
    }
    // PAUSE
    if (isPlaying || playlist.length < 1) {
      audioEl.pause();
      dispatch(pause());
      setCurrentTime(audioEl.currentTime || 0);
      return;
    }
    // PLAY
    // Have to call resume because of Autoplay Policy. See: https://developer.chrome.com/blog/autoplay/#webaudio
    audioContext.resume();

    if (src) {
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

  const fetchHeadphoneFir = async () => {
    if (!firFile) {
      return;
    }

    try {
      const response = await fetch(`./firs/${firFile}`);
      const arraybuffer = await response.arrayBuffer();
      convolver.buffer = await audioContext.decodeAudioData(arraybuffer);
    } catch (e) {
      console.error(e);
      dispatch(updateSettings({ firFile: "" }));
      dispatchToast(
        "Disabled Impulse response EQ because IR file failed to load",
        `fir-toast-${Date.now()}`,
        dispatch,
      );

      throw e;
    }
  };

  useEffect(() => {
    fetchHeadphoneFir()
      .then(() => {
        if (track) {
          return;
        }
        track = audioContext.createMediaElementSource(audioEl);

        if (firFile) {
          track
            .connect(preGainNode)
            .connect(gainNode)
            .connect(convolver)
            .connect(audioContext.destination);
        } else {
          track
            .connect(preGainNode)
            .connect(gainNode)
            .connect(audioContext.destination);
        }

        track.connect(splitter);
        splitter.connect(analyzerL, 0);
        splitter.connect(analyzerR, 1);
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setVolumeForPlayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preAmpDb, firMakeUpGainDb, firFile]);

  useEffect(() => {
    if (!track) {
      return;
    }

    try {
      if (firFile) {
        fetchHeadphoneFir()
          .then(() => {
            gainNode.disconnect(0);
            gainNode.connect(convolver).connect(audioContext.destination);
          })
          .catch(console.error);
      } else {
        gainNode.disconnect(convolver);
        gainNode.connect(audioContext.destination);
      }

      setVolumeForPlayer();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firFile]);

  useAnimationFrame(() => {
    if (!isPlaying) {
      return;
    }

    analyzer.getByteFrequencyData(dataArray);
    analyzerL.getByteFrequencyData(dataArrayL);
    analyzerR.getByteFrequencyData(dataArrayR);

    analyzer.getFloatTimeDomainData(peakMeterBuffer);
    analyzerL.getFloatTimeDomainData(peakMeterBufferL);
    analyzerR.getFloatTimeDomainData(peakMeterBufferR);

    dispatch(
      setVisualizerData({
        dataArray,
        dataArrayL,
        dataArrayR,
        peakMeterBuffer,
        peakMeterBufferL,
        peakMeterBufferR,
      }),
    );
  });

  const setVolumeForPlayer = (v?: number) => {
    if (!currentItem) {
      return;
    }

    const vol = typeof v === "number" ? v : volume;
    const replaygainDb = getReplaygainDb(replaygainType, currentItem);
    const trackGainPercentage = replaygainDb
      ? // Clamp the max increase so that well produced music doesn't sound too loud compared to other music
        Math.min(
          3,
          // Clamp the max reduction so that badly compressed music doesn't have too little amplitude
          Math.max(0.25, Math.pow(10, replaygainDb / 20)),
        )
      : 1;
    const preAmpPercentage = preAmpDb ? Math.pow(10, preAmpDb / 20) : 1;
    const firMakeUpGainPercentage =
      firFile && firMakeUpGainDb ? Math.pow(10, firMakeUpGainDb / 20) : 1;

    gainNode.gain.value =
      (vol / 100) *
      trackGainPercentage *
      preAmpPercentage *
      firMakeUpGainPercentage;
  };

  const setVolumeForStateAndPlayer = (v: number) => {
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
  useKeyPress(KEYS.m, muteOrUnmute);

  useEffect(() => {
    const handleStoreChange = () => {
      const state = store.getState().player as PlayerState;
      const { replay: shouldReplay, currentItem } = state;

      if (shouldReplay) {
        audioEl.currentTime = 0;
        setCurrentTime(0);

        if (!state.isPlaying) {
          // Double click has a delay in it so run this the next time
          // microtask queue gets emptied
          setTimeout(() => playOrPause());
        } else {
          // Need to fire this on duplicate play
          audioEl.play();
        }
        dispatch(replay(false));
      }

      if (!currentItem) {
        return;
      }

      const { metadata, name } = currentItem;
      if (!metadata) {
        return;
      }

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

    const handleLoadedData = () => {
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
    // HACK: To fix Electron mangling the beginning of the request url
    audioEl.src = getSrc(src ? src.replace("media:/", "media:///") : "");
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
        {firFile && <FirEnabledIndicator />}
        <PlayerVolumeButton volume={volume} muteOrUnmute={muteOrUnmute} />
        <PlayerVolume setVolumeForStateAndPlayer={setVolumeForStateAndPlayer} />
      </PlayerRightContainer>
    </PlayerContainer>
  );
};

export default connect(
  (state: { player: PlayerState; settings: SettingsState }) => ({
    src: state.player.src,
    isPlaying: state.player.isPlaying,
    playlist: state.player.items,
    currentItem: state.player.currentItem,
    volume: state.settings.volume,
    replaygainType: state.settings.replaygainType,
    preAmpDb: state.settings.preAmpDb,
    firMakeUpGainDb: state.settings.firMakeUpGainDb,
    firFile: state.settings.firFile,
  }),
  (dispatch) => ({ dispatch }),
)(React.memo(Player));
