import {
  CONNECT_TOKEN_ORDER_BOOK_DATA,
  UPDATE_TOKEN_ORDER_BOOK_DATA,
  CONNECT_TOKEN_TRADES_DATA,
  UPDATE_TOKEN_TRADES_DATA,
} from '../actions'

const initialState = {
  orders: {},
  trades: {}
}

export default function(state = initialState, action) {
  switch(action.type) {

  case CONNECT_TOKEN_ORDER_BOOK_DATA:
    return {
      ...state,
      orders: { ...state.orders, [action.id]: action.payload }
    }

  case UPDATE_TOKEN_ORDER_BOOK_DATA:
    return {
      ...state,
      orders: { ...state.orders, [action.id]: action.payload },
    }

  case CONNECT_TOKEN_TRADES_DATA:
    return {
      ...state,
      trades: { ...state.trades, [action.id]: action.payload },
    }

  case UPDATE_TOKEN_TRADES_DATA:
    return {
      ...state,
      trades: { ...state.trades, [action.id]: action.payload },
    }

  default:
    return state;
  }
}
