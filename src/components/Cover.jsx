import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { get, defaultTo, sortBy, some, isEqual } from "lodash-es";
import Palette from "img-palette";
import styled from "styled-components/macro";
import { breakpoint } from "../breakpoints";
import { updateCurrentTheme, doIdbRequest, updateIdb } from "../util";
import { updateSettings } from "reducers/settings.reducer";

const Colors = {
  Bg: "#21252b",
  Primary: "#753597",
  Secondary: "#21737e",
  Typography: "#fbfbfb",
  TypographyLight: "#000",
  TypographyGhost: "#d2d2d2",
  TypographyGhostLight: "#4a4a4a",
  PrimaryRgb: [117, 53, 151],
  SliderTrack: "#424a56",
  SliderTrackRgb: [66, 74, 86],
  WhiteRgb: [255, 255, 255],
};

const marginTop = 12;
const marginBottom = 20;

const Container = styled.div`
  flex: 40%;
`;

const Image = styled.img`
  display: block;
  height: auto;
  width: 100%;
  margin: 0 auto;
  max-height: ${800 + marginTop + marginBottom}px;
  max-width: 800px;

  @media (max-width: ${breakpoint.lg}) {
    max-height: ${600 + marginTop + marginBottom}px;
    max-width: 600px;
  }
`;

const Info = styled.div`
  padding: 20px;

  > div:nth-child(1) {
    padding-bottom: 8px;
  }

  > div:nth-child(2) {
    font-weight: bold;
    padding-bottom: 8px;
    font-size: 30px;
  }

  > div:nth-child(3) {
    font-size: var(--font-size-xs);

    > span:nth-child(2) {
      margin: 0 4px;
    }
  }
`;

const isVibrantCover = (mostPopularSwatch) => {
  return some(mostPopularSwatch.rgb, (value) => value > 125);
};

const luminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const contrast = (rgb1, rgb2) => {
  return (
    (luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) /
    (luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
  );
};

const Cover = ({ coverSrc, defaultTheme, currentItem, dispatch }) => {
  const cover = useRef();

  useEffect(() => {
    const onThemeStoreReqSuccess = (req, db, coverTarget) => {
      return () => {
        const theme = req.result;
        if (theme) {
          updateCurrentTheme(theme.colors);
          dispatch(updateSettings({ currentTheme: theme.colors }));
          return;
        }

        const palette = new Palette(coverTarget);
        const mostPopularSwatch = palette.swatches.find(
          (s) => s.population === palette.highestPopulation
        );
        const swatchesByPopulationDesc = sortBy(
          palette.swatches,
          (s) => -s.population
        );

        // Defaults are for dark covers
        let bg = mostPopularSwatch,
          primary,
          secondary,
          color = Colors.Typography,
          ghostColor = Colors.TypographyGhost,
          primaryColor = Colors.Typography,
          secondaryColor = Colors.Typography,
          primarySwatches = [
            defaultTo(palette.vibrantSwatch, {}),
            defaultTo(palette.lightVibrantSwatch, {}),
            defaultTo(palette.lightMutedSwatch, {}),
          ],
          secondarySwatches = [
            defaultTo(palette.mutedSwatch, {}),
            defaultTo(palette.darkMutedSwatch, {}),
          ];

        // Set different colors for a light cover
        if (isVibrantCover(mostPopularSwatch)) {
          if (contrast(Colors.WhiteRgb, bg.rgb) < 3.4) {
            color = Colors.TypographyLight;
            ghostColor = Colors.TypographyGhostLight;
          }
          primarySwatches = [
            defaultTo(palette.vibrantSwatch, {}),
            defaultTo(palette.lightVibrantSwatch, {}),
          ];
          secondarySwatches = [
            defaultTo(palette.lightVibrantSwatch, {}),
            defaultTo(palette.lightMutedSwatch, {}),
          ];
        }

        const primaryPop = Math.max.apply(
          Math,
          primarySwatches.map((s) => defaultTo(s.population, 0))
        );
        const secondaryPop = Math.max.apply(
          Math,
          secondarySwatches.map((s) => defaultTo(s.population, 0))
        );
        // Make sure highlights are different than background
        primary = swatchesByPopulationDesc.find(
          (s) => s.population === primaryPop
        );
        if (!primary || isEqual(primary.rgb, bg.rgb))
          for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
            primary = swatchesByPopulationDesc[i];
            if (!isEqual(primary.rgb, bg.rgb)) break;
          }
        if (!primary || isEqual(primary.rgb, bg.rgb))
          primary = { rgb: Colors.PrimaryRgb };

        secondary = swatchesByPopulationDesc.find(
          (s) => s.population === secondaryPop
        );
        if (!secondary || isEqual(secondary.rgb, bg.rgb))
          for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
            secondary = swatchesByPopulationDesc[i];
            if (
              !isEqual(secondary.rgb, bg.rgb) &&
              !isEqual(secondary.rgb, primary.rgb)
            )
              break;
          }
        if (!secondary || isEqual(secondary.rgb, bg.rgb))
          secondary = { rgb: Colors.PrimaryRgb };

        // Set slider highlight to a different color if not enough contrast to slider track
        // or background color
        let slider = primary;
        if (
          contrast(slider.rgb, Colors.SliderTrackRgb) < 1.2 ||
          contrast(slider.rgb, bg.rgb) < 1.2
        )
          slider = secondary;

        // Switch to dark text for light covers
        if (contrast(Colors.WhiteRgb, primary.rgb) < 2.6) {
          primaryColor = Colors.TypographyLight;
        }
        if (contrast(Colors.WhiteRgb, secondary.rgb) < 2.6) {
          secondaryColor = Colors.TypographyLight;
        }

        const colors = {
          bg: defaultTo(bg.rgb, Colors.Bg),
          primary: defaultTo(primary.rgb, Colors.Primary),
          secondary: defaultTo(secondary.rgb, Colors.Secondary),
          typography: defaultTo(color, Colors.Typography),
          typographyGhost: defaultTo(ghostColor, Colors.TypographyGhost),
          typographyPrimary: defaultTo(primaryColor, Colors.Typography),
          typographySecondary: defaultTo(secondaryColor, Colors.Typography),
          slider: slider.rgb,
        };

        updateCurrentTheme(colors);
        dispatch(updateSettings({ currentTheme: colors }));

        updateIdb({
          req,
          db,
          osName: "theme",
          key: coverTarget.src,
          props: { colors },
        });
      };
    };

    const onLoadCover = (coverEvent) => {
      // Save to variable here, because the target is set to null in the event
      // variable when it goes out of scope
      const coverTarget = coverEvent.target;
      doIdbRequest({
        method: "get",
        storeName: "theme",
        key: coverEvent.target.src,
        onReqSuccess: (req, db) => onThemeStoreReqSuccess(req, db, coverTarget),
      });
    };

    cover.current.addEventListener("load", onLoadCover);
  }, [dispatch]);

  useEffect(() => {
    if (!coverSrc) {
      updateCurrentTheme(defaultTheme);
    }
  }, [coverSrc, defaultTheme]);

  const artist = get(currentItem, "metadata.artist", "");
  const title = get(currentItem, "metadata.title", currentItem.name);
  const album = get(currentItem, "metadata.album", "");
  const date = get(currentItem, "metadata.year", "");

  return (
    <Container>
      <Image src={coverSrc} ref={cover} />
      <Info>
        <div>{title}</div>
        <div>{album}</div>
        <div>
          <span>{artist}</span>
          {currentItem && currentItem.metadata && (
            <span>{date ? "\u00B7" : ""}</span>
          )}
          <span>{date}</span>
        </div>
      </Info>
    </Container>
  );
};

export default connect(
  (state) => ({
    coverSrc: state.player.cover,
    defaultTheme: state.settings.defaultTheme,
    currentItem: state.player.currentItem,
  }),
  (dispatch) => ({ dispatch })
)(Cover);
