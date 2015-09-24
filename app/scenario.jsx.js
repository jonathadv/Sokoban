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

		this.enableScoreInputName();

		var matrix = [
			          [1,1,1,1,1,1,1,1],
		              [1,8,8,3,0,3,0,1],
					  [1,8,0,3,0,0,0,1],
					  [1,0,1,0,0,0,4,1],
					  [1,1,1,1,1,1,1,1]
				  ];
		var x = 3;
		var y = 6;
		var win = [[1,1],[1,2],[2,1]];



		return {
				scenario : matrix,
				level : 1,
				pos_x : x,
				pos_y : y,
				moves : 0,
				pushes: 0,
				win : win,

				scenario_history : [],
				x_hist : [],
				y_hist : [],
				move_hist : [],
				pushes_hist : []

			 };
	},

	enableScoreInputName : function(){
		if(document.getElementById('inputPlayer')){
			document.getElementById('inputPlayer').value=''
			document.getElementById('inputPlayer').style=""
			document.getElementById('inputPlayerButton').style=""
		}
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

	getLastState: function(){

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

	hasWon(){
		var scenario = this.state.scenario;
		var treasure = this._TREASURE;
		var win = this.state.win;

		for(var i = 0; i < win.length; i++){
			var coord = win[i]
			var x = coord[0]
			var y = coord[1]

			if(scenario[x][y] != treasure){
				return false;
			}
		}

		return true;
	},

	undo: function(){
		console.log('--- Undo ---')

		if(this.state.scenario_history.length >= 1){

			this.setState(this.getLastState())
			return this.forceUpdate();

		}else{
			this.showMessage('No more history');
		}
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

	update: function(new_x, new_y, new_piece){
		this.state.scenario[new_x][new_y] = new_piece

		if(this.hasWon()){

			setTimeout(function() {
  				this.showScore();
			}.bind(this), 500);

		}
	},

	updateManXY: function(x, y){
		this.state.pos_x = x
		this.state.pos_y = y
		this.state.moves += 1;
	},

	pushObject: function(new_man_x, new_man_y){
		// Get the current man position
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		// Check the object's and man's next position
		var test_x = new_man_x - x;
		var test_y = new_man_y - y;
		var new_obj_x, new_obj_y;

		if(test_x == 0){
			new_obj_x = new_man_x
		}else if(test_x > 0){
			new_obj_x = new_man_x + 1
		}else{
			new_obj_x = new_man_x - 1
		}

		if(test_y == 0){
			new_obj_y = new_man_y
		}else if(test_y > 0){
			new_obj_y = new_man_y + 1
		}else{
			new_obj_y = new_man_y - 1
		}


		var current_man_piece = this.state.scenario[x][y]
		var new_man_piece = this.state.scenario[new_man_x][new_man_y]
		var next_piece = this.state.scenario[new_obj_x][new_obj_y]


		if(next_piece == this._BLANK){

			if(current_man_piece == this._SAVEMAN){
				if(new_man_piece == this._TREASURE){
					this.update(x, y, this._GOAL)
					this.update(new_man_x, new_man_y, this._SAVEMAN)
				}else{
					this.update(x, y, this._GOAL)
					this.update(new_man_x, new_man_y, this._MAN)
				}

			}else{
				this.update(x, y, this._BLANK)
				this.update(new_man_x, new_man_y, this._MAN)
			}


			this.update(new_obj_x, new_obj_y, this._OBJECT)
			this.updateManXY(new_man_x, new_man_y)
			this.state.pushes += 1;
		}

		if(next_piece == this._GOAL){

			if(new_man_piece == this._TREASURE){
				this.update(new_man_x, new_man_y, this._SAVEMAN)
				this.update(x, y, this._BLANK)
				this.update(new_obj_x, new_obj_y, this._TREASURE)

			}else{
				this.update(new_man_x, new_man_y, this._MAN)
				this.update(x, y, this._BLANK)
				this.update(new_obj_x, new_obj_y, this._TREASURE)
			}
			this.updateManXY(new_man_x, new_man_y)

			this.state.pushes += 1;
		}

	},

	updatePosition: function(new_x, new_y){
		this.updateHistory()
		console.log('--- Update ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		var piece = this.state.scenario[new_x][new_y]
		var current = this.state.scenario[x][y]


		if(current ==  this._SAVEMAN && piece ==  this._GOAL){
			this.update(x, y, this._GOAL)
			this.update(new_x, new_y, this._SAVEMAN)
			this.updateManXY(new_x, new_y)

		}else if(current ==  this._SAVEMAN && piece ==  this._BLANK){
			this.update(x, y, this._GOAL)
			this.update(new_x, new_y, this._MAN)
			this.updateManXY(new_x, new_y)

		}else if(piece ==  this._BLANK){
			this.update(x, y, piece)
			this.update(new_x, new_y, this._MAN)
			this.updateManXY(new_x, new_y)

		}else if(piece ==  this._STONE){
			var message = 'You can not go through the stone.';
			this.showMessage(message)

		}else if(piece ==  this._OBJECT || piece == this._TREASURE){
			this.pushObject(new_x, new_y)

		}else if(piece ==  this._GOAL){
			this.update(x, y, this._BLANK)
			this.update(new_x, new_y, this._SAVEMAN)
			this.updateManXY(new_x, new_y)
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

	showScore: function(){
		var popup = document.getElementById('popup');
		var score = document.getElementById('showScore');

		if(popup.style.display == "none" ||
		   popup.style.display == ""){

			console.log('aqui')
			popup.style.display = "block";
			score.value = "Hide Score";

		}else{
			popup.style.display = "none";
			score.value = "Show score";
		}

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
				<div className='scenario'>
					<table className='canvas'>{
							this.state.scenario.map(function(line, i){
								return (
									<tr key={i} className='piece'>{
										line.map(function(column, j){
											return (
												<td key={i + "" + j} className='piece'>
													{this.getComponent(column)}
												</td>
											);
										}.bind(this))
									}</tr>
								);
							}.bind(this))
					}</table>
				</div>
				<br/>
				<div className='buttons'>
					<input type='button' value='up' onClick={this.moveUP}/><br/>
					<input type='button' value='Left' onClick={this.moveLeft}/>
					<input type='button' value='Right' onClick={this.moveRight}/><br/>
					<input type='button' value='Down' onClick={this.moveDown}/><br/><br/>
					<input type='button' value='Reset' onClick={this.resetTheGame}/>
					<input type='button' value='Undo' onClick={this.undo}/><br/><br/>
					<input type='button' id='showScore' value='Show Score' onClick={this.showScore}/>
				</div>
				<div className='message'>{this.state.info}</div>
				<br/><br/>
				<div className='popup' id='popup'><ScoreBoard align='center' value={this.state.pushes}/></div>
				<br/><br/>
			</div>
		)

	}
});

//export default
export default Scenario;
