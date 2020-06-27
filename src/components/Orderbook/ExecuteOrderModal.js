import React, {Component} from 'react'
import {connect} from 'react-redux'

import ExecuteOrderForm from './ExecuteOrderForm'
import InstallWallet from '../Shared/InstallWallet'
import LoginToWallet from '../Shared/LoginToWallet'
import NullBalance   from '../Shared/NullBalance'
import WrongNetwork  from '../Shared/WrongNetwork'
import ERC20Approval from '../Shared/ERC20Approval'

import IosPlanet from 'react-ionicons/lib/IosPlanet'

import { getBalanceInEther, getBalance } from '../../utils/Web3Util'
import { connectNetwork,
         fetchOrder,
         executeOrder,
         registerToken,
         checkCoinAllowance } from '../../actions'

import { getBuyTokenAmount,
         tradeMiningAmount,
         calculateFees,
         remainingAmount,
         isOrderActive,
         calculateFeesToken } from '../../utils/ExchangeUtil'

import { TOKEN_ADDRESS,
         TOKEN_DECIMALS,
         TOKEN_STANDARD,
         TOKEN_NETWORK,
         EXCHANGE_CONTRACT,
         TOKEN_SYMBOL} from '../../config'

class ExecuteOrderModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      etherBalance: null,
      tokenBalance: null,
      erc20ApprovalRequired: false
    }
  }

  componentDidMount() {
    this.props.fetchOrder(TOKEN_NETWORK, this.props.txHash)
    this.fetchAccountBalances = setInterval(this.loadDynamicData.bind(this), 1000)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.txHash !== this.props.txHash) {
      this.props.fetchOrder(TOKEN_NETWORK, this.props.txHash)
    }
  }

  componentWillUnmount() {
    clearInterval(this.fetchAccountBalances)
  }

  async loadAccountBalance() {
    let activeAccountAddress = this.props.activeAccountAddress
    let web3                 = this.props.web3

    if (web3 && activeAccountAddress) {
      let tokenBalance = await getBalance(TOKEN_ADDRESS, web3, activeAccountAddress)
      let etherBalance = await getBalanceInEther(activeAccountAddress, web3)

      let formattedTokenBalance = tokenBalance.div(10 ** TOKEN_DECIMALS).toFixed(TOKEN_DECIMALS)

      this.setState({ tokenBalance: formattedTokenBalance, etherBalance: etherBalance })
    }
  }

  async loadDynamicData() {
    let web3 = this.props.web3
    let activeAccountAddress = this.props.activeAccountAddress

    if (web3 && activeAccountAddress) {
      await this.setApprovalFlag()
      await this.loadAccountBalance()
    }
  }

  async setApprovalFlag() {
    let web3 = this.props.web3
    let activeAccountAddress = this.props.activeAccountAddress

    let orderData = this.props.selectedOrder

    if (orderData && !orderData.isSync) {
      let orderType = orderData.data.type

      if (web3 && activeAccountAddress) {
        if (TOKEN_STANDARD === 'ERC20' && EXCHANGE_CONTRACT && orderType === 'BUY') {
          let tokenAllowance = await this.props.checkCoinAllowance(EXCHANGE_CONTRACT, TOKEN_ADDRESS)

          if (Number(tokenAllowance) <= 0) {
            this.setState( { erc20ApprovalRequired: true })
          } else {
            this.setState( { erc20ApprovalRequired: false })
          }
        }
      }
    }
  }

  render() {
    let web3                 = this.props.web3
    let isConnected          = this.props.isConnected
    let activeAccountAddress = this.props.activeAccountAddress
    let nullBalance          = (this.state.etherBalance && Number(this.state.etherBalance) === 0)
    let networkName          = this.props.networkName

    let wrongNetwork         = ((networkName === 'mainnet' && TOKEN_NETWORK !== 'ETH') || (networkName === 'classic' && TOKEN_NETWORK !== 'ETC'))

    let tokenBalance = this.state.tokenBalance
    let etherBalance = this.state.etherBalance

    let selectedOrder = this.props.selectedOrder
    let orderStatus

    if (selectedOrder !== undefined && !selectedOrder.isSync) {
      if (selectedOrder.data.active) {
        orderStatus = 'Active'
      } else {
        if (selectedOrder.data.trades.length > 0) {
          orderStatus = 'Fulfilled'
        } else {
          orderStatus = 'Cancelled'
        }
      }
    }

    return (
      <div className='row align-items-center justify-content-center'>
        <div className='col-lg-12 col-md-12 col-sm-12'>
          <div className='card card-secondary card-text-light modal-no-margin'>
            <div className='card-innr'>
              { !web3 && <InstallWallet/> }
              { (web3 && !activeAccountAddress) && <LoginToWallet/> }
              { (web3 && isConnected && activeAccountAddress && nullBalance) && <NullBalance activeAccountAddress={activeAccountAddress}/> }
              { (web3 && isConnected && activeAccountAddress && !nullBalance && wrongNetwork) && <WrongNetwork /> }
              { (web3 && isConnected && activeAccountAddress && !nullBalance && !wrongNetwork &&
                  this.state.erc20ApprovalRequired) &&
                  <ERC20Approval activeAccountAddress={activeAccountAddress}
                                 networkName={networkName}
                                 registerToken={this.props.registerToken} /> }

              { (web3 && isConnected && activeAccountAddress && !nullBalance && !wrongNetwork && !this.state.erc20ApprovalRequired) &&
                <div className='min-height-223'>
                  { (tokenBalance === null || etherBalance === null || !selectedOrder || selectedOrder.isSync) && <div className='card__refresh_saturn_dark'><IosPlanet fontSize='66px' color='#fff' beat={true} /></div> }


                  { tokenBalance !== null && etherBalance !== null &&
                    <div>
                      { selectedOrder && !selectedOrder.isSync && selectedOrder.data.active && <ExecuteOrderForm web3={web3}
                              activeAccountAddress={activeAccountAddress}
                              networkName={networkName}
                              tokenBalance={tokenBalance}
                              etherBalance={etherBalance}
                              selectedOrder={selectedOrder}
                              calculateFees={this.props.calculateFees}
                              remainingAmount={this.props.remainingAmount}
                              tradeMiningAmount={this.props.tradeMiningAmount}
                              getBuyTokenAmount={this.props.getBuyTokenAmount}
                              calculateFeesToken={this.props.calculateFeesToken}
                              executeOrder={this.props.executeOrder} /> }


                      { selectedOrder && !selectedOrder.isSync && !selectedOrder.data.active &&
                        <div className='d-none d-lg-block'>
                          <a href='/' className='btn btn-success btn-xl btn-between w-100'>This order is {orderStatus}, get back to {TOKEN_SYMBOL}/{TOKEN_NETWORK} order book <em className='ti ti-arrow-right'></em></a>
                          <div className='gaps-3x'></div>
                        </div> }

                      { selectedOrder && !selectedOrder.isSync && !selectedOrder.data.active &&
                        <div>
                          <div className='card-head'>
                          <h4 className='card-title'>Trade History</h4>
                          </div>
                        </div> }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    selectedOrder: state.exchange.selectedOrder,
    network: state.network,
    isConnected: state.network.isConnected,
    web3: state.network.web3,
    networkName: state.network.networkName,
    activeAccountAddress: state.network.activeAccountAddress,
  }
}

const mapActionCreators = {
  connectNetwork,
  fetchOrder,
  isOrderActive,
  calculateFees,
  calculateFeesToken,
  remainingAmount,
  tradeMiningAmount,
  getBuyTokenAmount,
  executeOrder,
  registerToken,
  checkCoinAllowance
}

export default connect(mapStateToProps, mapActionCreators)(ExecuteOrderModal)
