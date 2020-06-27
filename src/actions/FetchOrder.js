export const RESET_ORDER_DETAILS_DATA = 'saturn-api/RESET_ORDER_DETAILS_DATA'
export const UPDATE_ORDER_DETAILS_DATA = 'saturn-api/UPDATE_ORDER_DETAILS_DATA'

export function fetchOrder (networkSymbol, txHash) {
  return async function(dispatch, getState) {
    let orderDetailsData = getState().exchange.selectedOrder

    if (orderDetailsData.data !== undefined) {
      dispatch({
        type: RESET_ORDER_DETAILS_DATA
      })
    }

    fetchSaturnApi(networkSymbol, txHash).then((orderData) => {
      if (orderData) {
        let targetOrderData = { data: orderData, isSync: false }

        dispatch({
          type: UPDATE_ORDER_DETAILS_DATA,
          payload: targetOrderData
        })
      }
    })
  }
}

export async function fetchSaturnApi(networkSymbol, txHash) {
  return await new Promise(resolve => {
    fetch(`https://ticker.saturn.network/api/v2/orders/by_tx/${networkSymbol}/${txHash}.json`)
      .then(function (response) {
        return response.json()
      })
      .then(function (responseData) {
        resolve(responseData)
      })
  })
}
