import React, { Component } from "react";
import { connect } from "react-redux";
import { defaultTo, sortBy, some } from "lodash-es";
import Palette from "img-palette";
import { Colors } from "../App.jsx";
import "./Cover.scss";

class Cover extends Component {
  constructor(props) {
    super(props);
    this.cover = React.createRef();
  }

  componentDidMount() {
    this.cover.current.addEventListener("load", event => {
      const palette = new Palette(event.target);
      const mostPopularSwatch = palette.swatches.find(
        s => s.population === palette.highestPopulation
      );
      const swatchesByPopulationDesc = sortBy(
        palette.swatches,
        s => -s.population
      );
      console.log(palette);
      console.log("isVibrant", this.isVibrantCover(mostPopularSwatch));

      // Defualts are for dark covers
      let bg = mostPopularSwatch,
        primary,
        secondary,
        color = Colors.Typography,
        primaryColor = Colors.Typography,
        secondaryColor = Colors.Typography,
        primarySwatches = [
          defaultTo(palette.vibrantSwatch, {}),
          defaultTo(palette.lightVibrantSwatch, {}),
          defaultTo(palette.lightMutedSwatch, {})
        ],
        secondarySwatches = [
          defaultTo(palette.mutedSwatch, {}),
          defaultTo(palette.darkMutedSwatch, {})
        ];

      // Set different colors for a light cover
      if (this.isVibrantCover(mostPopularSwatch)) {
        console.log(this.contrast([255, 255, 255], bg.rgb) < 3.4);
        if (this.contrast([255, 255, 255], bg.rgb) < 3.4)
          color = Colors.TypographyLight;
        primarySwatches = [
          defaultTo(palette.vibrantSwatch, {}),
          defaultTo(palette.lightVibrantSwatch, {})
        ];
        secondarySwatches = [
          defaultTo(palette.lightVibrantSwatch, {}),
          defaultTo(palette.lightMutedSwatch, {})
        ];
      }

      const primaryPop = Math.max.apply(
        Math,
        primarySwatches.map(s => defaultTo(s.population, 0))
      );
      const secondaryPop = Math.max.apply(
        Math,
        secondarySwatches.map(s => defaultTo(s.population, 0))
      );
      primary = defaultTo(
        swatchesByPopulationDesc.find(s => s.population === primaryPop),
        swatchesByPopulationDesc[1]
      );
      secondary = defaultTo(
        swatchesByPopulationDesc.find(s => s.population === secondaryPop),
        primary
      );
      console.log("ratio: ", this.contrast([255, 255, 255], bg.rgb));
      console.log("ratio: ", this.contrast([255, 255, 255], primary.rgb));
      console.log("ratio: ", this.contrast([255, 255, 255], secondary.rgb));

      if (this.contrast([255, 255, 255], primary.rgb) < 2.6)
        primaryColor = Colors.TypographyLight;
      if (this.contrast([255, 255, 255], secondary.rgb) < 2.6)
        secondaryColor = Colors.TypographyLight;

      // console.log(swatchesByPopulationDesc)
      // console.log(mostPopularSwatch)
      console.log(primary);
      console.log(secondary);
      // Set CSS Variables
      document.body.style.setProperty(
        "--color-bg",
        `rgb(${defaultTo(bg.rgb, Colors.Bg)})`
      );
      document.body.style.setProperty(
        "--color-primary-highlight",
        `rgb(${defaultTo(primary.rgb, Colors.Primary)})`
      );
      document.body.style.setProperty(
        "--color-secondary-highlight",
        `rgb(${defaultTo(secondary.rgb, Colors.Secondary)})`
      );
      document.body.style.setProperty(
        "--color-typography",
        defaultTo(color, Colors.Typography)
      );
      document.body.style.setProperty(
        "--color-typography-primary",
        defaultTo(primaryColor, Colors.Typography)
      );
      document.body.style.setProperty(
        "--color-typography-secondary",
        defaultTo(secondaryColor, Colors.Typography)
      );
    });
  }

  isVibrantCover(mostPopularSwatch) {
    return some(mostPopularSwatch.rgb, value => value > 125);
  }

  contrast(rgb1, rgb2) {
    return (
      (this.luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) /
      (this.luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
    );
  }

  luminance(r, g, b) {
    const a = [r, g, b].map(function(v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  render() {
    return (
      <div className="cover-wrapper">
        <img alt="" className="cover" src={this.props.cover} ref={this.cover} />
      </div>
    );
  }
}

export default connect(
  state => ({
    cover: state.player.cover
  }),
  dispatch => ({ dispatch })
)(Cover);
