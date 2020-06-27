export function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function makeuint(web3, number) {
  let hexnum = web3._extend.utils.toHex(number).substring(2)
  return web3._extend.utils.padLeft(hexnum, 64)
}

export function takeOrderPayload(orderId) {
  return '0x' + makeuint(orderId)
}