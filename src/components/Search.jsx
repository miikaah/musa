import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { flatten, get } from "lodash-es"
import fuzzysort from "fuzzysort"
import "./Search.scss"

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

const Search = ({ listing }) => {
  const [query, setQuery] = useState("")
  const [searchArtists, setSearchArtists] = useState([])
  const [searchAlbums, setSearchAlbums] = useState([])
  const [searchSongs, setSearchSongs] = useState([])
  const [artistAlbums, setArtistAlbums] = useState([])
  const [artistSongs, setArtistSongs] = useState([])
  const options = { limit: 12, key: "name", threshold: -50 }

  useEffect(() => {
    const albums = flatten(listing.map(l => l.albums))
    setArtistAlbums(albums)
    setArtistSongs(
      flatten(
        albums.map(a =>
          a.songs.map(s => ({
            name: get(s, "metadata.title", ""),
            path: s.path,
            cover: a.cover
          }))
        )
      )
    )
  }, [listing])

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

  const renderSearchResults = results =>
    results.map((r, i) => <div key={i}>{r.obj.name}</div>)

  return (
    <>
      <h1>Search</h1>
      <div>
        <input value={query} onChange={e => setQuery(e.target.value)} />
        <div className="search-block">
          <h3>Artists</h3>
          {renderSearchResults(searchArtists)}
        </div>
        <div className="search-block">
          <h3>Albums</h3>
          {renderSearchResults(searchAlbums)}
        </div>
        <div className="search-block">
          <h3>Songs</h3>
          {renderSearchResults(searchSongs)}
        </div>
      </div>
    </>
  )
}

export default connect(
  state => ({
    listing: state.library.listing
  }),
  dispatch => ({ dispatch })
)(Search)
