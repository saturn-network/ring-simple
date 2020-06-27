import React from 'react'
import hashicon from 'hashicon'

class Hashicon extends React.Component {
  componentDidMount(){
    let {hash, size} = this.props
    let canvasContainer = this.refs['canvasHashicon ' + this.props.className]

    canvasContainer.appendChild(hashicon(hash, size))
  }

  render(){
    return (
      <div style={{...this.props.style}} className={'identicon ' + this.props.className}>
        <div ref={`canvasHashicon ${this.props.className}`}></div>
      </div>
    )
  }
}

export default Hashicon