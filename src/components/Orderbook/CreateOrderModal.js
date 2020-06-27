import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateOrderForm from './CreateOrderForm'

import InstallWallet from '../Shared/InstallWallet'
import LoginToWallet from '../Shared/LoginToWallet'
import NullBalance   from '../Shared/NullBalance'
import WrongNetwork  from '../Shared/WrongNetwork'
import ERC20Approval from '../Shared/ERC20Approval'

import { getBalanceInEther, getBalance } from '../../utils/Utils'

import { registerToken,
         checkCoinAllowance,
         createOrderErc223,
         createOrderErc20 } from '../../actions'

import { TOKEN_ADDRESS,
         TOKEN_DECIMALS,
         TOKEN_STANDARD,
         TOKEN_NETWORK,
         EXCHANGE_CONTRACT } from '../../config'

import IosPlanet from 'react-ionicons/lib/IosPlanet'

class CreateOrderModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      etherBalance: null,
      tokenBalance: null,
      erc20ApprovalRequired: false
    }
  }

  componentDidMount() {
    this.fetchAccountBalances = setInterval(this.loadDynamicData.bind(this), 1000)
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

    if (web3 && activeAccountAddress) {
      if (TOKEN_STANDARD === 'ERC20' && EXCHANGE_CONTRACT) {
        let tokenAllowance = await this.props.checkCoinAllowance(EXCHANGE_CONTRACT, TOKEN_ADDRESS)

        if (Number(tokenAllowance) <= 0) {
          this.setState( { erc20ApprovalRequired: true })
        } else {
          this.setState( { erc20ApprovalRequired: false })
        }
      }
    }
  }

  render() {
    let web3                 = this.props.web3
    let activeAccountAddress = this.props.activeAccountAddress
    let isConnected          = this.props.isConnected
    let nullBalance          = (this.state.etherBalance && Number(this.state.etherBalance) === 0)
    let networkName          = this.props.networkName
    let wrongNetwork         = ((networkName === 'mainnet' && TOKEN_NETWORK !== 'ETH') || (networkName === 'classic' && TOKEN_NETWORK !== 'ETC'))

    let tokenBalance = this.state.tokenBalance
    let etherBalance = this.state.etherBalance

    let ordersData = this.props.orders[`${TOKEN_ADDRESS}`]

    let bestBuyPrice = undefined
    let bestSellPrice = undefined

    if (ordersData && !ordersData.data.isSync) {
      if (ordersData.data.buys && ordersData.data.buys.length > 0) {
        bestSellPrice = Math.min.apply(null, ordersData.data.buys.map( (x) => x.price ))
      }

      if (ordersData.data.sells && ordersData.data.sells.length > 0) {
        bestBuyPrice = Math.max.apply(null, ordersData.data.sells.map( (x) => x.price ))
      }
    }

    return (
      <div className='row align-items-center justify-content-center'>
        <div className={'col-lg-12 col-md-12 col-sm-12'}>
          <div className={`content-area card card-secondary card-text-light modal-no-margin`}>
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
                  { (tokenBalance === null || etherBalance === null) && <div className='card__refresh_saturn_dark'><IosPlanet fontSize='66px' color='#fff' beat={true} /></div> }


                  { tokenBalance !== null && etherBalance !== null &&
                    <div>

                      <CreateOrderForm web3={web3}
                                      activeAccountAddress={activeAccountAddress}
                                      etherBalance={etherBalance}
                                      tokenBalance={tokenBalance}
                                      networkName={networkName}
                                      bestSellPrice={bestSellPrice}
                                      bestBuyPrice={bestBuyPrice}
                                      createOrderErc223={this.props.createOrderErc223}
                                      createOrderErc20={this.props.createOrderErc20} />
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
    network: state.network,
    isConnected: state.network.isConnected,
    orders: state.orderBook.orders,
    web3: state.network.web3,
    networkName: state.network.networkName,
    activeAccountAddress: state.network.activeAccountAddress
  }
}

const mapActionCreators = {
  registerToken,
  checkCoinAllowance,
  createOrderErc20,
  createOrderErc223
}

export default connect(mapStateToProps, mapActionCreators)(CreateOrderModal)
