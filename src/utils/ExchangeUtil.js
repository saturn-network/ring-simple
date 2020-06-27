import { BigNumber } from 'bignumber.js'

import { EXCHANGE_CONTRACT_ABI } from '../config'

export function remainingAmount (exchangeContractAddress, orderId) {
  return async function(dispatch, getState) {
    return new Promise(resolve => {

      const web3 = getState().network.web3
      const activeAccountAddress = getState().network.activeAccountAddress

      if (web3 && activeAccountAddress) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)

        exchangeContract.remainingAmount.call(orderId, (error, amount) => {
          if (!error) {
            resolve(Number(amount))
          }
        })
      }
    })
  }
}

export function isOrderActive (exchangeContractAddress, orderId) {
  return async function(dispatch, getState) {
    return new Promise(resolve => {

      const web3 = getState().network.web3
      const activeAccountAddress = getState().network.activeAccountAddress

      if (web3 && activeAccountAddress) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)

        exchangeContract.isOrderActive.call(orderId, (error, result) => {
          if (!error) {
            resolve(result)
          }
        })
      }
    })
  }
}

export function calculateFees (exchangeContractAddress, amount, orderId) {
  return async function(dispatch, getState) {
    return new Promise(resolve => {
      const web3 = getState().network.web3
      const activeAccountAddress = getState().network.activeAccountAddress

      if (web3 && activeAccountAddress) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)

        let amountToWei = web3.toWei(amount.toString())

        exchangeContract.calcFees.call(amountToWei, orderId, (error, result) => {
          if (!error) {
            resolve(Number(result))
          }
        })
      }
    })
  }
}

export function calculateFeesToken (exchangeContractAddress, amount, tokenDecimals, orderId) {
  return async function(dispatch, getState) {
    return new Promise(resolve => {

      const web3 = getState().network.web3
      const activeAccountAddress = getState().network.activeAccountAddress

      if (web3 && activeAccountAddress) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)

        exchangeContract.calcFees.call(amount * 10 ** tokenDecimals, orderId, (error, result) => {
          if (!error) {
            resolve(Number(result))
          }
        })
      }
    })
  }
}

export function getBuyTokenAmount (exchangeContractAddress, amount, orderId) {
  return async function(dispatch, getState) {
    return new Promise(resolve => {
      const web3 = getState().network.web3

      if (web3) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)

        exchangeContract.getBuyTokenAmount.call(amount, orderId, (error, result) => {
          if (!error) {
            resolve(result)
          }
        })
      }
    })
  }
}

export function tradeMiningAmount(exchangeContractAddress, fees, orderId) {
  return async function(dispatch, getState) {
    return new Promise(resolve => {

      const web3 = getState().network.web3
      const activeAccountAddress = getState().network.activeAccountAddress

      if (web3 && activeAccountAddress) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)

        exchangeContract.tradeMiningAmount.call(fees, orderId, (error, result) => {
          if (!error) {

            const miningAmount = new BigNumber(result.toString())
            const decimals = new BigNumber((10**4).toString())

            resolve(miningAmount.div(decimals))
          }
        })
      }
    })
  }
}
