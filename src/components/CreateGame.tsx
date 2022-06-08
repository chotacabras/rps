/* eslint-disable jsx-a11y/anchor-is-valid */
import { BigNumber } from 'ethers'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { main } from '../ethereum/deployRPS.mjs'

const CreateGame = ({
  setBadMessage,
  accounts,
}: {
  setBadMessage: Dispatch<SetStateAction<string>>
  accounts: any
}) => {
  const [moveString, setMoveString] = useState('')
  const [movePlayerOne, setMovePlayerOne] = useState(0)
  const [stake, setStake] = useState('')
  const [opponentAddress, setOpponentAddress] = useState('')
  const [rpsAddress, setRpsAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('rpsAddress')) {
      setRpsAddress(JSON.parse(localStorage.getItem('rpsAddress') || ''))
    }
  }, [])

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!moveString || !opponentAddress || !stake) {
      setBadMessage('All fields are mandatory! Fill them carefully')
      setTimeout(() => {
        setBadMessage('')
      }, 3000)
      return
    }
    if (stake === '0') {
      setBadMessage('Your bet amount can not be 0')
      setTimeout(() => {
        setBadMessage('')
      }, 3000)
      return
    } else {
      const salt = BigNumber.from(Math.floor(Math.random() * 10000000000000))
      localStorage.setItem('movePlayerOne', JSON.stringify(movePlayerOne))
      localStorage.setItem('salt', JSON.stringify(salt))
      setLoading(true)
      main(
        accounts[0],
        movePlayerOne,
        opponentAddress,
        stake,
        salt,
        setRpsAddress
      )
        .then(() => {
          process.exit?.(0)
        })
        .catch((error) => {
          console.error(error)
          process.exit?.(1)
        })
    }
  }

  const loadingTransaction = () => {
    if (loading) {
      return (
        <div className="loading">
          <br></br>
          <br></br>
          <br></br>
          Opening MetaMask.. Transaction will be processing now... Please wait,
          this may take a minute.
        </div>
      )
    } else return null
  }

  const url = `${window.location.href.replace(
    window.location.pathname,
    ''
  )}/${rpsAddress}`

  const newGameUrl = url.replace('#', '')
  if (rpsAddress) {
    return (
      <div>
        <br></br>
        The match has started! Both players need to open the link below, so
        please send the link to your opponent:
        <br></br>
        <br></br>
        <a href={newGameUrl}>{newGameUrl}</a>
      </div>
    )
  } else
    return (
      <div>
        <br></br>
        <form onSubmit={submit}>
          <div>
            {`1)`} Select a move {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Rock')
                setMovePlayerOne(1)
              }}
            >
              Rock
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Paper')
                setMovePlayerOne(2)
              }}
            >
              Paper
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Scissors')
                setMovePlayerOne(3)
              }}
            >
              Scissors
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Spock')
                setMovePlayerOne(4)
              }}
            >
              Spock
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Lizard')
                setMovePlayerOne(5)
              }}
            >
              Lizard
            </a>{' '}
            {'\u00a0'}
            <br></br>
            <br></br>
            {`2) `}{' '}
            <input
              className="inputNewGame"
              value={opponentAddress}
              onChange={({ target }) => setOpponentAddress(target.value)}
              placeholder="Opponent's address (paste here)"
            />
            <br></br>
            <br></br>
            {`3) `}
            <input
              className="inputNewGame"
              value={stake}
              onChange={({ target }) => setStake(target.value)}
              placeholder="Amount of ETH to stake"
            />
            <br></br>
          </div>
          <br></br>
          <br></br>
          <div>
            <div className="summary">
              <div>
                <strong>Your move: </strong>
                {moveString}
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="summary">
              <div>
                <strong>Your opponent: </strong>
                {opponentAddress}
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="summary">
              <div>
                <strong>Your stake: </strong>
                {stake} ETH{' '}
              </div>
            </div>
            <br></br>
          </div>
          <br></br>

          <div>
            <button type="submit" className="createGameButton">
              Start game
            </button>
          </div>
        </form>
        {loadingTransaction()}
      </div>
    )
}

export default CreateGame
