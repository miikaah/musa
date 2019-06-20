import React from "react"
import "./BasePage.scss"

const BasePage = React.forwardRef(({ children, isVisible }, ref) => {
  if (!isVisible) return null
  return (
    <div ref={ref} className="page">
      <div className="page-wrapper">{children}</div>
    </div>
  )
})

export default BasePage
