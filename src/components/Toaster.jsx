import React from "react"
import { connect } from "react-redux"
import "./Toaster.scss"

const Toaster = ({ messages }) => (
  <div className="toaster">
    {Array.from(messages.values()).map((message, i) => (
      <div key={i} className={message.classes.join(" ")}>
        <div className="toast">{message.msg}</div>
      </div>
    ))}
  </div>
)

export default connect(
  state => ({
    messages: state.toaster.messages
  }),
  dispatch => ({ dispatch })
)(Toaster)
