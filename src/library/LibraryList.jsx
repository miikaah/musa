import React, { Component } from "react";
import LibraryItem from "./LibraryItem";
import "./LibraryList.scss";

class LibraryList extends Component {
  state = {
    showFolderItems: false
  };

  render() {
    const item = this.props.item;
    if (Array.isArray(item.children)) {
      return (
        <ul className="library-list">
          <li
            className="library-list-folder"
            key={item.name}
            onClick={this.toggleFolder.bind(this)}
          >
            {item.name}
          </li>
          {this.state.showFolderItems &&
            item.children.map(child => (
              <LibraryList
                key={child.name.toString() + "-" + Date.now()}
                item={child}
              />
            ))}
        </ul>
      );
    }
    return (
      <LibraryItem key={item.name.toString() + "-" + Date.now()} item={item} />
    );
  }

  toggleFolder(event) {
    event.preventDefault();
    this.setState({
      showFolderItems: !this.state.showFolderItems
    });
  }
}

export default LibraryList;
