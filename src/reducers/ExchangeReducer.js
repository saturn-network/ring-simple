import {
  RESET_ORDER_DETAILS_DATA,
  UPDATE_ORDER_DETAILS_DATA,
  UPDATE_LEADERBOARD_DATA
} from '../actions'

const initialState = {
  selectedOrder: { data: undefined, isSync: true},
  leaderboard: { data: undefined, isSync: true}

}

export default function(state = initialState, action) {
  switch(action.type) {

  case RESET_ORDER_DETAILS_DATA:
    return {
      ...state,
      selectedOrder: initialState.selectedOrder
    }

  case UPDATE_ORDER_DETAILS_DATA:
    return {
      ...state,
      selectedOrder: action.payload
    }

  case UPDATE_LEADERBOARD_DATA:
    return {
      ...state,
      leaderboard: action.payload
    }

  default:
    return state;
  }
}
