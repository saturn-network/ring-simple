// Token Info
// ===============================================================
export const TOKEN_ADDRESS  = "0xac55641cbb734bdf6510d1bbd62e240c2409040f"
export const TOKEN_NETWORK  = "ETC"
export const TOKEN_NAME     = "Saturn DAO Token"
export const TOKEN_SYMBOL   = "STRN"
export const TOKEN_DECIMALS = 4
export const TOKEN_STANDARD = "ERC223"
export const TOKEN_LOGO     = "token-logo.png"


// Header / Navigation
// ===============================================================
export const NAV_BRAND_LOGO = "logo-nav.png"
export const NAV_BRAND      = "Saturn Network"
export const MAIN_TITLE     = "Instant Swaps and Secure Trading"
export const MAIN_TEXT      = "Saturn Network is a DEX protocol that enables direct wallet to wallet exchanges, powering easy and secure token trading for any Ethereum asset."


// Trading Competition / Leaderboard
// ===============================================================
// Use https://www.unixtimestamp.com/index.php or similar to set up Competition start / end dates
export const TRADING_COMPETITION_ENABLED    = true
export const TRADING_COMPETITION_STRATEGY   = "mined" // bought, sold, mined
export const TRADING_COMPETITION_START_DATE = 1590969600 // June 1
export const TRADING_COMPETITION_END_DATE   = 1596153600 // July 31


// ===============================================================
// DO NOT update constants below unless you know what you're doing
export const BLOCKCHAIN_LOGO            = (TOKEN_NETWORK === "ETH") ? "eth.svg" : "etc.svg"
export const TRADE_MINING_REWARD_LOGO   = (TOKEN_NETWORK === "ETH") ? "rewards/saturn-reward.png" : "rewards/strn-reward.png"
export const TRADE_MINING_REWARD_SYMBOL = (TOKEN_NETWORK === "ETH") ? "SATURN" : "STRN"

export const EXCHANGE_CONTRACT     = (TOKEN_NETWORK === "ETH") ? "0xaA5bBD5A177A588b9F213505cA3740b444Dbd586" : "0x5ef83ab1155786f146c5a00722bef7ab683dc0de"
export const EXCHANGE_CONTRACT_ABI = JSON.parse('[{"constant":false,"inputs":[{"name":"sellToken","type":"address"},{"name":"buyToken","type":"address"},{"name":"amount","type":"uint256"},{"name":"priceMul","type":"uint256"},{"name":"priceDiv","type":"uint256"},{"name":"ring","type":"address"}],"name":"sellERC20TokenWithRing","outputs":[{"name":"orderId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"orderCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newMul","type":"uint256"},{"name":"newDiv","type":"uint256"}],"name":"changeTradeMiningPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderId","type":"uint256"}],"name":"cancelOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"feeMul","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"treasury","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tradeMiningMul","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"amount","type":"uint256"},{"name":"orderId","type":"uint256"}],"name":"calcFees","outputs":[{"name":"fees","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderId","type":"uint256"}],"name":"remainingAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"feeDiv","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderId","type":"uint256"}],"name":"buyOrderWithEth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"fees","type":"uint256"},{"name":"orderId","type":"uint256"}],"name":"tradeMiningAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tradeMiningBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"buyToken","type":"address"},{"name":"priceMul","type":"uint256"},{"name":"priceDiv","type":"uint256"}],"name":"sellEther","outputs":[{"name":"orderId","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"orderId","type":"uint256"},{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"buyOrderWithERC20Token","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderId","type":"uint256"}],"name":"isOrderActive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"buyToken","type":"address"},{"name":"priceMul","type":"uint256"},{"name":"priceDiv","type":"uint256"},{"name":"ring","type":"address"}],"name":"sellEtherWithRing","outputs":[{"name":"orderId","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"sellToken","type":"address"},{"name":"buyToken","type":"address"},{"name":"amount","type":"uint256"},{"name":"priceMul","type":"uint256"},{"name":"priceDiv","type":"uint256"}],"name":"sellERC20Token","outputs":[{"name":"orderId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawTradeMining","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tradeMiningDiv","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"desiredSellTokenAmount","type":"uint256"},{"name":"orderId","type":"uint256"}],"name":"getBuyTokenAmount","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_saturnToken","type":"address"},{"name":"_treasury","type":"address"},{"name":"_feeMul","type":"uint256"},{"name":"_feeDiv","type":"uint256"},{"name":"_tradeMiningMul","type":"uint256"},{"name":"_tradeMiningDiv","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"owner","type":"address"},{"indexed":false,"name":"sellToken","type":"address"},{"indexed":false,"name":"buyToken","type":"address"},{"indexed":false,"name":"ring","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"priceMul","type":"uint256"},{"indexed":false,"name":"priceDiv","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"NewOrder","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"OrderCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"OrderFulfilled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"orderId","type":"uint256"},{"indexed":false,"name":"soldTokens","type":"uint256"},{"indexed":false,"name":"boughtTokens","type":"uint256"},{"indexed":false,"name":"feePaid","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"time","type":"uint256"}],"name":"Mined","type":"event"}]')
export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000"

export const ERC223_TOKEN_ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"_name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"_supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"_decimals","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"_symbol","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"},{"name":"data","type":"bytes"}],"name":"transfer","outputs":[{"name":"ok","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"},{"indexed":false,"name":"_data","type":"bytes"}],"name":"ERC223Transfer","type":"event"}]')
export const ERC20_TOKEN_ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]')
