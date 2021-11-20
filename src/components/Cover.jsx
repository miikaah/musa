import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import defaultTo from "lodash.defaultto";
import sortBy from "lodash.sortby";
import isEqual from "lodash.isequal";
import Palette from "img-palette";
import styled from "styled-components/macro";
import { updateCurrentTheme } from "../util";
import { breakpoint } from "../breakpoints";
import { updateSettings } from "reducers/settings.reducer";
import Api from "api-client";
import { fadeIn } from "animations";
import CoverInfo from "./CoverInfo";

const Colors = {
  Bg: "#21252b",
  Primary: "#753597",
  Secondary: "#21737e",
  Typography: "#fbfbfb",
  TypographyLight: "#000",
  TypographyGhost: "#d2d2d2",
  TypographyGhostLight: "#4a4a4a",
  PrimaryRgb: [117, 53, 151],
  SecondaryRgb: [33, 115, 126],
  SliderTrack: "#424a56",
  SliderTrackRgb: [66, 74, 86],
  WhiteRgb: [255, 255, 255],
};

const Container = styled.div`
  flex: 40%;
  margin-left: ${({ isSmall }) => (isSmall ? "0" : "500")}px;

  @media (min-width: ${breakpoint.lg}px) {
    flex: 49.2%;
    min-height: 30vw;
  }

  @media (min-width: ${breakpoint.lg + 350}px) {
    flex: 49%;
    min-height: 30vw;
  }
`;

const Image = styled.img`
  display: block;
  height: auto;
  margin: 0 auto;
  width: 100%;
  animation: ${fadeIn} 0.1666s;

  @media (max-width: ${breakpoint.md + 219}px) {
    min-height: 41vw;
  }

  @media (min-width: ${breakpoint.md + 219}px) {
    min-height: 41vw;
  }

  @media (min-width: ${breakpoint.lg}px) {
    min-height: 32vw;
  }

  @media (min-width: ${breakpoint.lg + 350}px) {
    min-height: 35vw;
  }
`;

const isVibrantCover = (mostPopularSwatch) => {
  return mostPopularSwatch.rgb.some((value) => value > 125);
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

const Cover = ({ coverSrc, currentItem, dispatch }) => {
  const [isSmall, setIsSmall] = useState(window.innerWidth < breakpoint.lg);
  const coverRef = useRef();

  useEffect(() => {
    const calculateTheme = (coverTarget) => {
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

          if (!isEqual(primary.rgb, bg.rgb)) {
            break;
          }
        }
      if (!primary || isEqual(primary.rgb, bg.rgb)) {
        primary = { rgb: Colors.PrimaryRgb };
      }
      const contrastBgPr = contrast(bg.rgb, primary.rgb);
      if (Math.abs(1 - contrastBgPr) < 0.1) {
        primary = { rgb: Colors.PrimaryRgb };
      }

      secondary = swatchesByPopulationDesc.find(
        (s) => s.population === secondaryPop
      );
      if (!secondary || isEqual(secondary.rgb, bg.rgb))
        for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
          secondary = swatchesByPopulationDesc[i];

          if (
            !isEqual(secondary.rgb, bg.rgb) &&
            !isEqual(secondary.rgb, primary.rgb)
          ) {
            break;
          }
        }
      if (!secondary || isEqual(secondary.rgb, bg.rgb)) {
        secondary = { rgb: Colors.SecondaryRgb };
      }
      const contrastBgSe = contrast(bg.rgb, secondary.rgb);
      if (Math.abs(1 - contrastBgSe) < 0.1) {
        secondary = { rgb: Colors.SecondaryRgb };
      }

      // Set slider highlight to a different color if not enough contrast to slider track
      // or background color
      let slider = primary;
      if (
        contrast(slider.rgb, Colors.SliderTrackRgb) < 1.2 ||
        contrast(slider.rgb, bg.rgb) < 1.2
      ) {
        slider = secondary;
      }

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

      if (coverTarget.src && colors) {
        Api.insertTheme({ id: coverTarget.src, colors }).then((theme) => {
          dispatch(
            updateSettings({
              currentTheme: theme,
            })
          );
        });
      }
    };

    const onLoadCover = async (event) => {
      // Save to variable here, because the target is set to null in the event
      // variable when it goes out of scope
      const coverTarget = event.target;

      const theme = await Api.getThemeById({ id: coverTarget.src });

      if (theme?.colors) {
        updateCurrentTheme(theme.colors);
        dispatch(updateSettings({ currentTheme: theme }));
        return;
      }

      calculateTheme(coverTarget);
    };

    coverRef.current.addEventListener("load", onLoadCover);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSmall(window.innerWidth < breakpoint.lg);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container isSmall={isSmall}>
      <Image src={coverSrc} ref={coverRef} crossOrigin="" />
      <CoverInfo item={currentItem} isSmall={isSmall} />
    </Container>
  );
};

export default connect(
  (state) => ({
    coverSrc: state.player.cover,
    currentItem: state.player.currentItem,
  }),
  (dispatch) => ({ dispatch })
)(Cover);
