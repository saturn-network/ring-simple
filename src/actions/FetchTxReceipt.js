export function fetchTxReceiptByTransactionHash (transactionHash, blockchain) {
  return new Promise(resolve => {
    fetch(`https://ticker.saturn.network/api/v2/transactions/${blockchain}/${transactionHash}.json`)
    .then(function (response) {
      return response.json()
    })
    .then(function (responseData) {
      resolve(responseData)
    })
  })
}
