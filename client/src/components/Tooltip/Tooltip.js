import React from 'react'
import "./tooltip.css"

const Tooltip = (props) => {
  return (
    <div class="con-tooltip down">
      <div class="tooltip">
        <p>{props.title}</p>
      </div>
    </div>
  )
}

export default Tooltip