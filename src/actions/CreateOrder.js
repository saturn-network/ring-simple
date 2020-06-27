import Notifications from 'react-notification-system-redux'
import * as miscUtil from '../utils/MiscUtil'
import { BigNumber as BigNumberJS } from 'bignumber.js'
import { utils } from 'ethers'
import { BigNumber } from 'ethers/utils'
import padStart from 'lodash/padStart'
import { TOKEN_DECIMALS, EXCHANGE_CONTRACT, EXCHANGE_CONTRACT_ABI, ETHER_ADDRESS, ERC223_TOKEN_ABI, ERC20_TOKEN_ABI } from '../config'

export function createOrderPayload(web3, priceMul, priceDiv, buyToken) {
  let paddedToken = buyToken === '0x0' ? ETHER_ADDRESS : buyToken
  return '0x' + miscUtil.makeuint(web3, priceMul) + miscUtil.makeuint(web3, priceDiv) + paddedToken.substring(2)
}

export function createERC223OrderPayload(priceMul, priceDiv, buytoken) {
  let paddedToken = buytoken === '0x0' ? ETHER_ADDRESS : buytoken
    return '0x' +
      toUint(priceMul.toFixed()) +
      toUint(priceDiv.toFixed()) +
      paddedToken.substring(2)
}

export function toUint(num) {
  return padStart(utils.hexlify(toSuitableBigNumber(num)).substring(2), 64, '0')
}

export function toSuitableBigNumber(n) {
  if (n instanceof BigNumber) { return n }
  if (n instanceof BigNumberJS) {
    return utils.bigNumberify(n.integerValue(BigNumberJS.ROUND_DOWN).toFixed())
  }
  try {
    return utils.bigNumberify(n.valueOf())
  } catch(e) {
    let tmp = utils.bigNumberify(n.toString())
    if (tmp.toString() !== n.toString()) { throw e }
    return tmp
  }
}

