import React, { useState } from "react"
import { connect } from "react-redux"
import fuzzysort from "fuzzysort"
import "./Settings.scss"

const Search = ({ listing }) => {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const search = () => {
    const results = fuzzysort.go(query, listing, { key: "name" })
    console.log(results)
    setSearchResults(results)
  }

  const renderSearchResults = () =>
    searchResults.map((r, i) => <div key={i}>{r.obj.name}</div>)

  return (
    <>
      <h1>Search</h1>
      <div>
        <input value={query} onChange={e => setQuery(e.target.value)} />
        <button className="btn btn-primary" onClick={search}>
          Search
        </button>
        {renderSearchResults()}
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
