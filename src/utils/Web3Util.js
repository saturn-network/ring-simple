import { Big } from 'big.js'
import { BigNumber } from 'bignumber.js'

Number.prototype.noExponents = function () {
  var data = String(this).split(/[eE]/)
  if (data.length == 1) return data[0]

  var z = "", sign = this < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1

  if (mag < 0) {
    z = sign + "0."
    while (mag++) z += "0"
    return z + str.replace(/^\-/, "")
  }

  mag -= str.length
  while (mag--) z += "0"
  return str + z
}

export function getBlockNumber(web3) {
  return new Promise(resolve => {
    web3.eth.getBlockNumber((error, blockNumber) => {
      resolve(blockNumber)
    })
  })
}

export function getNetworkId(web3) {
  return new Promise((resolve, reject) => {
    resolve(web3.version.network.toString())
  })
}

export function getTimestamp(web3) {
  return new Promise(async resolve => {
    let blockNumber = await getBlockNumber(web3)
    web3.eth.getBlock(blockNumber, function(error, result) {
      if (result) {
        resolve(result.timestamp)
      }
    })
  })
}

export function getAccount(web3) {
  return new Promise(async resolve => {
    web3.eth.getAccounts(function (error, accounts) {
      resolve(accounts[0])
    })
  })
}

export function convertEthereumBalance(web3, ethereumBalance, activeAccountAddress) {
  return web3.fromWei(Number(ethereumBalance[activeAccountAddress]), "ether")
}

export function convertTokenBalance(web3, tokenBalance, activeAccountAddress, tokenAddress, tokenDecimals) {
  let tokenWalletBalance = new Big(Number(tokenBalance[activeAccountAddress]))

  return tokenWalletBalance.div(10 ** tokenDecimals)
}

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
