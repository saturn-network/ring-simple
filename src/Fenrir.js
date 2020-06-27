import React, { Component } from 'react'
import { Navbar, NavbarBrand, NavLink, Container, Row, Media } from 'reactstrap'
import { connect } from 'react-redux'
import Notifications from 'react-notification-system-redux';
import { connectNetwork } from './actions'
import { NAV_BRAND_LOGO } from './config'
import OrderBook from './components/OrderBook'
import Trades from './components/Trades'
import Leaderboard from './components/Leaderboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { MAIN_TITLE, MAIN_TEXT, TRADING_COMPETITION_ENABLED } from './config'

class Fenrir extends Component {
  componentDidMount() {
    this.props.connectNetwork()
  }

  render() {
    return (
      <div>
        <Navbar className='bg-default'>
          <NavbarBrand href='/'>
            <Media src={NAV_BRAND_LOGO} height={30} alt='Saturn Network Logo' className='d-inline-block align-top' />
          </NavbarBrand>

          <NavLink href='https://github.com/saturn-network/'><FontAwesomeIcon icon={faGithub} size='lg' color='#fff' /></NavLink>
        </Navbar>

        <Container>
          <div className="col-xl-12 col-lg-12 col-md-12 text-center mt-5">
            <h2 className="page-title">{ MAIN_TITLE }</h2>
            <p className="large">{ MAIN_TEXT }</p>
          </div>

          <OrderBook />

          <Row>
            { TRADING_COMPETITION_ENABLED && <Leaderboard /> }
            <Trades leaderboardEnabled={TRADING_COMPETITION_ENABLED} />
          </Row>
        </Container>

        <Notifications
          notifications={ this.props.notifications } />

        <div className='footer-bar'>
          <div className='container'>
            <div className='row align-items-center justify-content-center'>
              <p>Powered by <a href='https://www.saturn.network'>Saturn Network</a></p>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeAccountAddress: state.network.activeAccountAddress,
    isConnected: state.network.isConnected,
    web3: state.network.web3,
    networkName: state.network.networkName,
    notifications: state.notifications
  }
}

const mapActionCreators = {
  connectNetwork
}

export default connect(mapStateToProps, mapActionCreators)(Fenrir)
