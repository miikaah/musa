import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { setQuery } from "../reducers/library.reducer"
import fuzzysort from "fuzzysort"
import Song from "./Song"
import Album from "./Album"
import Artist from "./Artist"
import "./Search.scss"

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

const Search = ({ listing, query, artistAlbums, artistSongs, dispatch }) => {
  const [searchArtists, setSearchArtists] = useState([])
  const [searchAlbums, setSearchAlbums] = useState([])
  const [searchSongs, setSearchSongs] = useState([])
  const options = { limit: 10, key: "name", threshold: -50 }

  const debouncedQuery = useDebounce(query, 16)

  useEffect(() => {
    const artists = fuzzysort.go(query, listing, options)
    const albums = fuzzysort.go(query, artistAlbums, options)
    const songs = fuzzysort.go(query, artistSongs, options)
    setSearchArtists(artists)
    setSearchAlbums(albums)
    setSearchSongs(songs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const renderSearchResults = (results, type) => {
    switch (type) {
      case "artists": {
        return results.map((r, i) => <Artist key={i} item={r.obj} />)
      }
      case "albums": {
        return results.map((r, i) => <Album key={i} item={r.obj} />)
      }
      case "songs": {
        return results.map((r, i) => <Song key={i} item={r.obj} />)
      }
      default:
        return null
    }
  }

  return (
    <div className="search">
      <h1>Search</h1>
      <div>
        <input
          value={query}
          onChange={e => dispatch(setQuery(e.target.value))}
        />
        <div className="search-block">
          <h2>Artists</h2>
          <div className="search-block-wrapper">
            {renderSearchResults(searchArtists, "artists")}
          </div>
        </div>
        <div className="search-block">
          <h2>Albums</h2>
          <div className="search-block-wrapper">
            {renderSearchResults(searchAlbums, "albums")}
          </div>
        </div>
        <div className="search-block">
          <h2>Songs</h2>
          <div className="search-block-wrapper">
            {renderSearchResults(searchSongs, "songs")}
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    listing: state.library.listing,
    query: state.library.query,
    artistAlbums: state.library.albums,
    artistSongs: state.library.songs
  }),
  dispatch => ({ dispatch })
)(Search)
