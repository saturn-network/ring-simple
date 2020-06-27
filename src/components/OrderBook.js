import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'reactstrap'
import CreateOrderModal from './Orderbook/CreateOrderModal'
import Table from './Orderbook/Table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import { fetchOrders, cancelOrder } from '../actions'
import { TOKEN_SYMBOL, TOKEN_ADDRESS, TOKEN_NETWORK } from '../config'

class OrderBook extends Component {
  componentDidMount() {
    this.fetchOrders()
    this.fetchOrderBookdData = setInterval(this.fetchOrders.bind(this), 15000)
  }

  componentWillUnmount() {
    clearInterval(this.fetchOrderBookdData)
  }

  fetchOrders() {
    this.props.fetchOrders(TOKEN_NETWORK, TOKEN_ADDRESS)
  }

  render() {
    let activeAccountAddress = this.props.activeAccountAddress
    let ordersData           = this.props.orders[`${TOKEN_ADDRESS}`]
    let networkName          = this.props.networkName

    let sellOrdersData = []
    let buyOrdersData = []

    if (ordersData && !ordersData.data.isSync) {
      if (ordersData.data.buys && ordersData.data.buys.length > 0) {
        buyOrdersData = buyOrdersData.concat(ordersData.data.buys)
      }

      if (ordersData.data.sells && ordersData.data.sells.length > 0) {
        sellOrdersData = sellOrdersData.concat(ordersData.data.sells)
      }
    }

    return (
      <Row className='mt-5'>
        <Col md='12' lg='6'>
          <div className='content-area card'>
            <div className='card-innr'>
             <div className='card-head has-aside'>
                <h4 className='card-title'>Buy {TOKEN_SYMBOL}</h4>

                <div className='card-opt'>
                  <button className='link-button link ucap' data-toggle='modal' data-target='#modal-create-order'>Create Order <FontAwesomeIcon className='ml-10' icon={faPlusSquare} size='lg' /></button>
                </div>
              </div>

              { (buyOrdersData.length > 0) && <Table
                cancelOrder={this.props.cancelOrder}
                networkName={networkName}
                ordersData={buyOrdersData}
                activeAccountAddress={activeAccountAddress}
                tableType={'sell-orders'}
              /> }
            </div>
          </div>
        </Col>

        <Col md='12' lg='6'>
          <div className='content-area card'>
              <div className='card-innr'>
              <div className='card-head has-aside'>
                  <h4 className='card-title'>Sell {TOKEN_SYMBOL}</h4>

                  <div className='card-opt'>
                    <button className='link-button link ucap' data-toggle='modal' data-target='#modal-create-order'>Create Order <FontAwesomeIcon className='ml-10' icon={faPlusSquare} size='lg' /></button>
                  </div>
                </div>

                { (sellOrdersData.length > 0) && <Table
                  cancelOrder={this.props.cancelOrder}
                  networkName={networkName}
                  ordersData={sellOrdersData}
                  activeAccountAddress={activeAccountAddress}
                  tableType={'buy-orders'}
                /> }
              </div>
            </div>
          </Col>

          <div className='modal fade' id={'modal-create-order'} tabIndex='-1'>
            <div className='modal-dialog modal-dialog-lg modal-dialog-centered'>
              <div className='modal-content'>
                  <button className='link-button modal-close' data-dismiss='modal' aria-label='Close'><FontAwesomeIcon className='ti' icon={faTimes} size='lg' /></button>
                  <div className='popup-body'>
                    <CreateOrderModal />
                  </div>
              </div>
            </div>
          </div>
      </Row>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    activeAccountAddress: state.network.activeAccountAddress,
    orders: state.orderBook.orders,
    networkName: state.network.networkName
  }
}

const mapActionCreators = {
  fetchOrders,
  cancelOrder
}

export default connect(mapStateToProps, mapActionCreators)(OrderBook)

