import React, { useEffect, useState } from 'react'
import './App.css'
import { Switch, Route, useLocation } from 'react-router-dom'
import Hub from './components/Hub'
import Notification from './components/Notification'
import CreateGame from './components/CreateGame'
import PlayGame from './components/PlayGame'

function App() {
  const location = useLocation()
  const [accounts, setAccounts] = useState([])
  const [badMessage, setBadMessage] = useState('')

  async function connectAccounts() {
    if (window.ethereum) {
      const initAccounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccounts(initAccounts)
    }
  }

  useEffect(() => {
    connectAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startOptions = () => {
    if (accounts.length === 0)
      return (
        <div>
          <br></br>
          Please unlock your MetaMask and refresh the page to continue
        </div>
      )
    if (accounts.length > 0)
      return (
        <>
          <Notification badMessage={badMessage} />
          <Switch>
            <Route path="/" exact>
              <Hub accounts={accounts} />
            </Route>
            <Route path="/new" exact>
              <CreateGame
                setBadMessage={setBadMessage}
                accounts={accounts}
              />
            </Route>
            <Route path="/:id" exact>
              <PlayGame setBadMessage={setBadMessage} rpsAddress={location.pathname.substring(1)}/>
            </Route>
          </Switch>
        </>
      )
  }

  return <div className="App">{startOptions()}</div>
}

export default App
