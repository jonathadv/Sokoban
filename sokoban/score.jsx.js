var React = require('react');
var ScoreService = require('./score-service');

var ScoreBoard = React.createClass({

	componentDidMount: function (){
		this.getScoreFromService()
	},

	getScoreFromService: function() {
		ScoreService(this.props.level, function(res){
			var listScore = res.scoreItem
			var score = [];

			listScore.map(function(item){
				score.push([item.name, item.moves])
			}.bind(this));

			this.state.playerList = score;

		}.bind(this));

		this.state.playerList.sort(this.Comparator)

		return this.forceUpdate();
	},

	getInitialState: function(){
		var inicialScore = [];

		inicialScore.sort(this.Comparator)

		return{
			playerList: inicialScore,
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

			this.state.playerList.sort(this.Comparator)

			document.getElementById('inputPlayer').value=''
			document.getElementById('inputPlayer').style="display:none;"
			document.getElementById('inputPlayerButton').style="display:none;"
			this.forceUpdate()
		}
	},

	Comparator: function(a, b){

		if (a[1] < b[1]) return -1;
		if (a[1] > b[1]) return 1;

		return 0;
	},

	render: function(){
		return(
			<div className='scoreBoard'>
				<h1>Score</h1>
				<table>
					<tr>
						<td className='scoreTitle2'>Position</td>
						<td className='scoreTitle1'>Name</td>
						<td className='scoreTitle2'># of Pushes</td>
					</tr>
				{
					this.state.playerList.map(
						function(item, i){
							return(
								<tr key={'tr'+i}>
									<td className='scoreNumber' key={'a'+ i}>{i+1}</td>
									<td className='scoreItem' key={'b'+ i}>{item[0]}</td>
									<td className='scoreNumber' key={'c'+ i}>{item[1]}</td>
								</tr>
							)})

				}</table><br/><br/>

  				<input id='inputPlayer' onChange={this.handleOnChange}/>
  				<button id='inputPlayerButton' onClick={this.handleSubmit}>Add</button>

			</div>
		)
	}
});


//export default
export default ScoreBoard;
