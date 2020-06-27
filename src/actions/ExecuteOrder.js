import Notifications from 'react-notification-system-redux'
import * as miscUtil from '../utils/MiscUtil'
import { ETHER_ADDRESS, ERC223_TOKEN_ABI, EXCHANGE_CONTRACT_ABI } from '../config'

export function takeOrderPayload(web3, orderId) {
    return '0x' + miscUtil.makeuint(web3, orderId)
}

export function executeOrder (tokenStandard, exchangeContractAddress, orderId, amount, tokenAddress, tokenName, tokenDecimals) {
  return async function(dispatch, getState) {
    const web3 = getState().network.web3
    const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(exchangeContractAddress)
    const activeAccountAddress = getState().network.activeAccountAddress
    const action = tokenAddress === ETHER_ADDRESS ? 'Buy' : 'Sell'

    if (web3 && exchangeContract && activeAccountAddress) {
      if (tokenAddress !== ETHER_ADDRESS) {
        if (tokenStandard === 'ERC223') {
          let tokenContract = web3.eth.contract(ERC223_TOKEN_ABI).at(tokenAddress)
          let totalAmount = amount * (10 ** tokenDecimals)
          let payload = takeOrderPayload(web3, orderId)

          return new Promise(resolve => {
            tokenContract.transfer.estimateGas(exchangeContract.address,
              totalAmount, payload, { from: activeAccountAddress }, function (error, gasAmount) {
                if (gasAmount) {
                  tokenContract.transfer.sendTransaction(exchangeContract.address,
                    totalAmount, payload, { from: activeAccountAddress, gas: gasAmount },  function(error, transaction) {
                      if (transaction) {
                        let notificationAction = Notifications.show({
                          title: action + ' ' + tokenName,
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
                          title: action + ' ' + tokenName,
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
                }

                if (error) {
                  let notificationAction = Notifications.show({
                    title: action + ' ' + tokenName,
                    message: error.message,
                    level: 'error',
                    position: 'tr',
                    autoDismiss: 10,
                    dismissible: true
                  }, 'error')

                  dispatch(notificationAction)
                }
              })
            })
          } else {
            let totalAmount = amount * (10 ** tokenDecimals)

            if (web3 && exchangeContract && tokenAddress) {
              return new Promise(resolve => {
                exchangeContract.buyOrderWithERC20Token.estimateGas(orderId, tokenAddress, totalAmount, { from: activeAccountAddress }, function(error, gasAmount) {
                  if (gasAmount) {
                    exchangeContract.buyOrderWithERC20Token.sendTransaction(orderId, tokenAddress, totalAmount, { from: activeAccountAddress, gas: gasAmount }, function(error, transaction) {
                      if (transaction) {
                        let notificationAction = Notifications.show({
                          title: action + ' ' + tokenName,
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
                          title: action + ' ' + tokenName,
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

                  if (error) {
                    let notificationAction = Notifications.show({
                      title: action + ' ' + tokenName,
                      message: error.message,
                      level: 'error',
                      position: 'tr',
                      autoDismiss: 10,
                      dismissible: true
                    }, 'error')

                    dispatch(notificationAction)
                  }
                })
              })
            }
          }
        } else {
          if (web3 && exchangeContract) {
            let value = web3.toWei(amount, 'ether')

            if (value) {
              return new Promise(resolve => {
                exchangeContract.buyOrderWithEth.estimateGas(orderId,
                { from: activeAccountAddress, value: value }, function(error, gasAmount) {
                  if (gasAmount) {

                    exchangeContract.buyOrderWithEth.sendTransaction(orderId,
                      { from: activeAccountAddress, value: value, gas: gasAmount }, function(error, transaction) {
                        if (transaction) {
                          let notificationAction = Notifications.show({
                            title: action + ' ' + tokenName,
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
                            title: action + ' ' + tokenName,
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
                  }

                  if (error) {
                    let notificationAction = Notifications.show({
                      title: action + ' ' + tokenName,
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
  }
}
