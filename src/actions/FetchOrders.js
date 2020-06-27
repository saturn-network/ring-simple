import { ETHER_ADDRESS } from '../config'

export const CONNECT_TOKEN_ORDER_BOOK_DATA = 'saturn-api/CONNECT_TOKEN_ORDER_BOOK_DATA'
export const UPDATE_TOKEN_ORDER_BOOK_DATA = 'saturn-api/UPDATE_TOKEN_ORDER_BOOK_DATA'

export function fetchOrders (networkSymbol, tokenAddress) {
  return async function(dispatch, getState) {
    let orders = getState().orderBook.orders
    let targetTokenOrderBookData = orders[`${tokenAddress}`]

    if (targetTokenOrderBookData === undefined) {
      targetTokenOrderBookData = { data: [], isSync: true}

      dispatch({
        type: CONNECT_TOKEN_ORDER_BOOK_DATA,
        payload: targetTokenOrderBookData,
        id: `${tokenAddress}`
      })
    }

    fetchSaturnApi(networkSymbol, tokenAddress).then((tokenOrderBook) => {
      if (tokenOrderBook !== []) {
         targetTokenOrderBookData = { data: tokenOrderBook, isSync: false }

          dispatch({
            type: UPDATE_TOKEN_ORDER_BOOK_DATA,
            payload: targetTokenOrderBookData,
            id: `${tokenAddress}`
          })
        }
      }
    )
  }
}

export async function fetchSaturnApi(networkSymbol, tokenAddress) {
  return await new Promise(resolve => {
    fetch(`https://ticker.saturn.network/api/v2/orders/${networkSymbol}/${tokenAddress}/${ETHER_ADDRESS}/all.json`)
      .then(function (response) {
        return response.json()
      })
      .then(function (responseData) {
        resolve(responseData)
      })
  })
}
