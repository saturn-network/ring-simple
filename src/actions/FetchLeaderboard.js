export const UPDATE_LEADERBOARD_DATA = 'saturn-api/UPDATE_LEADERBOARD_DATA'

export function fetchLeaderboard (networkSymbol, tokenAddress, start, end) {
  return async function(dispatch, getState) {
    fetchSaturnApi(networkSymbol, tokenAddress, start, end).then((leaderboard) => {
      dispatch({
        type: UPDATE_LEADERBOARD_DATA,
        payload: { data: leaderboard, isSync: false }
      })
    })
  }
}

export async function fetchSaturnApi(networkSymbol, tokenAddress, start, end) {
  return await new Promise(resolve => {
    fetch(`https://ticker.saturn.network/api/v2/trades/leaderboard/period/${networkSymbol}/${tokenAddress}/${start}/${end}.json`)
      .then(function (response) {
        return response.json()
      })
      .then(function (responseData) {
        resolve(responseData)
      })
  })
}
