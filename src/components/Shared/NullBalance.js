import React, {Component} from 'react'

class NullBalance extends Component {
  render() {
    return (
      <div>
        <div className='card-head'>
          <span className='card-sub-title text-light font-mid'>Quick Start</span>
          <h4 className='card-title'>No Funds Available</h4>
        </div>
        <div className='card-text'>
          <p>Your wallet is set up correctly but your balance is zero. We recommend using <a className='dark-url' href='https://changenow.io/?link_id=d9b89e6132bc40' target='_blank' rel='noopener noreferrer'>Change Now</a> or <a className='dark-url' href='https://changelly.com/?ref_id=ddfe5e06f859' target='_blank' rel='noopener noreferrer'>Changelly</a> if you are planning to trade Ethereum or Ethereum Classic.</p>
        </div>
      </div>
    )
  }
}

export default NullBalance
