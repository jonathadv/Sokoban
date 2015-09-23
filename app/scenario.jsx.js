var React = require('react');
var ScoreBoard = require('./score.jsx');



var Piece = React.createClass({
	render: function(){
		return (
				<img src={this.props.value}/>
			);
	}
});


var Scenario = React.createClass({
	_MAN: 4,
	_SAVEMAN: 5,
	_STONE: 1,
	_BLANK: 0,
	_GOAL: 8,
	_OBJECT: 3,
	_TREASURE: 9,

	stone: "app/img/halfstone.png",
	man: "app/img/man.png",
	saveman: "app/img/saveman.png",
	object: "app/img/object.png",
	treasure:  "app/img/treasure.png",
	blank:  "app/img/blank.png",
	goal:   "app/img/goal.png",


	getInitialState: function(){

		var matrix = [
			          [1,1,1,1,1,1,1,1],
		              [1,8,8,3,0,3,0,1],
					  [1,8,0,3,0,0,0,1],
					  [1,0,1,0,0,0,4,1],
					  [1,1,1,1,1,1,1,1]
				  ];
		var x = 3;
		var y = 6;


		return {
				scenario : matrix,
				level: 1,
				pos_x : x,
				pos_y : y,
				moves : 0,
				pushes: 0,

				scenario_history: [],
				x_hist : [],
				y_hist : [],
				move_hist: [],
				pushes_hist: []

			 };
	},

	copyArray: function(array){


		var new_array = array.slice()
		var count = 0

		array.map(function(i){
			new_array[count] = i.slice()
			count++
		})

		return new_array;

	},


	printArray: function(array){
		array.map(function(i){
			console.log(i)
		})
	},

	printHist: function(){
		for(var i = 0; i<this.scenario_history.length;i++){
			this.printArray(this.scenario_history[i]);
		}
	},

	updateHistory: function(){
		console.log('--- Update History ---')
		var old_hist = this.copyArray(this.state.scenario)
		var old_x = this.state.pos_x
		var old_y = this.state.pos_y
		var old_move = this.state.moves
		var old_pushes = this.state.pushes

		this.state.scenario_history.push(old_hist)
		this.state.x_hist.push(old_x)
		this.state.y_hist.push(old_y)
		this.state.move_hist.push(old_move)
		this.state.pushes_hist.push(old_pushes)
	},

	showScore: function(){
		document.getElementById('popup').style.display = "block";
		document.getElementById('popup').style.top = "100px";
		document.getElementById('popup').style.left = "40%";
	},

	hideScore: function(){
		document.getElementById('popup').style.display = "none";
		document.getElementById('popup').style.top = "100px";
		document.getElementById('popup').style.left = "40%";
	},

	getLast: function(){

		var scenario = this.state.scenario_history.pop()
		var x = this.state.x_hist.pop()
		var y = this.state.y_hist.pop()
		var moves = this.state.move_hist.pop()
		var pushes = this.state.pushes_hist.pop()


		return {
			scenario : scenario,
			pos_x : x,
			pos_y : y,
			moves : moves,
			pushes : pushes
		};
	},

	undo: function(){
		console.log('--- Undo ---')

		if(this.state.scenario_history.length >= 1){

			this.setState(this.getLast())
			return this.forceUpdate();

		}else{
			this.showMessage('No more history');
		}
	},

	getComponent: function(value){
		var item;

		if(value == 0){
			item = this.blank
		}else if(value == 1){
			item = this.stone
		}else if(value == 3){
			item = this.object
		}else if(value == 4){
			item = this.man
		}else if(value == 5){
			item = this.saveman
		}else if(value == 8){
			item = this.goal
		}else if(value == 9){
			item = this.treasure
		}


		return <Piece value={item}/>
	},

	resetTheGame: function(message){
		console.log('--- Reset ---')
		this.setState(this.getInitialState());
		this.state.info = '';
		this.hideScore();
	},


	showMessage: function(message){
		this.state.info = message;
		console.log(message)
		return this.forceUpdate();
	},

	update: function(old_x, old_y, old_piece, new_x, new_y, new_piece){
		this.state.moves += 1;

		this.state.scenario[new_x][new_y] = new_piece
		this.state.scenario[old_x][old_y] = old_piece
		this.state.pos_x = new_x
		this.state.pos_y = new_y
	},

	updatePosition: function(new_x, new_y){
		this.updateHistory()
		console.log('--- Update ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		var piece = this.state.scenario[new_x][new_y]
		var current = this.state.scenario[x][y]


		if(current ==  this._SAVEMAN && piece ==  this._GOAL){
			this.update(x, y, this._GOAL, new_x, new_y, this._SAVEMAN)

		}else if(current ==  this._SAVEMAN && piece ==  this._BLANK){
			this.update(x, y, this._GOAL, new_x, new_y, this._MAN)

		}else if(piece ==  this._BLANK){
			this.update(x, y, piece, new_x, new_y, this._MAN)

		}else if(piece ==  this._STONE){
			var message = 'You can not go through the stone.';
			this.showMessage(message)

		}else if(piece ==  this._OBJECT){


			var test_x = new_x - x;
			var test_y = new_y - y;
			var next_x, next_y;

			if(test_x == 0){
				next_x = new_x
			}else if(test_x > 0){
				next_x = new_x + 1
			}else{
				next_x = new_x - 1
			}

			if(test_y == 0){
				next_y = new_y
			}else if(test_y > 0){
				next_y = new_y + 1
			}else{
				next_y = new_y - 1
			}

			var next_piece = this.state.scenario[next_x][next_y]

			if(next_piece != this._STONE){
				this.update(new_x, new_y, this._MAN, next_x, next_y, this._OBJECT)
				this.update(x, y, this._BLANK, new_x, new_y, this._MAN)
				this.state.pushes += 1;
			}
			if(next_piece == this._GOAL){
				this.update(new_x, new_y, this._MAN, next_x, next_y, this._TREASURE)
				this.update(x, y, this._BLANK, new_x, new_y, this._MAN)
			}

		}else if(piece ==  this._GOAL){
			this.update(x, y, this._BLANK, new_x, new_y, this._SAVEMAN)

		}

		return this.forceUpdate();

	},

	moveUP: function(){
		this.state.info = ''
		console.log('--- moveUP ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x-1, y);
	},

	moveDown: function(){
		this.state.info = ''
		console.log('--- moveDown ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x+1, y);
	},

	moveRight: function(){
		this.state.info = ''
		console.log('--- moveRight ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x, y+1);
	},

	moveLeft: function(){
		this.state.info = ''
		console.log('--- moveLeft ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x, y-1);
	},

	render: function(){

		return (
			<div>
			<div id='preload1'/>
			<div id='preload2'/>
				<div>
					<h1 className='title'>Sokoban</h1>
				</div>
				<div className='info'>
					<span className='info_title'>Level: </span>
					<span className='info_value'>{this.state.level}</span>

					<span className='info_title'>Moves: </span>
					<span className='info_value'>{this.state.moves}</span>

					<span className='info_title'>Pushes: </span>
					<span className='info_value'>{this.state.pushes}</span>
				</div>
				<br/>
				<table className='scenario'>{
						this.state.scenario.map(function(line, i){

							return (
								<tr key={i}>{
									line.map(function(column, j){
										return (
											<td key={i + "" + j}>
												{this.getComponent(column)}
											</td>
										);
									}.bind(this))
								}</tr>
							);
						}.bind(this))
				}</table>
				<br/>
				<div className='buttons'>
					<input type='button' value='up' onClick={this.moveUP}/><br/>
					<input type='button' value='Left' onClick={this.moveLeft}/>
					<input type='button' value='Right' onClick={this.moveRight}/><br/>
					<input type='button' value='Down' onClick={this.moveDown}/><br/><br/>
					<input type='button' value='Reset' onClick={this.resetTheGame}/>
					<input type='button' value='Undo' onClick={this.undo}/><br/><br/>
					<input type='button' value='Show Score' onClick={this.showScore}/>
				</div>
				<div className='message'>{this.state.info}</div>
				<br/><br/>
				<div className='popup' id='popup'><ScoreBoard align='center'/></div>
				<br/><br/>
			</div>
		)

	}
});

//export default
export default Scenario;
