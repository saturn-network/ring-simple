import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Fenrir from './Fenrir'
import store from './store'

import 'bootstrap/dist/js/bootstrap.bundle.min'
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.scss'

ReactDOM.render(
  <Provider store={store}>
    <Fenrir />
  </Provider>,
  document.getElementById('root')
);

