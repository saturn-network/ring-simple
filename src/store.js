import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { reducer as notifications } from 'react-notification-system-redux'

import NetworkReducer from './reducers/NetworkReducer'
import ExchangeReducer from './reducers/ExchangeReducer'
import OrderBookReducer from './reducers/OrderBookReducer'

const reducers = combineReducers({
  network: NetworkReducer,
  exchange: ExchangeReducer,
  orderBook: OrderBookReducer,
  notifications: notifications
})

const store = createStore(
  reducers,
  applyMiddleware(thunk)
)

export default store
