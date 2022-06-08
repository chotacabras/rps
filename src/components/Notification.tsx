import React from "react"

const Notification = ({ badMessage }:{ badMessage: string}) => {

  if (badMessage !== '')
  return (
    <div className="error">
      {badMessage}
    </div>
  )
  else return null
}

export default Notification