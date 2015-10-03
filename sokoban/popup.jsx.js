var React = require('react');
var Logger = require("./log-util");

var PopUp = React.createClass({


	render: function(){
		return <div className='popup' id='popup'>{this.props.children}</div>
	}


});










//export default
export default PopUp;
