import React, {Component} from 'react'

class LoginToWallet extends Component {
  render() {
    return (
      <div>
        <div className='card-head'>
          <span className='card-sub-title text-light font-mid'>Quick Start</span>
          <h4 className='card-title'>How to Start Trading</h4>
        </div>
        <div className='card-text'>
          <p>We have not been able to detect your wallet, make sure you have done the following:</p>
          <p>1. Please login to your preferred dApp browser and connect to the wallet you wish to use.</p>
          <p>2. If you are using <b>MetaMask</b>, you need to approve our website in your settings. If you are not sure how to do this, you can <b><u><a className='dark-url' title='Metamask Approve Connection Guide' target='_blank' href='https://www.saturn.network/blog/metamask-approve-connections-guide' rel='noopener noreferrer'>follow our guide</a></u></b>.</p>
          <p>3. Please ensure only one dApp browser is active. For example, you cannot have <b>MetaMask</b> and <b>Saturn Wallet</b> enabled at the same time on the same browser as they interfere with each other.</p>
        </div>
      </div>
    )
  }
}

export default LoginToWallet
