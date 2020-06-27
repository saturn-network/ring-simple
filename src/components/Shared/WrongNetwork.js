import React, {Component} from 'react'
import { TOKEN_NETWORK } from '../../config'

class WrongNetwork extends Component {
  render() {
    return (
      <div>
        <div className='card-head'>
          <span className='card-sub-title text-light font-mid'>Quick Start</span>
          <h4 className='card-title'>Wrong Network</h4>
        </div>

        <div className='card-text'>
          { TOKEN_NETWORK === 'ETH' && <p>Please switch to Ethereum Network in your dApp browser.</p> }
          { TOKEN_NETWORK === 'ETC' && <p>Please switch to Ethereum Classic Network in your dApp browser.</p> }


          { TOKEN_NETWORK === 'ETC' && <div>
            <b>But my dApp browser does not support Ethereum Classic?</b>
            <p>We recommend installing a cross-chain wallet:</p>

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
                <a className='dark-url' href='https://trustwalletapp.com' rel='noopener noreferrer' target='_blank'>
                  <img align='center' className='wallet--logo' alt='Trust Wallet Logo' src='wallets/trust-wallet.png'/>
                  <h3 className='wallet--title'>Trust Wallet</h3>
                </a>
              </div>
             </div>

             <p>If you already use MetaMask then you will be able to import your account into Saturn Wallet or Nifty Wallet immediately with your account’s seed phrase.</p>
            </div> }
        </div>
      </div>
    )
  }
}

export default WrongNetwork
