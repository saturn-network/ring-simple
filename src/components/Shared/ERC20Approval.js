import React, {Component} from 'react';
import { handleExplorerForTx, handleExplorerForTokenAddress, handleExplorerForAddress } from '../../utils/Helpers';
import { Dot } from 'react-animated-dots';

import { TOKEN_ADDRESS, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_NETWORK, EXCHANGE_CONTRACT } from '../../config'

class ERC20Approval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      approvalPending: false,
      txHash: '',
    };
  }

  async registerToken(e) {
    e.preventDefault();

    let transactionHash = await this.props.registerToken(EXCHANGE_CONTRACT, TOKEN_ADDRESS)

    if (transactionHash) {
      this.setState( { approvalPending: true, txHash: transactionHash } )
    }
  }

  render () {
    let activeAccountAddress = this.props.activeAccountAddress

    return (
      <div>
        <div className='card-head'>
          <span className='card-sub-title text-light font-mid'>Quick Start</span>
          <h4 className='card-title'>ERC20 Token Approval</h4>
        </div>
        <div className='card-text'>

          { !this.state.approvalPending && <p>Welcome! As this is your first time trading <a className='dark-url' target='_blank' rel='noopener noreferrer' href={handleExplorerForTokenAddress(TOKEN_NETWORK, TOKEN_ADDRESS)}>{TOKEN_NAME} [{TOKEN_SYMBOL}]</a> from <a className='dark-url' target='_blank' rel='noopener noreferrer' href={handleExplorerForAddress(TOKEN_NETWORK, activeAccountAddress)}>this wallet address</a>, you will need to submit an <a className='dark-url' href='https://www.saturn.network/blog/erc20-approve-explained/' target='_blank' rel='noopener noreferrer'>ERC20 Approve</a> transaction before being able to continue.</p> }
          { !this.state.approvalPending && <p>The good news is <b><u>we automatically set the approval to the token’s total supply, which means you will only ever need to do this once</u></b>.</p> }
          { !this.state.approvalPending && <p>Essentially, an <a className='dark-url' href='https://www.saturn.network/blog/erc20-approve-explained/' target='_blank' rel='noopener noreferrer'>ERC20 Token Approval</a> is required to allow you to interact with our exchange’s smart contract that you can create orders or fill existing ones.</p> }
          { this.state.approvalPending && <p><a className='dark-url' href='https://www.saturn.network/blog/erc20-approve-explained/' target='_blank' rel='noopener noreferrer'>ERC20 Token Approve</a> transaction has been submitted and is now <a className='dark-url' href={handleExplorerForTx(TOKEN_NETWORK, this.state.txHash)} target='_blank' rel='noopener noreferrer'>pending</a>. As soon as your transaction is confirmed by the network, you will be able to continue.</p>}

          { !this.state.approvalPending && <div className='buttons-wrapper'>
            <button onClick={(e) => this.registerToken(e)} className='btn btn-success-alt btn-between w-100'><i className='fas fa-unlock icon-margin-right-10'></i> Approve {TOKEN_NAME} [{TOKEN_SYMBOL}]</button>
          </div> }

          { this.state.approvalPending && <div className='buttons-wrapper'>
            <div className='action-button'><a href={handleExplorerForTx(TOKEN_NETWORK, this.state.txHash)} target='_blank' rel='noopener noreferrer' className='btn btn-dark btn-between w-100'><i className='fas fa-search icon-margin-right-10'></i> <span className='responsive-button-label'>This transaction is pending confirmation</span> <Dot>.</Dot><Dot>.</Dot><Dot>.</Dot></a></div>
          </div> }
        </div>
      </div>
    )
  }
}

export default ERC20Approval
