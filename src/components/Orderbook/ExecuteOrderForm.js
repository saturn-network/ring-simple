import React, {Component} from 'react'
import { InputGroup } from 'reactstrap'
import NumberFormat from 'react-number-format'
import { debounce } from 'debounce'
import { handleTotalPrice, handleTotalPriceAfterFees, handleTotalAmount } from '../../utils/TokenUtil'
import { handleExplorerForTx } from '../../utils/Helpers'
import { fetchTxReceiptByTransactionHash } from '../../actions/FetchTxReceipt'

import { Dot } from 'react-animated-dots'
import IosPlanet from 'react-ionicons/lib/IosPlanet'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons'

import { BLOCKCHAIN_LOGO, TOKEN_STANDARD, TOKEN_DECIMALS, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_ADDRESS, TOKEN_LOGO, TOKEN_NETWORK, ETHER_ADDRESS } from '../../config'

var numbro = require('numbro')

class OrderForm extends Component {
  constructor() {
    super()

    this.state = {
      buyToken: null,
      sellToken: null,
      orderAmount: null,
      totalAmount: null,
      etherAmount: null,
      totalFees: null,
      tradeMining: null,
      orderBalanceError: '',
      walletBalanceError: '',
      etherInputActive: false,
      tokenInputActive: false,
      transactionHash: '',
      orderType: '',
      orderBlockchain: '',
      txReceipt: '',
      tokenAllowance: 0,
      tokenSupply: 0,
      remainingAmountBalance: null
    }

    this.handleAmountChange = debounce(this.handleAmountChange, 600)
    this.signTransaction = this.signTransaction.bind(this)
    this.calculateEthereumPrefill = this.calculateEthereumPrefill.bind(this)
  }

  async calculateEthereumPrefill (percentage) {
    let data            = this.props.selectedOrder.data
    let orderType       = data.type
    let orderBalance    = data.balance

    if (orderType === 'BUY') {
      let tokenBalance = this.props.tokenBalance

      let desiredTokenAmount

      if (percentage === 90) {
        desiredTokenAmount = tokenBalance
      } else {
        desiredTokenAmount = tokenBalance / 100 * percentage
      }

      if (desiredTokenAmount > Number(orderBalance)) {
        await this.handleAmountChange(orderBalance)
      } else {
        await this.handleAmountChange(desiredTokenAmount)
      }
    } else {
      let availableInEther = await handleTotalPrice(numbro(data.price).value(), orderBalance)
      let desiredEtherAmount = this.props.etherBalance / 100 * percentage

      if (desiredEtherAmount > availableInEther) {
        await this.handleAmountChange(availableInEther)
      } else {
        await this.handleAmountChange(desiredEtherAmount)
      }
    }
  }

  async signTransaction () {
    let web3 = this.props.web3

    if (web3) {
      let data                 = this.props.selectedOrder.data
      let orderType            = data.type

      if (orderType === 'BUY') {
        this.executeTransaction(this.state.orderAmount,
          this.state.totalAmount,
          TOKEN_ADDRESS,
          TOKEN_NAME,
          TOKEN_DECIMALS)
      } else {
        this.executeTransaction(this.state.orderAmount,
          this.state.totalAmount,
          ETHER_ADDRESS,
          TOKEN_NAME,
          18)
      }
    }
  }

  async loadTransactionData() {
    if (this.state.transactionHash !== '') {
      let data            = this.props.selectedOrder.data
      let orderBlockchain = data.blockchain

      let txReceipt = await fetchTxReceiptByTransactionHash(this.state.transactionHash, orderBlockchain)

      if (txReceipt && txReceipt !== this.state.txReceipt) {
        this.setState({ txReceipt: txReceipt })
      }
    }
  }

  async executeTransaction(orderAmount, totalAmount, buyTokenAddress, buyTokenName, buyTokenDecimals) {
    let web3 = this.props.web3

    if (web3) {
      let data                 = this.props.selectedOrder.data
      let orderType            = data.type
      let orderId              = data.order_id
      let orderContract        = data.contract

      let orderAmount = this.state.orderAmount
      let totalAmount = this.state.totalAmount

      let transactionHash

      if (orderType === 'BUY') {
        transactionHash = await this.props.executeOrder(TOKEN_STANDARD, orderContract, orderId, orderAmount, buyTokenAddress, buyTokenName, buyTokenDecimals)
      } else {
        transactionHash = await this.props.executeOrder(TOKEN_STANDARD, orderContract, orderId, totalAmount, buyTokenAddress, buyTokenName, buyTokenDecimals)
      }

      if (transactionHash) {
        this.setState({ transactionHash: transactionHash, orderAmount: orderAmount, totalAmount: totalAmount })
      }
    }
  }

