var React = require('react');

var ScoreBoard = React.createClass({

	getInitialState: function(){
		return{
			playerList: [['Seu Brarriga', 10], ['Seu Madruga',5]],
			newPlayer: ''
		}
	},

	handleOnChange: function(e){
		//this.state.playerList.push(item)
		this.state.newPlayer = e.target.value

	},

	handleSubmit: function(){
		if(this.state.newPlayer.length > 0){
			var nextItems = this.state.playerList.concat([[this.state.newPlayer, this.props.value]]);

			this.state.playerList = nextItems;
			this.state.newPlayer = '';
			this.forceUpdate()
			document.getElementById('inputPlayer').value=''
			document.getElementById('inputPlayer').style="display:none;"
			document.getElementById('inputPlayerButton').style="display:none;"
		}
	},

	render: function(){
		return(
			<div className='scoreBoard'>
				<h1>Score</h1>
				<table className='scoreBoard'>
					<tr>
						<td className='scoreTitle'>Name</td>
						<td className='scoreTitle'>Score</td>
					</tr>
				{

					this.state.playerList.map(
						function(item, i){
							return(
								<tr>
									<td className='scoreItem' key={'a'+ i}>{item[0]}</td>
									<td className='scoreItem' key={'b'+ i}>{item[1]}</td>
								</tr>
							)})

				}</table><br/><br/>

  				<input id='inputPlayer' onChange={this.handleOnChange}/>
  				<button id='inputPlayerButton'onClick={this.handleSubmit}>Add</button>

			</div>
		)
	}
});


//export default
export default ScoreBoard;
