import React, { Component } from 'react'
import { handleExplorerForAddress } from '../../utils/Helpers'
import Hashicon from '../Shared/Hashicon'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory, { PaginationProvider,
                            PaginationListStandalone } from 'react-bootstrap-table2-paginator'
import { TRADING_COMPETITION_STRATEGY, TOKEN_NETWORK, BLOCKCHAIN_LOGO, TRADE_MINING_REWARD_LOGO, TRADE_MINING_REWARD_SYMBOL } from '../../config'

let numbro = require('numbro')

class Table extends Component {
  render () {
    let leaderboardData

    switch(TRADING_COMPETITION_STRATEGY) {
      case 'bought':
        leaderboardData = this.props.leaderboardData.buyers
        break
      case 'sold':
        leaderboardData = this.props.leaderboardData.sellers
        break
      case 'mined':
        leaderboardData = this.props.leaderboardData.trademiners
        break
      default:
        leaderboardData = this.props.leaderboardData.trademiners
        break
    }

    let columns = [
      {
        dataField: 'address',
        text: 'Trader',
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <span className='lead'><a href={handleExplorerForAddress(TOKEN_NETWORK, cellContent)} target='_blank' rel='noopener noreferrer'><Hashicon hash={cellContent} className={`${cellContent}`} size={30} /></a></span>
          )
        }
      }
    ]

    if (TRADING_COMPETITION_STRATEGY === 'mined') {
      columns.push({
        dataField: 'mining_amount',
        text: 'Trade Mined',
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <span className='lead'><img src={`${TRADE_MINING_REWARD_LOGO}`} alt={TRADE_MINING_REWARD_SYMBOL} height='30' width='30' /> { numbro(cellContent).format({ thousandSeparated: true, trimMantissa: true, mantissa: 4 }) }</span>
          )
        }
      })
    } else {
      columns.push({
        dataField: 'ether_amount',
        text: 'Volume',
        classes: 'data-col',
        headerClasses: 'data-col',
        formatter: (cellContent, row) => {
          return (
            <span className='lead transaction-hash'><img src={`${BLOCKCHAIN_LOGO}`} alt={TOKEN_NETWORK} height='30' width='30' /> { numbro(cellContent).format({ thousandSeparated: true, trimMantissa: true, mantissa: 8 }) }</span>
          )
        }
      })
    }

    return (
      <div className='pdt-1x'>
        <PaginationProvider pagination={
            paginationFactory({ custom: true,
                               totalSize: leaderboardData.length })}>
            {
              ({
                paginationProps,
                paginationTableProps
              }) => (
                <div>
                  <div className='responsive-table-overflow-lg'>
                    <BootstrapTable
                      keyField='address'
                      data={leaderboardData}
                      columns={columns}
                      classes='table-dark leaderboard'
                      headerClasses='data-item data-head'
                      noDataIndication='There is no data to display'
                      bordered={ false }
                      {...paginationTableProps} />
                  </div>

                  <div className='row align-items-center justify-content-center'>
                    <div className='col-12 text-left pdt-2x'>
                      <PaginationListStandalone {...paginationProps} />
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