  async handleAmountChange (amountValue) {
    if (amountValue) {
      let enteredAmount = numbro(amountValue).value()

      if (enteredAmount !== 0) {
        let fees
        let feesFromWei
        let tradeMining
        let totalAmount
        let totalFromWei
        let orderAmount

        let web3                = this.props.web3
        let data                = this.props.selectedOrder.data
        let orderType           = data.type
        let orderContract       = data.contract
        let orderId             = data.order_id
        let orderBlockchain     = data.blockchain
        let pricePerUnit        = numbro(data.price).value()

        if (this.state.buyToken && this.state.buyToken.address === ETHER_ADDRESS) {

          if (orderType === 'SELL') {
            orderAmount = await handleTotalAmount(pricePerUnit, enteredAmount)
            fees = await this.props.calculateFees(orderContract, enteredAmount, orderId)

            if (fees) { tradeMining = await this.props.tradeMiningAmount(orderContract, fees, orderId) }

            let desiredAmount = orderAmount * (10 ** TOKEN_DECIMALS)
            let totalAmountToBuy = await this.props.getBuyTokenAmount(orderContract, desiredAmount, orderId)

            if (totalAmountToBuy) {
              let totalAmountToBuyString = totalAmountToBuy.toString()

              feesFromWei  = await web3.fromWei(fees, 'ether')
              totalFromWei = await web3.fromWei(totalAmountToBuyString, 'ether')

              await this.setState({ orderAmount: Number(orderAmount).noExponents(),
                                    etherAmount: Number(enteredAmount).noExponents(),
                                    totalFees:   Number(feesFromWei).noExponents(),
                                    tradeMining: Number(tradeMining).noExponents(),
                                    orderType:       orderType,
                                    orderBlockchain: orderBlockchain,
                                    totalAmount: totalFromWei })
            }
          } else {
            orderAmount = await handleTotalAmount(pricePerUnit, enteredAmount)

            fees = await this.props.calculateFeesToken(orderContract, orderAmount, TOKEN_DECIMALS, orderId)

            feesFromWei = await this.props.web3.fromWei(fees, 'ether')

            if (fees) { tradeMining = await this.props.tradeMiningAmount(orderContract, fees, orderId) }

            await this.setState({ orderAmount: Number(orderAmount).noExponents(),
                                  etherAmount: Number(enteredAmount).noExponents(),
                                  totalFees:   Number(feesFromWei).noExponents(),
                                  tradeMining: Number(tradeMining).noExponents(),
                                  orderType:       orderType,
                                  orderBlockchain: orderBlockchain,
                                  totalAmount: enteredAmount })
          }
        } else {
          if (orderType === 'SELL') {
            totalAmount = await handleTotalPrice(pricePerUnit, enteredAmount)

            fees = await this.props.calculateFees(orderContract, totalAmount, orderId)

            feesFromWei = await web3.fromWei(fees, 'ether')

            if (fees) {
              tradeMining = await this.props.tradeMiningAmount(orderContract, fees, orderId)
            }


            let desiredAmount = enteredAmount * (10 ** TOKEN_DECIMALS)
            let totalAmountToBuy = await this.props.getBuyTokenAmount(orderContract, desiredAmount, orderId)

            if (totalAmountToBuy) {
              let totalAmountToBuyString = totalAmountToBuy.toString()

              totalFromWei =  await web3.fromWei(totalAmountToBuyString, 'ether')

              await this.setState({ orderAmount: enteredAmount,
                                    etherAmount: Number(totalAmount).noExponents(),
                                    totalFees:   Number(feesFromWei).noExponents(),
                                    tradeMining: Number(tradeMining).noExponents(),
                                    orderType:       orderType,
                                    orderBlockchain: orderBlockchain,
                                    totalAmount: totalFromWei })
            }
          } else {
            fees = await this.props.calculateFeesToken(orderContract, enteredAmount, TOKEN_DECIMALS, orderId)
            feesFromWei = await this.props.web3.fromWei(fees, 'ether')

            if (fees) {
              tradeMining = await this.props.tradeMiningAmount(orderContract, fees, orderId)

              if (tradeMining) {
                totalAmount = await handleTotalPriceAfterFees(pricePerUnit, enteredAmount, feesFromWei)

                let totalPrice = await handleTotalPrice(pricePerUnit, enteredAmount)

                await this.setState({ orderAmount: enteredAmount,
                                      etherAmount: Number(totalPrice).noExponents(),
                                      totalFees:   Number(feesFromWei).noExponents(),
                                      tradeMining: Number(tradeMining).noExponents(),
                                      orderType:       orderType,
                                      orderBlockchain: orderBlockchain,
                                      totalAmount: Number(totalAmount).noExponents() })
              }
            }
          }
        }
      }

      await this.recalculateErrors()
    }
  }

