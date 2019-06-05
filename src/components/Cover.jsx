import React, { useRef, useEffect } from "react"
import { connect } from "react-redux"
import { defaultTo, sortBy, some, isEqual } from "lodash-es"
import Palette from "img-palette"
import { Colors } from "../App.jsx"
import "./Cover.scss"

const Cover = ({ coverSrc }) => {
  const cover = useRef()

  const isVibrantCover = mostPopularSwatch => {
    return some(mostPopularSwatch.rgb, value => value > 125)
  }

  const luminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
  }

  const contrast = (rgb1, rgb2) => {
    return (
      (luminance(rgb1[0], rgb1[1], rgb1[2]) + 0.05) /
      (luminance(rgb2[0], rgb2[1], rgb2[2]) + 0.05)
    )
  }

  useEffect(() => {
    cover.current.addEventListener("load", event => {
      const palette = new Palette(event.target)
      const mostPopularSwatch = palette.swatches.find(
        s => s.population === palette.highestPopulation
      )
      const swatchesByPopulationDesc = sortBy(
        palette.swatches,
        s => -s.population
      )

      // Defaults are for dark covers
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
        ]

      // Set different colors for a light cover
      if (isVibrantCover(mostPopularSwatch)) {
        if (contrast(Colors.WhiteRgb, bg.rgb) < 3.4)
          color = Colors.TypographyLight
        primarySwatches = [
          defaultTo(palette.vibrantSwatch, {}),
          defaultTo(palette.lightVibrantSwatch, {})
        ]
        secondarySwatches = [
          defaultTo(palette.lightVibrantSwatch, {}),
          defaultTo(palette.lightMutedSwatch, {})
        ]
      }

      const primaryPop = Math.max.apply(
        Math,
        primarySwatches.map(s => defaultTo(s.population, 0))
      )
      const secondaryPop = Math.max.apply(
        Math,
        secondarySwatches.map(s => defaultTo(s.population, 0))
      )
      // Make sure highlights are different than background
      primary = swatchesByPopulationDesc.find(s => s.population === primaryPop)
      if (!primary || isEqual(primary.rgb, bg.rgb))
        for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
          primary = swatchesByPopulationDesc[i]
          if (!isEqual(primary.rgb, bg.rgb)) break
        }
      if (!primary || isEqual(primary.rgb, bg.rgb))
        primary = { rgb: Colors.PrimaryRgb }

      secondary = swatchesByPopulationDesc.find(
        s => s.population === secondaryPop
      )
      if (!secondary || isEqual(secondary.rgb, bg.rgb))
        for (let i = 1; i < swatchesByPopulationDesc.length; i++) {
          secondary = swatchesByPopulationDesc[i]
          if (
            !isEqual(secondary.rgb, bg.rgb) &&
            !isEqual(secondary.rgb, primary.rgb)
          )
            break
        }
      if (!secondary || isEqual(secondary.rgb, bg.rgb))
        secondary = { rgb: Colors.PrimaryRgb }

      // Set slider highlight to a different color if not enough contrast to slider track
      // or background color
      let slider = primary
      if (
        contrast(slider.rgb, Colors.SliderTrackRgb) < 1.2 ||
        contrast(slider.rgb, bg.rgb) < 1.2
      )
        slider = secondary

      // Switch to dark text for light covers
      if (contrast(Colors.WhiteRgb, primary.rgb) < 2.6)
        primaryColor = Colors.TypographyLight
      if (contrast(Colors.WhiteRgb, secondary.rgb) < 2.6)
        secondaryColor = Colors.TypographyLight

      // Set CSS Variables
      document.body.style.setProperty(
        "--color-bg",
        `rgb(${defaultTo(bg.rgb, Colors.Bg)})`
      )
      document.body.style.setProperty(
        "--color-primary-highlight",
        `rgb(${defaultTo(primary.rgb, Colors.Primary)})`
      )
      document.body.style.setProperty(
        "--color-secondary-highlight",
        `rgb(${defaultTo(secondary.rgb, Colors.Secondary)})`
      )
      document.body.style.setProperty("--color-slider", `rgb(${slider.rgb})`)
      document.body.style.setProperty(
        "--color-typography",
        defaultTo(color, Colors.Typography)
      )
      document.body.style.setProperty(
        "--color-typography-primary",
        defaultTo(primaryColor, Colors.Typography)
      )
      document.body.style.setProperty(
        "--color-typography-secondary",
        defaultTo(secondaryColor, Colors.Typography)
      )
    })
  })

  return (
    <div className="cover-wrapper">
      <img alt="" className="cover" src={coverSrc} ref={cover} />
    </div>
  )
}

export default connect(
  state => ({
    coverSrc: state.player.cover
  }),
  dispatch => ({ dispatch })
)(Cover)