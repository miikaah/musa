import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import defaultTo from "lodash.defaultto";
import sortBy from "lodash.sortby";
import isEqual from "lodash.isequal";
import Palette from "../img-palette/img-palette";
import styled from "styled-components/macro";
import { down } from "styled-breakpoints";
import { updateCurrentTheme } from "../util";
import { breakpoints } from "../breakpoints";
import { updateSettings } from "reducers/settings.reducer";
import { setCoverData } from "reducers/player.reducer";
import CoverInfo from "./CoverInfo";
import ThemeBlock from "./ThemeBlock";
import { rgb2hsl, hsl2rgb } from "colors";
import Api from "api-client";

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
  RedRgb: [255, 0, 0],
};

const Container = styled.div`
  width: 100%;
  max-width: 1010px;
  min-width: ${({ isSmall }) => (isSmall ? "var(--library-width)" : "1010px")};
  flex: 1 0 47vw;
  display: flex;
  justify-content: flex-end;

  ${down("md")} {
    min-width: unset;
    flex: 1 0 60vw;
    justify-content: flex-start;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: var(--library-width);
  max-width: var(--library-width);
  max-height: var(--library-width);

  ${down("md")} {
    min-width: 96vw;
    max-width: 96vw;
    max-height: unset;
    margin: 1.3vw auto;
  }
`;

const Image = styled.img.attrs(
  ({ maxHeight, isCoverLoaded, src, scaleDownImage, isMobile }) => ({
    style: {
      maxHeight: `${maxHeight}px`,
      objectFit: isMobile || scaleDownImage ? "scale-down" : "cover",
      transition: isCoverLoaded && "max-height 0.3s",
      visibility: isCoverLoaded && src ? "visible" : "hidden",
    },
  })
)`
  width: 100%;
  height: 100%;
  flex: 1 0 auto;
`;