  async recalculateErrors () {
    let data                 = this.props.selectedOrder.data
    let orderType            = data.type
    let orderBalance         = data.balance

    let etherBalance = this.props.etherBalance
    let tokenBalance = this.props.tokenBalance

    if (Number(this.state.orderAmount) > Number(orderBalance)) {
      this.setState({orderBalanceError: 'Maximum available amount for this order is ' + orderBalance + ' ' + TOKEN_SYMBOL })
    } else {
      this.setState({orderBalanceError: ''})
    }

    if (orderType === 'SELL') {
      if (Number(this.state.totalAmount) > Number(etherBalance)) {
        this.setState({walletBalanceError: 'Insufficient funds, your wallet balance is ' + etherBalance + ' ' + TOKEN_NETWORK })
      } else {
        this.setState({walletBalanceError: ''})
      }
    }

    if (orderType === 'BUY') {
      if (Number(this.state.orderAmount) > Number(tokenBalance)) {
        this.setState({walletBalanceError: 'Insufficient funds, your wallet balance is ' + tokenBalance + ' ' + TOKEN_SYMBOL })
      } else {
        this.setState({walletBalanceError: ''})
      }
    }
  }

  componentDidMount() {
    this.checkTxStatus = setInterval(this.loadTransactionData.bind(this), 5000)

    this.setTokensData()
  }

  componentWillUnmount() {
    clearInterval(this.checkTxStatus)
  }

  setTokensData() {
    let data            = this.props.selectedOrder.data
    let buyToken        = data.buytoken
    let sellToken       = data.selltoken

    this.setState({ buyToken: buyToken, sellToken: sellToken })
  }

