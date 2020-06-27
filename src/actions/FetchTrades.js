import { ETHER_ADDRESS } from '../config'

export const CONNECT_TOKEN_TRADES_DATA = 'saturn-api/CONNECT_TOKEN_TRADES_DATA'
export const UPDATE_TOKEN_TRADES_DATA = 'saturn-api/UPDATE_TOKEN_TRADES_DATA'

export function fetchTrades (networkSymbol, tokenAddress) {
  return async function(dispatch, getState) {
    let tradesData = getState().orderBook.trades

    let targetTokenTradesData = tradesData[`${tokenAddress}`]

    if (targetTokenTradesData === undefined) {
      targetTokenTradesData = { data: [], isSync: true}

      dispatch({
        type: CONNECT_TOKEN_TRADES_DATA,
        payload: targetTokenTradesData,
        id: `${tokenAddress}`
      })
    }

    fetchSaturnApi(networkSymbol, tokenAddress).then((tokenTrades) => {
      if (tokenTrades !== []) {

      targetTokenTradesData = { data: tokenTrades, isSync: false }

          dispatch({
            type: UPDATE_TOKEN_TRADES_DATA,
            payload: targetTokenTradesData,
            id: `${tokenAddress}`
          })
        }
      }
    )
  }
}

export async function fetchSaturnApi(networkSymbol, tokenAddress) {
  return await new Promise(resolve => {
    fetch(`https://ticker.saturn.network/api/v2/trades/${networkSymbol}/${tokenAddress}/${ETHER_ADDRESS}/100.json`)
      .then(function (response) {
        return response.json()
      })
      .then(function (responseData) {
        resolve(responseData)
      })
  })
}