export function createOrderErc223 (tradeAmount, pricePerUnit, buyTokenAddress, sellTokenAddress) {
  return async function(dispatch, getState) {
    const web3 = getState().network.web3
    const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(EXCHANGE_CONTRACT)
    const activeAccountAddress = getState().network.activeAccountAddress

    const notificationAction = Notifications.show({
      title: 'Create Order',
      message: 'Please submit transaction',
      level: 'info',
      position: 'tr',
      autoDismiss: 10,
      dismissible: true
    }, 'info')

    dispatch(notificationAction)

    if (sellTokenAddress === ETHER_ADDRESS) {
      let tokenContract = web3.eth.contract(ERC223_TOKEN_ABI).at(buyTokenAddress)

      if (web3 && exchangeContract && activeAccountAddress && tokenContract) {
        let priceMul = new BigNumberJS(pricePerUnit).shiftedBy(18)
        let priceDiv = new BigNumberJS(1).shiftedBy(TOKEN_DECIMALS)

        return new Promise(resolve => {
          exchangeContract.sellEther.sendTransaction(buyTokenAddress,
            Number(toSuitableBigNumber(priceMul)),
            Number(toSuitableBigNumber(priceDiv)), { from: activeAccountAddress, value: web3.toWei(Number(tradeAmount), 'ether') }, function(error, transaction) {
              if (transaction) {
                let notificationAction = Notifications.show({
                  title: 'Create Order',
                  message: 'Your transaction has been submitted',
                  level: 'success',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'success')

                dispatch(notificationAction)
                resolve(transaction)
              }

              if (error) {
                let notificationAction = Notifications.show({
                  title: 'Create Order',
                  message: error.message,
                  level: 'error',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'error')

                dispatch(notificationAction)
              }
            }
          )
        })
      }
    }

    if (buyTokenAddress === ETHER_ADDRESS) {
      let tokenContract = web3.eth.contract(ERC223_TOKEN_ABI).at(sellTokenAddress)

      if (web3 && exchangeContract && activeAccountAddress && tokenContract) {
        let priceDiv = new BigNumberJS(pricePerUnit).shiftedBy(18)
        let priceMul = new BigNumberJS(1).shiftedBy(TOKEN_DECIMALS)

        let payload = createERC223OrderPayload(
          priceMul,
          priceDiv,
          ETHER_ADDRESS
        )

        let tradedAmount = new BigNumberJS(tradeAmount).shiftedBy(TOKEN_DECIMALS)

        return new Promise(resolve => {
          tokenContract.transfer.sendTransaction(exchangeContract.address,
            Number(toSuitableBigNumber(tradedAmount)), payload, { from: activeAccountAddress }, function (error, transaction) {
              if (transaction) {
                let notificationAction = Notifications.show({
                  title: 'Create Order',
                  message: 'Your transaction has been submitted',
                  level: 'success',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'success')

                dispatch(notificationAction)

                resolve(transaction)
              }

              if (error) {
                let notificationAction = Notifications.show({
                  title: 'Create Order',
                  message: error.message,
                  level: 'error',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'error')

                dispatch(notificationAction)
              }
            })
          }
        )
      }
    }
  }
}

export function createOrderErc20(tradeAmount, pricePerUnit, buyTokenAddress, sellTokenAddress) {
  return async function(dispatch, getState) {
    const web3 = getState().network.web3
    const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(EXCHANGE_CONTRACT)
    const activeAccountAddress = getState().network.activeAccountAddress

    const notificationAction = Notifications.show({
      title: 'Create Order',
      message: 'Please submit transaction',
      level: 'info',
      position: 'tr',
      autoDismiss: 10,
      dismissible: true
    }, 'info')

    dispatch(notificationAction)

    if (web3 && sellTokenAddress === ETHER_ADDRESS) {
      let tokenContract = web3.eth.contract(ERC20_TOKEN_ABI).at(buyTokenAddress)

      if (web3 && exchangeContract && activeAccountAddress && tokenContract) {
        let priceMul = new BigNumberJS(pricePerUnit).shiftedBy(18)
        let priceDiv = new BigNumberJS(1).shiftedBy(TOKEN_DECIMALS)

        return new Promise(resolve => {
          exchangeContract.sellEther.sendTransaction(buyTokenAddress,
            Number(toSuitableBigNumber(priceMul)),
            Number(toSuitableBigNumber(priceDiv)),
            { from: activeAccountAddress, value: web3.toWei(Number(tradeAmount), 'ether') }, function(error, transaction) {
              if (transaction) {
                let notificationAction = Notifications.show({
                  title: 'Create Order',
                  message: 'Your transaction has been submitted',
                  level: 'success',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'success')

                dispatch(notificationAction)

                resolve(transaction)
              }

              if (error) {
                let notificationAction = Notifications.show({
                  title: 'Create Order',
                  message: error.message,
                  level: 'error',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'error')

                dispatch(notificationAction)
              }
            }
          )
        })
      }
    }

    if (web3 && buyTokenAddress === ETHER_ADDRESS) {
      let tradedAmount = new BigNumberJS(tradeAmount).shiftedBy(TOKEN_DECIMALS)

      let priceDiv = new BigNumberJS(pricePerUnit).shiftedBy(18)
      let priceMul = new BigNumberJS(1).shiftedBy(TOKEN_DECIMALS)

      return new Promise(resolve => {
        exchangeContract.sellERC20Token.sendTransaction(
          sellTokenAddress,
          ETHER_ADDRESS,
            Number(toSuitableBigNumber(tradedAmount)),
            Number(toSuitableBigNumber(priceMul)),
            Number(toSuitableBigNumber(priceDiv)),
          { from: activeAccountAddress }, function (error, transaction) {
            if (transaction) {
              let notificationAction = Notifications.show({
                title: 'Create Order',
                message: 'Your transaction has been submitted',
                level: 'success',
                position: 'tr',
                autoDismiss: 10,
                dismissible: true
              }, 'success')

              dispatch(notificationAction)

              resolve(transaction)
            }

            if (error) {
              let notificationAction = Notifications.show({
                title: 'Create Order',
                message: error.message,
                level: 'error',
                position: 'tr',
                autoDismiss: 10,
                dismissible: true
              }, 'error')

              dispatch(notificationAction)
            }
          })
        }
      )
    }
  }
}
