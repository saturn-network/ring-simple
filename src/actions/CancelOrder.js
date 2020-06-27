import Notifications from 'react-notification-system-redux'
import { EXCHANGE_CONTRACT_ABI } from '../config'

export function cancelOrder (orderContract, orderId) {
    return async function(dispatch, getState) {
      const web3 = getState().network.web3

      if (web3) {
        const exchangeContract = web3.eth.contract(EXCHANGE_CONTRACT_ABI).at(orderContract)
        const activeAccountAddress = getState().network.activeAccountAddress

        const notificationAction = Notifications.show({
          title: 'Cancel Order',
          message: 'Please submit transaction',
          level: 'info',
          position: 'tr',
          autoDismiss: 10,
          dismissible: true
        }, 'info')

        dispatch(notificationAction)

        exchangeContract.cancelOrder.estimateGas(orderId, { from: activeAccountAddress }, function (error, gasAmount) {
          if (gasAmount) {

            exchangeContract.cancelOrder.sendTransaction(orderId, { from: activeAccountAddress, gas: gasAmount }, function(error, transaction) {
              if (transaction) {
                let notificationAction = Notifications.show({
                  title: 'Cancel Order',
                  message: 'Your transaction has been submitted',
                  level: 'success',
                  position: 'tr',
                  autoDismiss: 10,
                  dismissible: true
                }, 'success')

                dispatch(notificationAction)
              }

              if (error) {
                let notificationAction = Notifications.show({
                  title: 'Cancel Order',
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
        })
      }
    }
  }
