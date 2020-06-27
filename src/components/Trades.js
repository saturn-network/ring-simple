import React, { Component } from 'react'
import Table from './Trades/Table'
import { connect } from 'react-redux'

import { Col } from 'reactstrap'
import { TOKEN_ADDRESS, TOKEN_NETWORK } from '../config'
import { fetchTrades } from '../actions'


class Trades extends Component {
  componentDidMount() {
    this.fetchTrades()
    this.fetchTradesData = setInterval(this.fetchTrades.bind(this), 15000)
  }

  componentWillUnmount() {
    clearInterval(this.fetchTradesData)
  }

  fetchTrades() {
    this.props.fetchTrades(TOKEN_NETWORK, TOKEN_ADDRESS)
  }

  render() {
    let leaderboardEnabled = this.props.leaderboardEnabled
    let tradesData = this.props.trades[`${TOKEN_ADDRESS}`]

    let combinedTradesData = []

    if (tradesData && !tradesData.data.isSync) {
      if (tradesData.data.buys && tradesData.data.buys.length > 0) {
        combinedTradesData = combinedTradesData.concat(tradesData.data.buys)
      }

      if (tradesData.data.sells && tradesData.data.sells.length > 0) {
        combinedTradesData = combinedTradesData.concat(tradesData.data.sells)
      }
    }

    return (
      <Col md='12' lg={leaderboardEnabled ? '9' : '12'}>
        <div className='content-area card card-text-light card-secondary'>
          <div className='card-innr'>
            <div className='card-head'>
                <h4 className='card-title'>Trade History</h4>
            </div>
            { (combinedTradesData.length > 0) && <Table tradesData={combinedTradesData} /> }
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    trades: state.orderBook.trades,
  }
}

const mapActionCreators = {
  fetchTrades
}

export default connect(mapStateToProps, mapActionCreators)(Trades)

