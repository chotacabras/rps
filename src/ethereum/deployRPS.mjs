// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import Web3 from 'web3'
import RPS from '../contracts/RPS.sol/RPS.json'
import { utils } from 'ethers'

const web3 = new Web3(window.ethereum)

export async function main(
  fromAccount,
  move,
  opponentAddress,
  stake,
  salt,
  setRpsAddress
) {
  const hash = utils.solidityKeccak256(['uint8', 'uint256'], [move, salt])
  const rps = await deployRPSContract(hash, opponentAddress, fromAccount, stake)
  setRpsAddress(rps._address)
  localStorage.setItem('rpsAddress', JSON.stringify(rps._address))
}

// We get the contract to deploy
const deployRPSContract = (hash, opponentAddress, fromAccount, stake) =>
  new web3.eth.Contract(RPS.abi)
    .deploy({
      arguments: [hash, opponentAddress],
      data: RPS.bytecode,
    })
    .send({ from: fromAccount, value: utils.parseEther(stake) })