const Theme = styled(ThemeBlock)`
  position: absolute;
  top: 10px;
  right: 10px;
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
  const lum1 = luminance(...rgb1) + 0.05;
  const lum2 = luminance(...rgb2) + 0.05;

  return lum1 / lum2;
};

const canvas = document.createElement("canvas");
const canvasCtx = canvas.getContext("2d");

const Cover = ({ currentItem, coverData, currentTheme, dispatch }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoints.md);
  const [isSmall, setIsSmall] = useState(
    window.innerWidth < breakpoints.lg && window.innerWidth >= breakpoints.md
  );
  const [editTarget, setEditTarget] = useState();
  const [isEditing, setIsEditing] = useState();
  const containerRef = useRef();
  const coverRef = useRef();

  const calcMaxHeight = () => {
    const libraryWidth = Number(
      window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--library-width")
        .replace("px", "")
    );

    let heightToWidthRatio =
      coverRef.current.naturalHeight / coverRef.current.naturalWidth;

    if (heightToWidthRatio > 0.949) {
      heightToWidthRatio = 1;
    }

    return heightToWidthRatio < 1
      ? heightToWidthRatio * libraryWidth
      : libraryWidth;
  };

  const calculateTheme = (coverTarget, options) => {
    let palette = new Palette(coverTarget);
    let mostPopularSwatch = palette.swatches.find(
      (s) => s.population === palette.highestPopulation
    );

    // If didn't get some swatches try again
    if (!palette.vibrantSwatch || !palette.lightVibrantSwatch) {
      palette = new Palette(coverTarget);
      mostPopularSwatch = palette.swatches.find(
        (s) => s.population === palette.highestPopulation
      );
    }

    const swatchesByPopulationDesc = sortBy(
      palette.swatches,
      (s) => -s.population
    );

    // Defaults are for dark covers
    let bg = options?.bg || mostPopularSwatch;
    let primary;
    let secondary;
    let color = Colors.Typography;
    let ghostColor = Colors.TypographyGhost;
    let primaryColor = Colors.Typography;
    let secondaryColor = Colors.Typography;
    let primarySwatches = [
      defaultTo(palette.vibrantSwatch, {}),
      defaultTo(palette.lightVibrantSwatch, {}),
      defaultTo(palette.lightMutedSwatch, {}),
    ];
    let secondarySwatches = [
      defaultTo(palette.mutedSwatch, {}),
      defaultTo(palette.darkMutedSwatch, {}),
    ];

    // Set different colors for a light cover
    if (isVibrantCover(bg)) {
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

    // Make sure highlights are different than background

    const primaryPop = Math.max.apply(
      Math,
      primarySwatches.map((s) => defaultTo(s.population, 0))
    );
    primary = swatchesByPopulationDesc.find((s) => s.population === primaryPop);

    if (!primary || isEqual(primary.rgb, bg.rgb)) {
      for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
        primary = swatchesByPopulationDesc[i];

        if (!isEqual(primary.rgb, bg.rgb)) {
          break;
        }
      }
    }

    if (!primary || isEqual(primary.rgb, bg.rgb)) {
      primary = { rgb: Colors.PrimaryRgb };
    }

    const contrastBgPr = contrast(bg.rgb, primary.rgb);
    if (Math.abs(1 - contrastBgPr) < 0.05) {
      primary = { rgb: Colors.PrimaryRgb };
    }

    secondary = swatchesByPopulationDesc.find(
      (s) => s.population === secondaryPop
    );

    const secondaryPop = Math.max.apply(
      Math,
      secondarySwatches.map((s) => defaultTo(s.population, 0))
    );

    if (!secondary || isEqual(secondary.rgb, bg.rgb)) {
      for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
        secondary = swatchesByPopulationDesc[i];

        if (
          !isEqual(secondary.rgb, bg.rgb) &&
          !isEqual(secondary.rgb, primary.rgb)
        ) {
          break;
        }
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
    if (contrast(primary.rgb, Colors.SliderTrackRgb) < 1.2) {
      const [h, s] = rgb2hsl(...slider.rgb);
      const [, , l] = rgb2hsl(...Colors.SliderTrackRgb);
      const rgb = hsl2rgb(h / 360, s, l + 0.5);

      slider = { rgb };
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
      primary: defaultTo(primary.rgb, Colors.PrimaryRgb),
      secondary: defaultTo(secondary.rgb, Colors.SecondaryRgb),
      typography: defaultTo(color, Colors.Typography),
      typographyGhost: defaultTo(ghostColor, Colors.TypographyGhost),
      typographyPrimary: defaultTo(primaryColor, Colors.Typography),
      typographySecondary: defaultTo(secondaryColor, Colors.Typography),
      slider: slider.rgb,
    };

    updateCurrentTheme(colors);

    return colors;
  };

  useEffect(() => {
    const onLoadCover = async (event) => {
      // Save to variable here, because the target is set to null in the event
      // variable when it goes out of scope
      const coverTarget = event.target;
      const { naturalWidth, naturalHeight } = coverTarget;
      const aspectRatio = naturalWidth / naturalHeight;

      dispatch(
        setCoverData({
          isCoverLoaded: true,
          scaleDownImage: aspectRatio < 0.9,
          maxHeight: calcMaxHeight(),
        })
      );

      const theme = await Api.getThemeById({ id: coverTarget.src });

      if (theme?.colors) {
        updateCurrentTheme(theme.colors);
        dispatch(updateSettings({ currentTheme: theme }));
        return;
      }

      const colors = calculateTheme(coverTarget);

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

    const ref = coverRef.current;

    ref.addEventListener("load", onLoadCover);

    return () => {
      ref.removeEventListener("load", onLoadCover);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (
        window.innerWidth < breakpoints.lg &&
        window.innerWidth >= breakpoints.md
      ) {
        setIsSmall(true);
        setIsMobile(false);
      } else if (window.innerWidth < breakpoints.md) {
        setIsSmall(false);
        setIsMobile(true);
      } else {
        setIsSmall(false);
        setIsMobile(false);
      }

      if (!coverRef.current) {
        return;
      }
      const { naturalWidth, naturalHeight } = coverRef.current;
      const aspectRatio = naturalWidth / naturalHeight;

      dispatch(
        setCoverData({
          isCoverLoaded: true,
          scaleDownImage: aspectRatio < 0.9,
          maxHeight: calcMaxHeight(),
        })
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!coverData.isCoverLoaded && !currentItem.coverUrl && coverRef.current) {
    dispatch(
      setCoverData({
        isCoverLoaded: true,
        scaleDownImage: false,
        maxHeight: calcMaxHeight(),
      })
    );
  }

  const getColorFromImage = (event) => {
    if (!isEditing) {
      return;
    }
    const img = document.getElementById("albumCover");
    const { width, height } = event.target;

    canvas.width = width;
    canvas.height = height;

    canvasCtx.drawImage(img, 0, 0, width, height);

    const [r, g, b] = canvasCtx.getImageData(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
      1,
      1
    ).data;
    const rgb = [r, g, b];
    const { colors: c } = currentTheme;

    let colors;
    switch (editTarget) {
      case "bg": {
        // Background color is used to calculate text colors
        colors = calculateTheme(img, { bg: { rgb } });
        colors.bg = rgb;
        colors.primary = c.primary;
        colors.secondary = c.secondary;
        colors.slider = c.primary;
        break;
      }
      case "primary": {
        // Background color is used to calculate text colors
        colors = calculateTheme(img, { bg: { rgb: c.bg } });
        colors.bg = c.bg;
        colors.primary = rgb;
        colors.secondary = c.secondary;
        colors.slider = rgb;
        break;
      }
      case "secondary": {
        // Background color is used to calculate text colors
        colors = calculateTheme(img, { bg: { rgb: c.bg } });
        colors.bg = c.bg;
        colors.primary = c.primary;
        colors.secondary = rgb;
        colors.slider = c.primary;
        break;
      }
      default: {
        // Background color is used to calculate text colors
        colors = calculateTheme(img, { bg: { rgb: c.bg } });
      }
    }

    // Switch to dark text for light covers
    let primaryColor;
    if (contrast(Colors.WhiteRgb, colors.primary) < 2.6) {
      primaryColor = Colors.TypographyLight;
    }
    let secondaryColor;
    if (contrast(Colors.WhiteRgb, colors.secondary) < 2.6) {
      secondaryColor = Colors.TypographyLight;
    }

    colors.typographyPrimary = defaultTo(primaryColor, Colors.Typography);
    colors.typographySecondary = defaultTo(secondaryColor, Colors.Typography);

    updateCurrentTheme(colors);

    Api.updateTheme({ id: img.src, colors }).then((theme) => {
      dispatch(
        updateSettings({
          currentTheme: theme,
        })
      );
    });
  };

  const setEditTargetOrHide = (target) => {
    setEditTarget(target);

    if (!target) {
      setIsEditing(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditTarget("");
  };

  return (
    <Container ref={containerRef} isSmall={isSmall}>
      <Wrapper>
        {React.useMemo(() => {
          return (
            <>
              <Image
                id="albumCover"
                src={currentItem.coverUrl}
                ref={coverRef}
                crossOrigin=""
                maxHeight={coverData.maxHeight}
                scaleDownImage={coverData.scaleDownImage}
                isCoverLoaded={coverData.isCoverLoaded}
                isMobile={isMobile}
                onClick={getColorFromImage}
              />
              {isEditing && (
                <Theme
                  theme={currentTheme}
                  isThemeEditor
                  editTarget={editTarget}
                  setEditTarget={setEditTargetOrHide}
                />
              )}
            </>
          );
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
          currentItem.coverUrl,
          coverData,
          currentTheme,
          editTarget,
          isEditing,
          isMobile,
        ])}
        <CoverInfo
          item={currentItem}
          isSmall={isSmall}
          toggleEdit={toggleEdit}
        />
      </Wrapper>
    </Container>
  );
};

export default connect(
  (state) => ({
    currentItem: state.player.currentItem,
    coverData: state.player.coverData,
    currentTheme: state.settings.currentTheme,
  }),
  (dispatch) => ({ dispatch })
)(Cover);
