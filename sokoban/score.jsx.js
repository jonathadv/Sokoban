var React = require('react');
var ScoreService = require('./score-service');
var Loader = require('./loader.jsx')

var ScoreBoard = React.createClass({
	currentLevel : 0,

	componentDidMount: function (){
		
		var level = (this.props.level == undefined) ? 1 : this.props.level

		this.getScoreFromService(level)

	},

	getScoreFromService: function(level) {

		ScoreService.getScoreByLevel(level, function(res){
			var listScore = res.scoreItem
			var score = [];

			listScore.map(function(item){
				score.push([item.name, parseInt(item.moves)])
			}.bind(this));

			return this.setPlayerList(score)

		}.bind(this));

	},

	addScoreService: function(level, name, moves) {
		ScoreService.addScoreByLevel(level, name, moves);
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


	setPlayerList: function(list){
		list.sort(this.Comparator)

		this.setState(function(){
			return{
				playerList: list,
				newPlayer: ''
			}
		})
	},

	handleSubmit: function(){
		if(this.state.newPlayer.length > 0){
			var newPlayerList = this.state.playerList
			var newPlayer = [this.state.newPlayer, this.props.value]

			newPlayerList.push(newPlayer)


			var name = newPlayer[0]
			var moves = newPlayer[1]
			var level = this.props.level

			this.addScoreService(level, name, moves);


			document.getElementById('inputPlayer').value=''
			document.getElementById('inputPlayer').style="display:none;"
			document.getElementById('inputPlayerButton').style="display:none;"

			var playerList = this.state.playerList

			return this.setPlayerList(playerList);

		}
	},

	Comparator: function(a, b){

		if (a[1] < b[1]) return -1;
		if (a[1] > b[1]) return 1;

		return 0;
	},

	getTableContent: function(){
		return this.state.playerList.map(
			function(item, i){
				return(
					<tr key={'tr'+i}>
						<td key={'a'+ i}>{i+1}</td>
						<td key={'b'+ i}>{item[0]}</td>
						<td key={'c'+ i}>{item[1]}</td>
					</tr>
				)})
	},

	showLoading:  function(){
		return (
		<tr key='tr1'>
			<td key='a1'><Loader/></td>
			<td key='a2'><Loader/></td>
			<td key='a3'><Loader/></td>
		</tr>)

	},

	showNameField: function(){
		return (

		<div className="form-inline">
			<input id='inputPlayer' type="text" className="form-control" placeholder="Your Name" onChange={this.handleOnChange}/>
			<button id='inputPlayerButton' type="button" className="btn btn-default" onClick={this.handleSubmit}>Add</button>
		</div>
		)
	},

	render: function(){

		if(this.props.level != undefined &
			this.props.level != this.currentLevel){

			this.currentLevel = this.props.level
			this.getScoreFromService(this.currentLevel)
		}

		return(
			<div className='scoreBoard'>
				<h1><b>Score</b></h1>
				<table className="table">
					<tbody>
					<tr>
						<td className="active"><b>Position</b></td>
						<td className="active"><b>Name</b></td>
						<td className="active"><b># of Pushes</b></td>
					</tr>
					{

					(this.state.playerList.length > 0 && this.getTableContent()) || this.showLoading()

					}
					</tbody></table><br/><br/>

					{
						this.props.nameField && this.showNameField()
					}

				<div id='children'>{this.props.children}</div>

			</div>
		)
	}
});


//export default
export default ScoreBoard;