  render() {
    let data            = this.props.selectedOrder.data
    let orderType       = data.type
    let buyToken        = data.buytoken
    let sellToken       = data.selltoken
    let orderBlockchain = data.blockchain
    let rawPrice        = data.price

    let targetTokenLogo = TOKEN_LOGO

    let ethPriceMaskDecimal = 18
    let targetTokenAmountMaskDecimal = TOKEN_DECIMALS
    let tokenBalance = this.props.tokenBalance

    return (
      <div>
        { this.state.transactionHash === '' && <div>
          <div className='card-head text-center'>
            {orderType === 'BUY' && <h4 className='card-title'>Sell {buyToken.symbol} for {sellToken.symbol}</h4> }
            {orderType === 'SELL' && <h4 className='card-title'>Buy {sellToken.symbol} for {buyToken.symbol}</h4> }
          </div>

            <div className='row'>
              <div className='col-lg-5 col-md-12 col-sm-12 token-bonus text-center token-bonus-sale'>
                <span className='input-title font-bold'>You Send</span>

                {orderType === 'BUY' && <div className='input-wrapper'>
                    <InputGroup>
                      <NumberFormat className='input-bordered input-bordered-dark-mode'
                                     thousandSeparator={true}
                                     allowNegative={false}
                                     decimalScale={targetTokenAmountMaskDecimal}
                                     value={this.state.orderAmount}
                                     onChange={event => { event.persist(); this.setState({orderAmount: event.target.value, totalAmount: null});  this.handleAmountChange(event.target.value) }} />
                    </InputGroup>

                    <div className='input-currency'>
                      <img src={`${targetTokenLogo}`} alt={TOKEN_NAME} height='20' width='20' /> {TOKEN_SYMBOL}
                    </div>
                  </div>}

                  {orderType === 'SELL' && <div className='input-wrapper'>
                    <InputGroup>
                      <NumberFormat className='input-bordered input-bordered-dark-mode'
                                     thousandSeparator={true}
                                     allowNegative={false}
                                     decimalScale={ethPriceMaskDecimal}
                                     value={this.state.etherAmount}
                                     onChange={event => { event.persist(); this.setState({etherAmount: event.target.value, orderAmount: null}); this.handleAmountChange(event.target.value) }} />
                    </InputGroup>

                    <div className='input-currency'>
                      <img src={`${BLOCKCHAIN_LOGO}`} alt={orderBlockchain} height='20' width='20' /> {orderBlockchain}
                    </div>
                  </div> }

                <div className='row pdt-1x'>
                  <div className='col-lg-12 col-md-12 quick-buttons text-right'>
                    <span className='btn btn-xs btn-light mgr-0-5x' onClick={() => this.calculateEthereumPrefill(25)}>25%</span>
                    <span className='btn btn-xs btn-light mgr-0-5x' onClick={() => this.calculateEthereumPrefill(50)}>50%</span>
                    <span className='btn btn-xs btn-light' onClick={() => this.calculateEthereumPrefill(90)}>100%</span>
                  </div>
                </div>
              </div>

              <div className='col-lg-2 d-none d-lg-block token-bonus'>
                <div className='text-center mgt-3-5x'><FontAwesomeIcon icon={faExchangeAlt} size='lg' color='#fff' /></div>
              </div>

              <div className='col-lg-2 col-md-12 col-sm-12 d-lg-none align-items-center justify-content-center'>
                <div className='text-center'><FontAwesomeIcon icon={faExchangeAlt} rotation={90} size='lg' color='#fff' /></div>
              </div>


              <div className='col-lg-5 col-md-12 col-sm-12 token-bonus text-center token-bonus-sale'>
                <span className='input-title font-bold'>You Get</span>

                {orderType === 'BUY' &&
                  <div className='input-wrapper'>
                    <InputGroup>
                      <NumberFormat className='input-bordered input-bordered-dark-mode'
                                     thousandSeparator={true}
                                     allowNegative={false}
                                     decimalScale={ethPriceMaskDecimal}
                                     disabled value={this.state.totalAmount} />
                    </InputGroup>

                    <div className='input-currency'>
                      <img src={`${BLOCKCHAIN_LOGO}`} alt={orderBlockchain} height='20' width='20' /> {orderBlockchain}
                    </div>
                  </div> }

              {orderType === 'SELL' &&
                <div className='input-wrapper'>
                    <InputGroup>
                      <NumberFormat className='input-bordered input-bordered-dark-mode'
                                     thousandSeparator={true}
                                     allowNegative={false}
                                     decimalScale={targetTokenAmountMaskDecimal}
                                     disabled value={this.state.orderAmount} />
                    </InputGroup>

                    <div className='input-currency'>
                      { targetTokenLogo ? <img
                        alt={`${TOKEN_SYMBOL} logo`}
                        src={targetTokenLogo} height='20' width='20' /> : '' } {TOKEN_SYMBOL}
                    </div>
                  </div> }

                  <div className='pdt-1x text-small text-light text-left'>
                  {  orderType === 'SELL' && <span>Balance: {this.props.etherBalance} {orderBlockchain}</span> }
                  {  orderType === 'BUY' && <span>Balance: {Number(tokenBalance).noExponents()} {TOKEN_SYMBOL}</span> }
                  <br/>
                  <span>Price: 1 {TOKEN_SYMBOL} = {rawPrice} {orderBlockchain}</span>
                </div>
              </div>
            </div>
            <div className='row align-items-center justify-content-center'>
              <div className='col-lg-8 text-center'>
                <div className='token-contribute'>
                  { this.state.orderBalanceError !== '' && <div>
                      <i className='fas fa-times-circle text-danger pdr-0-5x'></i>
                      <span className='note-text text-danger'>{this.state.orderBalanceError}</span>
                    </div> }

                  { this.state.walletBalanceError !== '' && <div>
                      <i className='fas fa-times-circle text-danger pdr-0-5x'></i>
                      <span className='note-text text-danger'>{this.state.walletBalanceError}</span>
                    </div> }
                  </div>
              </div>

              <div className='col-lg-12 buttons-wrapper pdt-2x'>
                <div className={`action-button`}><button onClick={() => this.signTransaction()} className='btn btn-success btn-between w-100'>Exchange Now <i className='fas fa-signature icon-margin-left-10'></i></button></div>
              </div>
            </div>
        </div> }
        { this.state.transactionHash !== '' && <div>
            <div className='status'>
              <IosPlanet fontSize='66px' color={ this.state.txReceipt === '' ? '#fff' : '#009f65'} beat={this.state.txReceipt === '' } />

              <span className='status-text large'>Thank you for choosing Saturn Network</span>
              <p className='px-md-5'></p>
            </div>

            { <div>
                <ul className='data-details-list'>
                    <li>
                      <div className='data-details-head'>Tx Hash</div>
                      <div className='data-details-des'><strong><a className='dark-url' href={handleExplorerForTx(orderBlockchain, this.state.transactionHash)} target='_blank' rel='noreferrer noopener'>{this.state.transactionHash}</a></strong></div>
                    </li>

                    <li>
                      <div className='data-details-head'>Tx Type</div>
                      <div className='data-details-des'>
                        {orderType === 'BUY' && <strong>Sell {buyToken.symbol} for {sellToken.symbol}</strong> }
                        {orderType === 'SELL' && <strong>Buy {sellToken.symbol} for {buyToken.symbol}</strong> }
                      </div>
                    </li>

                    <li>
                      <div className='data-details-head'>Price Per Token</div>
                      <div className='data-details-des'><strong>1 {TOKEN_SYMBOL} = {data.price} {orderBlockchain}</strong></div>
                    </li>

                    <li>
                      <div className='data-details-head'>Total Price</div>
                      <div className='data-details-des'>{orderType === 'SELL' && <strong>{this.state.totalAmount} {orderBlockchain} = <NumberFormat value={this.state.orderAmount} displayType={'text'} decimalScale={targetTokenAmountMaskDecimal} /> {TOKEN_SYMBOL}</strong> }
                        {orderType === 'BUY' && <strong><NumberFormat value={this.state.orderAmount} displayType={'text'} decimalScale={targetTokenAmountMaskDecimal} /> {TOKEN_SYMBOL} = {this.state.totalAmount} {orderBlockchain}</strong> }
                      </div>
                    </li>

                    <li>
                      <div className='data-details-head'>Trade Mining Bonus</div>
                      <div className='data-details-des'><strong>{this.state.tradeMining} {this.state.orderBlockchain === 'ETC' ? 'STRN' : 'SATURN'}</strong></div>
                    </li>
                    <li>
                      <div className='data-details-head'>Exchange Fee (0.25%)</div>
                      <div className='data-details-des'><strong>{`${this.state.totalFees} ${this.state.orderBlockchain}`}</strong></div>
                    </li>
                    <li>
                      <div className='data-details-head'>Gas Used</div>
                      <div className='data-details-des'><strong>{ this.state.txReceipt ? <span>{Number(this.state.txReceipt.gasused)}</span> : <span>Pending <Dot>.</Dot><Dot>.</Dot><Dot>.</Dot></span>  }</strong></div>
                    </li>
                    <li>
                      <div className='data-details-head'>Actual Tx Cost / Fee</div>
                      <div className='data-details-des'><strong>{ this.state.txReceipt ? <span>{`${this.state.txReceipt.txprice} ${this.state.orderBlockchain}`}</span> : <span>Pending <Dot>.</Dot><Dot>.</Dot><Dot>.</Dot></span> }</strong></div>
                    </li>
                </ul>
            </div>
          }
        </div> }
        { this.state.transactionHash === '' && <div className='pay-notes'>
            <div className='note note-plane note-light note-md text-light font-italic'>
              <FontAwesomeIcon icon={faInfoCircle} />
              <p>Tokens will be received directly in your wallet once your transaction has been successfully confirmed by the network.</p>
            </div>
            { this.state.transactionHash === '' && <div className='note note-plane note-light note-md text-light font-italic'>
              <FontAwesomeIcon icon={faInfoCircle} />
              <p>By clicking the 'Exchange Now' button you are agreeing to pay a 0.25% trade fee {this.state.totalFees && `(${this.state.totalFees} ${orderBlockchain})`}.</p>
            </div> }
            { this.state.transactionHash === '' && <div className='note note-plane note-light note-md text-light font-italic'>
              <FontAwesomeIcon icon={faInfoCircle} />
              <p>You will automatically receive a trade mining reward for completing a trade.</p>
            </div> }
        </div> }
      </div>
    )
  }
}

export default OrderForm
