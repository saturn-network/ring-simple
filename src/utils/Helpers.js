import { BigNumber } from 'bignumber.js'

export function handleTx (tx) {
  var i = 0, strRep = "", strDes = ""

  strRep = tx.substring(3, tx.length - 3)

  for (i = 3; i > 0; i--)
    strDes += "."

  var resStr = tx.replace(strRep, strDes)

  return resStr
}

export function handleExplorerForTx(blockchain, txHash) {
  if (blockchain === "ETH") {
    return `https://etherscan.io/tx/${txHash}`
  } else if (blockchain === "ETC") {
    return `https://blockscout.com/etc/mainnet/tx/${txHash}`
  }
}

export function handleExplorerForAddress(blockchain, address) {
  if (blockchain === "ETH") {
    return `https://etherscan.io/address/${address}`
  } else if (blockchain === "ETC") {
    return `https://blockscout.com/etc/mainnet/address/${address}`
  }
}

export function handleExplorerForTokenAddress(blockchain, tokenAddress) {
  if (blockchain === "ETH") {
    return `https://etherscan.io/token/${tokenAddress}`
  } else if (blockchain === "ETC") {
    return `https://blockscout.com/etc/mainnet/tokens/${tokenAddress}`
  }
}

export function handleTotalAmount (price, total) {
  const bdPrice = new BigNumber(price)
  const bdTotal = new BigNumber(total)

  return bdTotal.times(bdPrice)
}
