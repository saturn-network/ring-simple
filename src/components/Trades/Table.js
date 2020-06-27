import React, { Component } from 'react'
import moment from 'moment'
import { handleExplorerForTx, handleExplorerForAddress } from '../../utils/Helpers'
import Hashicon from '../Shared/Hashicon'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider,
                            PaginationTotalStandalone,
                            PaginationListStandalone } from 'react-bootstrap-table2-paginator'
import NumberFormat from 'react-number-format'

import { TOKEN_NETWORK, TOKEN_LOGO, BLOCKCHAIN_LOGO, TOKEN_NAME } from '../../config'

let numbro = require('numbro')

class Table extends Component {

  render () {
    let tradesData = this.props.tradesData.sort(function (a,b) { return b.created_at - a.created_at })

    const customTotal = (from, to, size) => (
      <span className='pagination-info'>
        {from} - {to} of {size} trades
      </span>
    )

    const columns = [
      {
        dataField: 'created_at',
        text: 'Date (DD/MM)',
        isDummyField: true,
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <span className='lead created-at'>{moment.unix(row.created_at).format('DD/MM, HH:mm').toString()}</span>
          )
        }
      },
      {
        dataField: 'transaction',
        text: 'Tx Hash',
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <span className='lead transaction-hash'><a href={handleExplorerForTx(TOKEN_NETWORK, row.transaction)} target='_blank' rel='noopener noreferrer'><Hashicon hash={row.transaction} size={30} className={`${row.transaction}`} /></a></span>
          )
        }
      },
      {
        dataField: 'order_type',
        text: 'Tx Type',
        isDummyField: true,
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          if (row.order_type === 'SELL') {
            return (
              <span className='badge badge-success table-mobile-td-order'>BUY</span>
            )
          } else {
            return (
              <span className='badge badge-danger table-mobile-td-order'>SELL</span>
            )
          }
        }
      },
      {
        dataField: 'buyer',
        text: 'Buyer',
        classes: 'data-col',
        headerClasses: 'data-col',
        isDummyField: true,

        formatter: (cellContent, row) => {
          return (
            <div>
              {row.order_type === 'SELL' && <span className='lead transaction-hash'><a href={handleExplorerForAddress(TOKEN_NETWORK, row.buyer)} target='_blank' rel='noopener noreferrer'><Hashicon hash={row.buyer} className={`${row.buyer}`} size={30} /></a></span>}
              {row.order_type === 'BUY' && <span className='lead transaction-hash'><a href={handleExplorerForAddress(TOKEN_NETWORK, row.seller)} target='_blank' rel='noopener noreferrer'><Hashicon hash={row.seller} className={`${row.seller}`} size={30} /></a></span>}
            </div>
          )
        }
      },
      {
        dataField: 'seller',
        text: 'Seller',
        classes: 'data-col',
        headerClasses: 'data-col',
        isDummyField: true,

        formatter: (cellContent, row) => {
          return (
            <div>
               { row.order_type === 'SELL' && <span className='lead transaction-hash'><a href={handleExplorerForAddress(TOKEN_NETWORK, row.seller)} target='_blank' rel='noopener noreferrer'><Hashicon hash={row.seller} className={`${row.seller}`} size={30} /></a></span> }
               { row.order_type === 'BUY' && <span className='lead transaction-hash'><a href={handleExplorerForAddress(TOKEN_NETWORK, row.buyer)} target='_blank' rel='noopener noreferrer'><Hashicon hash={row.buyer} className={`${row.buyer}`}  size={30} /></a></span> }
            </div>
          )
        }
      },
      {
        dataField: 'token_amount',
        text: 'Token Amount',
        classes: 'data-col',
        headerClasses: 'data-col',
        isDummyField: true,

        formatter: (cellContent, row) => {
          return (
            <div>
               { row.order_type === 'BUY' && <span className='lead token-amount table-mobile-td'>{TOKEN_LOGO && <img src={TOKEN_LOGO} alt={TOKEN_NAME} height='30' width='30' />} { numbro(row.buytokenamount).format('0,0[.]0000') === 'NaN' ? '> 0' : numbro(row.buytokenamount).format({ thousandSeparated: true, trimMantissa: true, mantissa: 4 }) }</span> }
               { row.order_type === 'SELL' && <span className='lead token-amount table-mobile-td'>{TOKEN_LOGO && <img src={TOKEN_LOGO} alt={TOKEN_NAME} height='30' width='30' />} { numbro(row.selltokenamount).format('0,0[.]0000') === 'NaN' ? '> 0' : numbro(row.selltokenamount).format({ thousandSeparated: true, trimMantissa: true, mantissa: 4 }) }</span> }
            </div>
          )
        }
      },
      {
        dataField: 'price_per_token',
        text: 'Price Per Token',
        isDummyField: true,
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <span className='lead token-price table-mobile-td'><img src={`${BLOCKCHAIN_LOGO}`} alt={row.blockchain} height='30' width='30' />
              <NumberFormat value={row.price} displayType={'text'} thousandSeparator={true} fixedDecimalScale={false} decimalScale={18} />
            </span>
          )
        }
      },
      {
        dataField: 'total_price',
        text: 'Total Price',
        isDummyField: true,
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <div>
              { row.order_type === 'BUY' && <span className='lead ethereum-amount table-mobile-td'><img src={`${BLOCKCHAIN_LOGO}`} alt={row.blockchain} height='30' width='30' /> { numbro(row.selltokenamount).format('0,0[.]000000') === 'NaN' ? '> 0' : numbro(row.selltokenamount).format({ thousandSeparated: true, trimMantissa: true, mantissa: 6 }) }</span> }
              { row.order_type === 'SELL' && <span className='lead ethereum-amount table-mobile-td'><img src={`${BLOCKCHAIN_LOGO}`} alt={row.blockchain} height='30' width='30' /> { numbro(row.buytokenamount).format('0,0[.]000000') === 'NaN' ? '> 0' : numbro(row.buytokenamount).format({ thousandSeparated: true, trimMantissa: true, mantissa: 6 }) }</span> }
            </div>
          )
        }
      },
    ]

    return (
      <div className='pdt-1x'>
        <PaginationProvider pagination={
            paginationFactory({ custom: true,
                               totalSize: tradesData.length,
                               paginationTotalRenderer: customTotal })}>
            {
              ({
                paginationProps,
                paginationTableProps
              }) => (
                <div>
                  <div className='responsive-table-overflow-lg'>
                    <BootstrapTable
                      keyField='transaction'
                      data={tradesData}
                      columns={columns}
                      classes='table-dark trades-history'
                      headerClasses='data-item data-head'
                      noDataIndication='There is no data to display'
                      bordered={ false }
                      {...paginationTableProps} />
                  </div>

                  <div className='row align-items-center justify-content-center'>
                    <div className='col-sm-6 text-left pdt-2x'>
                      <PaginationListStandalone {...paginationProps} />
                    </div>

                    <div className='col-sm-6 text-sm-right pagination-table-dark pdt-2x'>
                      <PaginationTotalStandalone {...paginationProps} />
                    </div>
                  </div>
                </div>
              )
            }
          </PaginationProvider>
       </div>

    )
  }
}

export default Table
