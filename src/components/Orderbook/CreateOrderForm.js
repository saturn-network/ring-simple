import React, {Component} from 'react'
import { InputGroup } from 'reactstrap'
import NumberFormat from 'react-number-format'
import { debounce } from 'debounce'
import { handleTotalPrice } from '../../utils/TokenUtil'
import { handleExplorerForTx } from '../../utils/Utils'
import { fetchTxReceiptByTransactionHash } from '../../actions'
import { Dot } from 'react-animated-dots'
import IosPlanet from 'react-ionicons/lib/IosPlanet'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExchangeAlt, faBalanceScale, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { TOKEN_STANDARD, TOKEN_ADDRESS, TOKEN_SYMBOL, TOKEN_DECIMALS, TOKEN_NETWORK, TOKEN_LOGO, BLOCKCHAIN_LOGO, ETHER_ADDRESS, TOKEN_NAME } from '../../config'

var numbro = require('numbro');

class CreateOrderForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      orderType: 'Buy',
      orderAmount: 0,
      totalAmount: null,
      pricePerUnit: 0,
      errorMessage: '',
      transactionHash: '',
      txReceipt: ''
    }

    this.handleAmountChange = debounce(this.handleAmountChange, 500);
    this.handlePriceChange = debounce(this.handlePriceChange, 500);
  }

  async selectOrderType(orderType) {
    this.setState({orderType: orderType})
    await this.recalculateErrors(orderType)
  }

  async loadTransactionData() {
    if (this.state.transactionHash !== '') {
      let txReceipt = await fetchTxReceiptByTransactionHash(this.state.transactionHash, TOKEN_NETWORK)

      if (txReceipt && txReceipt !== this.state.txReceipt) {
        this.setState({ txReceipt: txReceipt })
      }
    }
  }

  async handleAmountChange (value) {
    if (value) {
      const orderAmount = Number(numbro(value).value()).noExponents()
      const pricePerUnit = this.state.pricePerUnit

      await this.setState({ orderAmount: orderAmount })

      if (pricePerUnit) {
        const total = Number(handleTotalPrice(pricePerUnit, orderAmount)).noExponents()
        await this.setState({ totalAmount: total })
      }

      await this.recalculateErrors(this.state.orderType)
    }
  }

  async handlePriceChange (value) {
    if (value) {
      const pricePerUnit = Number(numbro(value).value()).noExponents()
      const orderAmount = this.state.orderAmount

      await this.setState({ pricePerUnit: pricePerUnit })

      if (orderAmount && pricePerUnit) {
        const total = Number(handleTotalPrice(pricePerUnit, orderAmount)).noExponents()
        await this.setState({ totalAmount: total })
      }

      await this.recalculateErrors(this.state.orderType)
    };
  }

  async resetOrder() {
    this.setState({ orderAmount: 0, totalAmount: null, pricePerUnit: 0, errorMessage: '', transactionHash: '', txReceipt: '' })
  }

  async signTransaction () {
    let transactionHash

    if (TOKEN_STANDARD === 'ERC20') {
      if (this.state.orderType === 'Sell') {
        transactionHash = await this.props.createOrderErc20(this.state.orderAmount, this.state.pricePerUnit, ETHER_ADDRESS, TOKEN_ADDRESS)
      } else {
        transactionHash = await this.props.createOrderErc20(this.state.totalAmount, this.state.pricePerUnit, TOKEN_ADDRESS, ETHER_ADDRESS)
      }
    }

    if (TOKEN_STANDARD === 'ERC223') {
      if (this.state.orderType === 'Sell') {
        transactionHash = await this.props.createOrderErc223(this.state.orderAmount, this.state.pricePerUnit, ETHER_ADDRESS, TOKEN_ADDRESS)
      } else {
        transactionHash = await this.props.createOrderErc223(this.state.totalAmount, this.state.pricePerUnit, TOKEN_ADDRESS, ETHER_ADDRESS)
      }
    }

    if (transactionHash) {
      this.setState({ transactionHash: transactionHash })
    }
  }

  async recalculateErrors (orderType) {
    let ethereumBalance      = this.props.etherBalance
    let tokenBalance         = this.props.tokenBalance

    if (orderType === 'Buy') {
      if (this.state.totalAmount) {
        if (Number(this.state.totalAmount) > Number(ethereumBalance)) {
          this.setState({errorMessage: 'Insufficient funds, your wallet balance is ' + ethereumBalance + ' ' + TOKEN_NETWORK })
        } else if (Number(this.state.totalAmount) < Number(0.001)) {
          this.setState({errorMessage: `The order you are trying to create is too small. Order size (token amount times token price) should be greater than 0.001 ${TOKEN_NETWORK}` })
        } else {
          this.setState({errorMessage: ''})
        }
      } else {
        this.setState({errorMessage: ''})
      }
    }

    if (orderType === 'Sell') {
      if (this.state.orderAmount) {
        if (Number(this.state.orderAmount) > Number(tokenBalance)) {
          this.setState({errorMessage: 'Insufficient funds, your wallet balance is ' + tokenBalance + ' ' + TOKEN_SYMBOL })
        } else if (Number(this.state.totalAmount) < Number(0.001)) {
          this.setState({errorMessage: `The order you are trying to create is too small. Order size (token amount times token price) should be greater than 0.001 ${TOKEN_NETWORK}` })
        } else {
          this.setState({errorMessage: ''})
        }
      } else {
        this.setState({errorMessage: ''})
      }
    }

  }

  componentDidMount() {
    this.checkTxStatus = setInterval(this.loadTransactionData.bind(this), 5000)
  }

  componentWillUnmount() {
    clearInterval(this.checkTxStatus);
  }

  render() {
    const pricePerTokenMaskDecimal = 18
    const ethPriceMaskDecimal = 18

    let targetTokenBestBuyPrice = this.props.bestBuyPrice
    let targetTokenBestSellPrice = this.props.bestSellPrice

    let targetTokenBalance = this.props.tokenBalance
    let transactionSigned = (this.state.transactionHash !== '')

    return (
      <div>
        { !transactionSigned &&
          <div>
            <div className='card-head text-center'>
              <h4 className='card-title'>Create Order</h4>
            </div>

            <div className='card-head'>
              <span className='card-sub-title text-light font-mid'>Step 1</span>
              <h4 className='card-title'>Select Order Type</h4>
            </div>

            <div className='card-text'>
              <p className='text-light'>As a market maker you enjoy zero fees. Please make sure you have selected the correct order type.</p>
            </div>

            <div className='token-currency-choose'>
              <div className='row guttar-15px'>
                <div className='col-lg-6 col-md-12'>
                  <div className='order-type'>
                    <input onClick={() => this.selectOrderType('Buy')} className='order-type-check' type='radio' id='buy-label' name='payOption' defaultChecked/>
                    <label className='order-type-label' htmlFor='buy-label'>
                      <span className='pay-title'><FontAwesomeIcon className='mr-10' icon={faExchangeAlt} size='lg' color='#fff' />Buy {TOKEN_SYMBOL} for {TOKEN_NETWORK}</span>
                    </label>
                  </div>
                </div>
                <div className='col-lg-6 col-md-12'>
                  <div className='order-type'>
                    <input onClick={() => this.selectOrderType('Sell')} className='order-type-check' type='radio' id='sell-label' name='payOption'/>
                    <label className='order-type-label' htmlFor='sell-label'>
                        <span className='pay-title'><FontAwesomeIcon className='mr-10' icon={faBalanceScale} size='lg' color='#fff' />Sell {TOKEN_SYMBOL} for {TOKEN_NETWORK}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className='card-head'>
              <span className='card-sub-title text-light font-mid'>Step 2</span>
              <h4 className='card-title'>Enter Amount and Price Per Token</h4>
            </div>

            <div className='card-text'>
              <p className='text-light'>Enter amount of tokens you would like to <b>{this.state.orderType.toUpperCase()}</b> and your desired price.</p>
            </div>

            <div className='row'>
              <div className='col-lg-6 col-md-6 col-xs-12 text-center mt-15'>
                <span className='input-title font-bold'>Amount of Tokens</span>

                <div className='input-wrapper'>
                  <InputGroup>
                     <NumberFormat className='input-bordered input-bordered-dark-mode'
                                     thousandSeparator={true}
                                     allowNegative={false}
                                     decimalScale={TOKEN_DECIMALS}
                                     onChange={event => this.handleAmountChange(event.target.value)} />
                  </InputGroup>

                  <div className='input-currency'>
                    { TOKEN_LOGO ? <img src={`${TOKEN_LOGO}`} alt={TOKEN_NAME} height='20' width='20' /> : '' } {TOKEN_SYMBOL}
                  </div>
                </div>

                <div className='pdt-1x text-small text-light text-left'>
                  { this.state.orderType === 'Buy' && <span>Balance: {this.props.etherBalance} {TOKEN_NETWORK}</span> }
                  { this.state.orderType === 'Sell' && <span>Balance: {Number(targetTokenBalance).noExponents()} {TOKEN_SYMBOL}</span> }
                </div>
              </div>

              <div className='col-lg-6 col-md-6 col-xs-12 text-center mt-15'>
                <span className='input-title font-bold'>Price Per Token</span>
                <div className='input-wrapper'>
                  <InputGroup>
                    <NumberFormat className='input-bordered input-bordered-dark-mode'
                                   thousandSeparator={true}
                                   allowNegative={false}
                                   decimalScale={pricePerTokenMaskDecimal}
                                   onChange={event => this.handlePriceChange(event.target.value)} />
                  </InputGroup>

                  <div className='input-currency'>
                    <img src={`${BLOCKCHAIN_LOGO}`} alt={TOKEN_NETWORK} height='20' width='20' /> {TOKEN_NETWORK}
                  </div>
                </div>

                <div className='pdb-1x text-light text-left'>
                  { (this.state.pricePerUnit > 0) && <span className='input-note'>Price Per Token: 1 {TOKEN_SYMBOL} = {Number(this.state.pricePerUnit).noExponents()} {TOKEN_NETWORK}</span> }
                  { targetTokenBestSellPrice && this.state.orderType === 'Sell' && <span className='input-note'>Current Best Price: {Number(targetTokenBestSellPrice).noExponents()} {TOKEN_NETWORK}</span>}
                  { targetTokenBestBuyPrice && this.state.orderType === 'Buy' && <span className='input-note'>Current Best Price: {Number(targetTokenBestBuyPrice).noExponents()} {TOKEN_NETWORK}</span>}
                </div>
              </div>
          </div>


          { this.state.totalAmount &&
            <div>
              <div className='card-head'>
                <span className='card-sub-title text-light font-mid'>Step 3</span>
                <h4 className='card-title'>Confirm Your Order</h4>
              </div>

              <div className='card-text'>
                <p className='text-light'>Your funds will be sent to the order book smart contract. Tokens will appear in your wallet when a trader fills your order. You can cancel your order at any time.</p>
              </div>

              <div className='row align-items-center justify-content-center'>
                <div className='col-md-6 col-sm-12 text-center mt-15'>
                  <span className='input-title font-bold'>You Will Send</span>
                  <div className='input-wrapper'>

                    { this.state.orderType === 'Buy' &&
                      <div>
                        <NumberFormat className='input-bordered input-bordered-dark-mode'
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={ethPriceMaskDecimal}
                                disabled value={this.state.totalAmount} />

                        <div className='input-currency'><img src={`${BLOCKCHAIN_LOGO}`} alt={TOKEN_NETWORK} height='20' width='20' /> {TOKEN_NETWORK}</div>
                      </div> }

                    { this.state.orderType === 'Sell' &&
                      <div>
                        <NumberFormat className='input-bordered input-bordered-dark-mode'
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={TOKEN_DECIMALS}
                                disabled value={this.state.orderAmount} />

                        <div className='input-currency'>{ TOKEN_LOGO ? <img src={`${TOKEN_LOGO}`} alt={TOKEN_NAME} height='20' width='20' /> : '' } {TOKEN_SYMBOL}</div>
                      </div> }
                  </div>
                </div>

                <div className='col-md-6 col-sm-12 text-center mt-15'>
                  <span className='input-title font-bold'>You Will Get</span>
                  <div className='input-wrapper'>
                    { this.state.orderType === 'Buy' && <div>
                      <NumberFormat className='input-bordered input-bordered-dark-mode'
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={TOKEN_DECIMALS}
                                disabled
                                value={this.state.orderAmount} />
                      <div className='input-currency'>{ TOKEN_LOGO ? <img src={`${TOKEN_LOGO}`} alt={TOKEN_NAME} height='20' width='20' /> : '' } {TOKEN_SYMBOL}</div>
                    </div>}

                    { this.state.orderType === 'Sell' && <div>
                      <NumberFormat className='input-bordered input-bordered-dark-mode'
                                thousandSeparator={true}
                                allowNegative={false}
                                decimalScale={ethPriceMaskDecimal}
                                disabled
                                value={this.state.totalAmount} />
                      <div className='input-currency'><img src={`${BLOCKCHAIN_LOGO}`} alt={TOKEN_NETWORK} height='20' width='20' /> {TOKEN_NETWORK}</div>
                    </div>}
                  </div>
                </div>

                <div className='col-lg-12 text-center mt-15'>
                  { this.state.errorMessage !== '' && <div>
                    <FontAwesomeIcon className='mr-10' icon={faTimesCircle} size='lg' color='#ff6868' />
                    <span className='note-text text-danger'>{this.state.errorMessage}</span>
                  </div> }
                </div>
              </div>
            </div>
          }

          { this.state.totalAmount && this.state.errorMessage === '' && <div className='buttons-wrapper'>
            <div className='action-button'><button onClick={() => this.signTransaction()} className='btn btn-success-alt btn-between w-100'>Create Order</button></div>
          </div> }
        </div>}

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
                  <div className='data-details-des'><strong><a className='dark-url' href={handleExplorerForTx(TOKEN_NETWORK, this.state.transactionHash)} target='_blank' rel='noreferrer noopener'>{this.state.transactionHash}</a></strong></div>
                </li>

                <li>
                    <div className='data-details-head'>Order Type</div>
                    <div className='data-details-des'><strong>{this.state.orderType} {TOKEN_SYMBOL} for {TOKEN_NETWORK}</strong></div>
                </li>

                <li>
                    <div className='data-details-head'>Price Per Token</div>
                    <div className='data-details-des'><strong>1 {TOKEN_SYMBOL} = {Number(this.state.pricePerUnit).noExponents()} {TOKEN_NETWORK}</strong></div>
                </li>

                <li>
                  <div className='data-details-head'>Total Price</div>
                  <div className='data-details-des'>{this.state.orderType === 'Sell' && <strong>{this.state.orderAmount} {TOKEN_SYMBOL} = <NumberFormat value={this.state.totalAmount} displayType={'text'} decimalScale={ethPriceMaskDecimal} /> {TOKEN_NETWORK}</strong> }
                    {this.state.orderType === 'Buy' && <strong><NumberFormat value={this.state.totalAmount} displayType={'text'} decimalScale={ethPriceMaskDecimal} /> {TOKEN_NETWORK} = {this.state.orderAmount} {TOKEN_SYMBOL}</strong> }
                  </div>
                </li>

                <li>
                    <div className='data-details-head'>Block</div>
                    <div className='data-details-des'>{ this.state.txReceipt ? <span>{this.state.txReceipt.blocknumber}</span> : <span>Pending <Dot>.</Dot><Dot>.</Dot><Dot>.</Dot></span> } <span></span></div>
                </li>
                <li>
                    <div className='data-details-head'>Gas Used</div>
                    <div className='data-details-des'>{ this.state.txReceipt ? <span>{Number(this.state.txReceipt.gasused)}</span> : <span>Pending <Dot>.</Dot><Dot>.</Dot><Dot>.</Dot></span>  } <span></span></div>
                </li>
                <li>
                    <div className='data-details-head'>Actual Tx Cost / Fee</div>
                    <div className='data-details-des'>{ this.state.txReceipt ? <span>{`${this.state.txReceipt.txprice} ${TOKEN_NETWORK}`}</span> : <span>Pending <Dot>.</Dot><Dot>.</Dot><Dot>.</Dot></span> } <span></span></div>
                </li>
              </ul>
            </div> }

          <div className='buttons-wrapper'>
            <div className='action-button'><button onClick={() => this.resetOrder()} className='btn btn-success-alt btn-between w-100'>Create New Order</button></div>
          </div>
        </div> }
      </div>
    )
  }
}

export default CreateOrderForm
