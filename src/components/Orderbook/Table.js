import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider,
                            PaginationTotalStandalone,
                            PaginationListStandalone } from 'react-bootstrap-table2-paginator'

import { handleTotalAmount } from '../../utils/Helpers'
import { TOKEN_LOGO, TOKEN_NAME, TOKEN_NETWORK, BLOCKCHAIN_LOGO } from '../../config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ExecuteOrderModal from './ExecuteOrderModal'
import NumberFormat from 'react-number-format'

let numbro = require('numbro')

class Table extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedOrder: null
    }
  }

  async signCancelOrderTransaction (blockchain, contract, orderId) {
    await this.props.cancelOrder(contract, orderId)
  }

  render() {
    let activeAccountAddress = this.props.activeAccountAddress
    let tableType            = this.props.tableType
    let ordersData           = this.props.ordersData
    let networkName          = this.props.networkName

    const customTotal = (from, to, size) => (
      <span className='pagination-info'>
        { from } - { to } of { size } orders
      </span>
    )

    const columns = [
      {
        dataField: 'transaction',
        text: 'transaction',
        hidden: true,
        formatter: (cellContent, row) => {
          return (
            cellContent
          )
        }
      },
      {
        dataField: 'token_amount',
        text: 'Token Amount',
        sort: true,
        isDummyField: true,
        formatter: (cellContent, row) => {
          return (
            <div>
              { tableType === 'sell-orders' && <button className='link-button' onClick={() => this.setState({ selectedOrder: row.transaction })} data-toggle='modal' data-target='#modal-sell-orders'>{TOKEN_LOGO && <img alt={TOKEN_NAME} src={`${TOKEN_LOGO}`} height='20' width='20' />} { numbro(row.balance).format({ thousandSeparated: true, trimMantissa: true, mantissa: 4 }) }</button> }
              { tableType === 'buy-orders' && <button className='link-button' onClick={() => this.setState({ selectedOrder: row.transaction })} data-toggle='modal' data-target='#modal-buy-orders'>{TOKEN_LOGO && <img alt={TOKEN_NAME} src={`${TOKEN_LOGO}`} height='20' width='20' />} { numbro(row.balance).format({ thousandSeparated: true, trimMantissa: true, mantissa: 4 }) }</button> }
            </div>
          )
        },
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          if (order === 'desc') {
            return numbro(rowB.balance).value() - numbro(rowA.balance).value()
          }
          return numbro(rowA.balance).value() - numbro(rowB.balance).value()
        },
      },
      {
        dataField: 'price_per_token',
        text: 'Price Per Token',
        sort: true,
        isDummyField: true,
        formatter: (cellContent, row) => {
          return (
            <div>
              { tableType === 'sell-orders' && <button className='link-button' onClick={() => this.setState({ selectedOrder: row.transaction })} data-toggle='modal' data-target='#modal-sell-orders'><img alt={TOKEN_NETWORK} src={`${BLOCKCHAIN_LOGO}`} height='20' width='20' />
                <NumberFormat value={row.price} displayType={'text'} thousandSeparator={true} fixedDecimalScale={false} decimalScale={18} /></button>
              }
              { tableType === 'buy-orders' && <button className='link-button' onClick={() => this.setState({ selectedOrder: row.transaction })} data-toggle='modal' data-target='#modal-buy-orders'><img alt={TOKEN_NETWORK} src={`${BLOCKCHAIN_LOGO}`} height='20' width='20' />
                <NumberFormat value={row.price} displayType={'text'} thousandSeparator={true} fixedDecimalScale={false} decimalScale={18} /></button>
              }
            </div>
          )
        },
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          if (order === 'desc') {
            return numbro(rowB.price).value() - numbro(rowA.price).value()
          }
          return numbro(rowA.price).value() - numbro(rowB.price).value()
        },
      },
      {
        dataField: 'total_price',
        text: 'Total Price',
        sort: true,
        isDummyField: true,
        formatter: (cellContent, row) => {
          return (
            <div>
              { tableType === 'sell-orders' && <button className='link-button' onClick={() => this.setState({ selectedOrder: row.transaction })} data-toggle='modal' data-target='#modal-sell-orders'><img alt={TOKEN_NETWORK} src={`${BLOCKCHAIN_LOGO}`} height='20' width='20' /> {numbro(handleTotalAmount(row.price, row.balance)).format({ thousandSeparated: true, trimMantissa: true, mantissa: 6 })}</button> }
              { tableType === 'buy-orders' && <button className='link-button' onClick={() => this.setState({ selectedOrder: row.transaction })} data-toggle='modal' data-target='#modal-buy-orders'><img alt={TOKEN_NETWORK} src={`${BLOCKCHAIN_LOGO}`} height='20' width='20' /> {numbro(handleTotalAmount(row.price, row.balance)).format({ thousandSeparated: true, trimMantissa: true, mantissa: 6 })}</button> }
            </div>
          )
        },
        sortFunc: (a, b, order, dataField, rowA, rowB) => {
          if (order === 'desc') {
            return numbro(handleTotalAmount(rowB.price, rowB.balance)).value() - numbro(handleTotalAmount(rowA.price, rowA.balance)).value()
          }
          return numbro(handleTotalAmount(rowA.price, rowA.balance)).value() - numbro(handleTotalAmount(rowB.price, rowB.balance)).value()
        },
      },
      {
        dataField: 'order_action',
        text: '',
        isDummyField: true,
        sort: false,
        formatter: (cellContent, row) => {
          return (
            <div>
              <button onClick={(e) => { this.setState({ selectedOrder: row.transaction })}} data-toggle='modal' data-target={tableType === 'sell-orders' ? '#modal-sell-orders' : '#modal-buy-orders'} className={tableType === 'sell-orders' ? 'badge badge-success' : 'badge badge-danger'}><span>{ tableType === 'sell-orders' ? "BUY" : "SELL"}</span></button>
              { (((networkName === 'classic' && row.blockchain === 'ETC') || (networkName === 'mainnet' && row.blockchain === 'ETH') ) && (row.owner === activeAccountAddress)) && <button onClick={(e) => { e.preventDefault(); this.signCancelOrderTransaction(row.blockchain, row.contract, row.order_id) }} className='badge badge-info ml-10'><span>CANCEL</span></button> }
            </div>
          )
        },
      },
    ]

    const defaultSorted = [{
      dataField: 'price_per_token', // if dataField is not match to any column you defined, it will be ignored.
      order: tableType === 'buy-orders' ? 'desc' : 'asc'
    }]

    return (
      <div>
        <PaginationProvider pagination={
            paginationFactory({custom: true,
                               sizePerPage: 10,
                               totalSize: ordersData.length,
                               paginationTotalRenderer: customTotal})}>
            {
              ({
                paginationProps,
                paginationTableProps
              }) => (
                <div>
                  <div className='responsive-table-overflow-md'>
                    <BootstrapTable
                      keyField='transaction'
                      data={ordersData}
                      columns={columns}
                      classes={`${tableType}`}
                      defaultSorted={ defaultSorted }
                      striped
                      hover
                      noDataIndication='There is no data to display'
                      {...paginationTableProps } />
                  </div>

                  <div className='row align-items-center justify-content-center'>
                    <div className='col-sm-6 text-left pdt-2x'>
                      <PaginationListStandalone { ...paginationProps } />
                    </div>

                    <div className='col-sm-6 text-sm-right pagination-table-dark pdt-2x'>
                      <PaginationTotalStandalone { ...paginationProps } />
                    </div>
                  </div>
                </div>
              )
            }
          </PaginationProvider>

        <div className='modal fade' id={tableType === 'sell-orders' ? 'modal-sell-orders' : 'modal-buy-orders'} tabIndex='-1'>
          <div className='modal-dialog modal-dialog-lg modal-dialog-centered'>
            <div className='modal-content'>
              <button className='link-button modal-close' onClick={() => { this.setState({ selectedOrder: null })} } data-dismiss='modal' aria-label='Close'><FontAwesomeIcon className='ti' icon={faTimes} size='lg' /></button>
                <div className='popup-body'>
                  { this.state.selectedOrder && <ExecuteOrderModal txHash={this.state.selectedOrder} /> }
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Table
