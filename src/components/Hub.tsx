import React from 'react'
import { useHistory } from "react-router-dom";

const Hub = ({ accounts }: { accounts: any}) => {
  const history = useHistory()

  const newGameHandler = () => {
    history.push('/new')
  }
  return (
    <div>
      <br></br>
      {`connected!`}
      <br></br>
      <br></br> (You can play RPS in any Ethereum Testnet, even in Mainnet. Make sure to select the network in your Metamask before playing)
      <br></br>
      <br></br>
      wallet: {accounts[0]}
      <br></br>
      <br></br>
      <div className="buttons">
        <div onClick={newGameHandler} className="mainButtons">Create a new RPS game</div>
      </div>
    </div>
  )
}

export default Hub
