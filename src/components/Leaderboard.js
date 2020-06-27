import React, { Component } from 'react'
import Table from './Leaderboard/Table'
import {connect} from 'react-redux'
import { Col } from 'reactstrap'
import { TOKEN_ADDRESS, TOKEN_NETWORK, TRADING_COMPETITION_START_DATE, TRADING_COMPETITION_END_DATE } from '../config'
import { fetchLeaderboard } from '../actions'

class Leaderboard extends Component {
  componentDidMount() {
    this.fetchLeaderboard()
    this.fetchLeaderboardData = setInterval(this.fetchLeaderboard.bind(this), 15000)
  }

  componentWillUnmount() {
    clearInterval(this.fetchLeaderboardData)
  }

  fetchLeaderboard() {
    this.props.fetchLeaderboard(TOKEN_NETWORK, TOKEN_ADDRESS, TRADING_COMPETITION_START_DATE, TRADING_COMPETITION_END_DATE)
  }

  render() {
    let leaderboard = this.props.leaderboard

    return (
      <Col md='12' lg='3'>
        <div className='content-area card card-text-light card-secondary'>
          <div className='card-innr'>
            <div className='card-head'>
              <h4 className='card-title'>Leaderboard</h4>
            </div>

            { (leaderboard && !leaderboard.isSync) && <Table leaderboardData={leaderboard.data} /> }
          </div>
        </div>
      </Col>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    leaderboard: state.exchange.leaderboard
  }
}

const mapActionCreators = {
  fetchLeaderboard
}

export default connect(mapStateToProps, mapActionCreators)(Leaderboard)
