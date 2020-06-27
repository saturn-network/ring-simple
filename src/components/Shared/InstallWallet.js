import React, {Component} from 'react'

class InstallWallet extends Component {
  render() {
    return (
      <div>
        <div className='card-head'>
          <span className='card-sub-title text-light font-mid'>Quick Start</span>
          <h4 className='card-title'>Install dApp Browser</h4>
        </div>
        <div className='card-text'>
          <p>Saturn Network is a decentralized exchange for trading tokens that runs completely on chain and requires you to use a wallet that can browse dApps and sign transactions.</p>

          <p>To trade <b><u>both</u></b> Ethereum and Ethereum Classic tokens:</p>


          <div className='row wallets'>
            <div className='col-lg-4 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid' rel='noopener noreferrer' target='_blank'>
                <img align='center' className='wallet--logo' alt='Nifty Wallet Logo' src='wallets/nifty.png'/>
                <h3 className='wallet--title'>Nifty Wallet</h3>
              </a>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://www.saturn.network/blog/saturn-wallet-user-manual/' target='_blank' rel='noopener noreferrer'>
                <img align='center' className='wallet--logo' alt='Saturn Wallet Logo' src='wallets/saturn-wallet.png'/>
                <h3 className='wallet--title'>Saturn Wallet</h3>
              </a>
            </div>

            <div className='col-lg-4 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://trustwalletapp.com/' rel='noopener noreferrer' target='_blank'>
                <img align='center' className='wallet--logo' alt='Trust Wallet Logo' src='wallets/trust-wallet.png'/>
                <h3 className='wallet--title'>Trust Wallet</h3>
              </a>
            </div>
          </div>

          <p>To <b><u>only</u></b> trade Ethereum tokens:</p>


          <div className='row wallets'>
            <div className='col-lg-6 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://metamask.io/' rel='noopener noreferrer' target='_blank'>
                <img align='center' className='wallet--logo-small' alt='Metamask Wallet Logo' src='wallets/metamask.png'/>
                <h3 className='wallet--title'>MetaMask</h3>
              </a>
            </div>

            <div className='col-lg-6 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://www.cipherbrowser.com/' rel='noopener noreferrer' target='_blank'>
                <img align='center' className='wallet--logo-small' alt='Cipher Wallet Logo' src='wallets/cipher.png'/>
                <h3 className='wallet--title'>Cipher Wallet</h3>
              </a>
            </div>

            <div className='col-lg-6 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://wallet.coinbase.com/' rel='noopener noreferrer' target='_blank'>
                <img align='center' className='wallet--logo-small' alt='Coinbase Wallet Logo' src='wallets/coinbase.png'/>
                <h3 className='wallet--title'>Coinbase Wallet</h3>
              </a>
            </div>

            <div className='col-lg-6 col-md-6 col-sm-12 wallet--item'>
              <a className='dark-url' href='https://enjinwallet.io/' rel='noopener noreferrer' target='_blank'>
                <img align='center' className='wallet--logo-small' alt='Enjin Wallet Logo' src='wallets/enjin.png'/>
                <h3 className='wallet--title'>Enjin Wallet</h3>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default InstallWallet
