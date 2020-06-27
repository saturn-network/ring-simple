import Notifications from 'react-notification-system-redux'
import { ERC20_TOKEN_ABI } from '../config'

export function registerToken (exchangeAddress, tokenAddress) {
  return async function(dispatch, getState) {
    let web3 = getState().network.web3
    let activeAccountAddress = getState().network.activeAccountAddress
    let contract = web3.eth.contract(ERC20_TOKEN_ABI).at(tokenAddress)

    let supply = await new Promise(async resolve => {
      contract.totalSupply.call(function (error, value) {
        if (value) {
          resolve(value)
        }
      })
    })

    const notificationAction = Notifications.show({
      title: 'ERC20 Approval',
      message: 'Please submit transaction',
      level: 'warning',
      position: 'tr',
      autoDismiss: 10,
      dismissible: true
    }, 'warning')

    dispatch(notificationAction)

    if (web3 && activeAccountAddress && supply) {
      return new Promise(resolve => {
        contract.approve.sendTransaction(exchangeAddress, Number(supply).noExponents(), { from: activeAccountAddress }, function(error, transaction) {

          if (transaction) {
            let notificationAction = Notifications.show({
              title: 'ERC20 Approval',
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
              title: 'ERC20 Approval',
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
}

export function checkCoinAllowance (exchangeAddress, tokenAddress) {
  return async function(dispatch, getState) {
    let web3 = getState().network.web3
    let activeAccountAddress = getState().network.activeAccountAddress
    let contract = web3.eth.contract(ERC20_TOKEN_ABI).at(tokenAddress)

    if (activeAccountAddress && web3) {
      let allowanceBalance = await new Promise(async resolve => {
        contract.allowance.call(activeAccountAddress, exchangeAddress, function (error, value) {
          resolve(value.toString())
        })
      })

      return (Number(allowanceBalance) > 0)
    }
  }
}
