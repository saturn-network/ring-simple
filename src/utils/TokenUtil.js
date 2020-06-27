import { BigNumber } from 'bignumber.js';

export function handleTotalPrice (price, amount) {
  const bdPrice = new BigNumber(price)
  const bdAmount = new BigNumber(amount)

  return bdPrice.times(bdAmount)
}

export function handleTotalAmount (price, total) {
  const bdPrice = new BigNumber(price)
  const bdTotal = new BigNumber(total)

  return bdTotal.div(bdPrice)
}


export function handleTotalPriceAfterFees (price, amount, fees) {
  const bdPrice = new BigNumber(price)
  const bdAmount = new BigNumber(amount)
  const bdFees = new BigNumber(fees)

  return bdPrice.times(bdAmount).minus(bdFees)
}
