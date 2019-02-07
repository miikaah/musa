import React, { Component } from "react"
import LibraryItem from "./LibraryItem"
import "./LibraryList.scss"

class LibraryList extends Component {
  render() {
    const item = this.props.item
    if (Array.isArray(item.children)) {
      return (
        <ul className="library-list">
        <li key={item.name}>{item.name}</li>
        {
            item.children.map(child => <LibraryList key={child.name.toString() + "-" + Date.now()} item={child} />)
        }
        </ul>
      )
    }
    return (
      <ul className="library-list">{
          <LibraryItem key={item.name.toString() + "-" + Date.now()} item={item} />
      }</ul>
    )
  }
}

export default LibraryList
