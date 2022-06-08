/* eslint-disable jsx-a11y/anchor-is-valid */
import { BigNumber, utils } from 'ethers'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Web3 from 'web3'
import RPS from '../contracts/RPS.sol/RPS.json'

const PlayGame = ({
  setBadMessage,
  rpsAddress,
}: {
  rpsAddress: string
  setBadMessage: Dispatch<SetStateAction<string>>
}) => {
  const [accounts, setAccounts] = useState([])
  const [j1, setJ1] = useState('')
  const [j2, setJ2] = useState('')
  const [c2, setC2] = useState(0)
  const [moveString, setMoveString] = useState('')
  const [movePlayerTwo, setMovePlayerTwo] = useState(0)
  const [stake, setStake] = useState('')
  const [j2Played, setJ2Played] = useState(false)
  const [matchFinished, setMatchFinished] = useState(false)
  const [loading, setLoading] = useState(false)

  const web3 = new Web3(window.ethereum)
  const history = useHistory()

  const rpsContract = new web3.eth.Contract(RPS.abi as any, rpsAddress)

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
    rpsContract.methods
      .j1()
      .call()
      .then((result: any) => {
        setJ1(result.toLowerCase())
      })
    rpsContract.methods
      .j2()
      .call()
      .then((result: any) => {
        setJ2(result.toLowerCase())
      })
    rpsContract.methods
      .c2()
      .call()
      .then((result: any) => {
        setC2(Number(result))
      })
    rpsContract.methods
      .stake()
      .call()
      .then((result: any) => {
        setStake(String(result / Math.pow(10, 18)))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c2])

  const j1TimeoutHandler = () => {
    setLoading(true)
    rpsContract.methods
      .j1Timeout()
      .send({ from: j2 })
      .then(() => {
        setLoading(false)
        localStorage.clear()
        history.push('/')
        process.exit?.(0)
      })
      .catch((error: any) => {
        console.error(error)
        process.exit?.(1)
      })
  }

  const j2TimeoutHandler = () => {
    setLoading(true)
    rpsContract.methods
      .j2Timeout()
      .send({ from: j1 })
      .then(() => {
        setLoading(false)
        localStorage.clear()
        history.push('/')
        process.exit?.(0)
      })
      .catch((error: any) => {
        console.error(error)
        process.exit?.(1)
      })
  }

  const solveMatchFunction = (movePlayerOne: Number, salt: BigNumber) => {
    setLoading(true)
    rpsContract.methods
      .solve(movePlayerOne, salt)
      .send({ from: j1 })
      .then(() => {
        setLoading(false)
        setMatchFinished(true)
        process.exit?.(0)
      })
      .catch((error: any) => {
        console.error(error)
        process.exit?.(1)
      })
  }

  const backToMenu = () => {
    localStorage.clear()
    history.push('/')
  }

  const submit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!moveString) {
      setBadMessage('You must choose a move')
      setTimeout(() => {
        setBadMessage('')
      }, 3000)
      return
    } else {
      setLoading(true)
      rpsContract.methods
        .play(movePlayerTwo)
        .send({
          from: j2,
          value: utils.parseEther(stake),
        })
        .then(() => {
          setLoading(false)
          setJ2Played(true)
          process.exit?.(0)
        })
        .catch((error: any) => {
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

  if ((matchFinished || stake === '0') && (accounts[0] === j1 || accounts[0] === j2)) {
    return (
      <>
        <br></br>
        The match has finished! Check if you are the winner on your wallet.
        <br></br>
        <br></br>
        If you have received all the match's stake, you have won. If you have received half the match's stake, it was a tie. If you lost, don't worry, you'll get it next time.
        <br></br>
        <br></br>
        <button onClick={backToMenu} className="createGameButton">
          Back to menu
        </button>
      </>
    )
  }

  if (accounts[0] === j1 && c2 === 0) {
    return (
      <div>
        <br></br>
        You have successfully made your move. If your opponent takes{' '}
        <strong>more than 5 minutes</strong> to make a move, you can get your
        stake back.
        <br></br>
        <br></br>
        The page gets the latest update when you refresh it.{' '}
        <strong>
          Before clicking the button, make sure to refresh the page first.
        </strong>
        <br></br>
        <br></br>
        <button onClick={j2TimeoutHandler} className="createGameButton">
          Request your stake back
        </button>
        {loadingTransaction()}
      </div>
    )
  }

  if (accounts[0] === j1 && c2 !== 0) {
    const movePlayerOne = JSON.parse(
      localStorage.getItem('movePlayerOne') || '{}'
    )
    const salt = JSON.parse(localStorage.getItem('salt') || '{}')
    return (
      <div>
        <br></br>
        Your opponent has made a move too. The match is almost finished. Press
        the button below to continue.
        <br></br>
        <br></br>
        <button
          onClick={() => solveMatchFunction(movePlayerOne, salt)}
          className="createGameButton"
        >
          Solve the match
        </button>
        {loadingTransaction()}
      </div>
    )
  }
  if (accounts[0] === j2 && (c2 !== 0 || j2Played)) {
    return (
      <div>
        <br></br>
        You have successfully made your move. If your opponent takes{' '}
        <strong>more than 5 minutes</strong> to make a move, you can get all the
        stake held inside the contract.
        <br></br>
        <br></br>
        The page gets the latest update when you refresh it.{' '}
        <strong>
          Before clicking the button, make sure to refresh the page first.
        </strong>
        <br></br>
        <br></br>
        <button onClick={j1TimeoutHandler} className="createGameButton">
          Request all the stake
        </button>
        {loadingTransaction()}
      </div>
    )
  }

  if (accounts[0] === j2 && c2 === 0) {
    return (
      <div>
        <br></br>
        You have a pending RPS match! You have been challenged by other player.
        You need to <strong>put {stake} ETH as stake to play</strong> this
        match.
        <br></br>
        <br></br>
        <form onSubmit={submit}>
          <div>
            {`1)`} Select a move {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Rock')
                setMovePlayerTwo(1)
              }}
            >
              Rock
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Paper')
                setMovePlayerTwo(2)
              }}
            >
              Paper
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Scissors')
                setMovePlayerTwo(3)
              }}
            >
              Scissors
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Spock')
                setMovePlayerTwo(4)
              }}
            >
              Spock
            </a>{' '}
            {'\u00a0'}
            <a
              href="#"
              onClick={() => {
                setMoveString('Lizard')
                setMovePlayerTwo(5)
              }}
            >
              Lizard
            </a>{' '}
            {'\u00a0'}
            <br></br>
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
                {j1}
              </div>
            </div>
            <br></br>
            <br></br>
            <div className="summary">
              <div>
                <strong>Stake needed to play: </strong>
                {stake} ETH{' '}
              </div>
            </div>
            <br></br>
          </div>
          <br></br>

          <div>
            <button type="submit" className="createGameButton">
              Play
            </button>
          </div>
        </form>
        {loadingTransaction()}
      </div>
    )
  } else return null
}

export default PlayGame
