import { BigNumber } from 'bignumber.js';

// Balances

export function getBalanceInEther(address, web3) {
  return new Promise(resolve => {
    return web3.eth.getBalance(address, function(error, result) {
      if(error) {
        resolve(0)
      }
      else {
        resolve(web3.fromWei(result.toNumber(), "ether"));
      }
    });
  });
}

export function getBalance(address, web3, activeAccountAddress) {
  return new Promise(resolve => {
    let tokenABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]')
    let tokenContract = web3.eth.contract(tokenABI).at(address)

    return tokenContract.balanceOf.call(activeAccountAddress, function (error, value) {
      if (value) {
        resolve(new BigNumber(value))
      }
    })
  })
}

// Standard Detector

export async function isERC223(web3, contractAddress) {
  return new Promise(async resolve => {
    await web3.eth.getCode(contractAddress, function(error, result) {
      if (result) {
        let hash = "be45fd62"
        resolve(result.indexOf(hash.slice(2, hash.length)) > 0)
      }
    })
  })
}

export async function isERC20(web3, contractAddress) {
  return new Promise(async resolve => {
    await web3.eth.getCode(contractAddress, function(error, result) {
      if (result) {
        let hash = "095ea7b3"
        resolve(result.indexOf(hash.slice(2, hash.length)) > 0)
      }
    })
  })
}


// Explorer

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