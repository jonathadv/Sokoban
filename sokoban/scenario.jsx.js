var React = require('react');
var ScoreBoard = require('./score.jsx');
var ScoreService = require('./score-service');



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

	stone: "sokoban/img/halfstone.png",
	man: "sokoban/img/man.png",
	saveman: "sokoban/img/saveman.png",
	object: "sokoban/img/object.png",
	treasure:  "sokoban/img/treasure.png",
	blank:  "sokoban/img/blank.png",
	goal:   "sokoban/img/goal.png",
	bg: "sokoban/img/bg.png",


	componentDidMount: function() {
		ScoreService(1, function(res){
			console.log(err, res);
		});
    },

	getInitialState: function(){


		this.startListener();

		var currentLevel = 0;

		var Levels = [
						[
				    		[1,1,1,1,1,1,1,1],
				    		[1,8,8,3,0,3,0,1],
				    		[1,8,0,3,0,0,0,1],
				    		[1,0,1,0,0,0,4,1],
				    		[1,1,1,1,1,1,1,1]
				    	],

						[
							[7,7,7,1,1,1,7,7,7,7,7],
							[7,7,1,1,0,1,7,1,1,1,1],
							[7,1,1,0,0,1,1,1,0,0,1],
							[1,1,0,3,0,0,0,0,0,0,1],
							[1,0,0,0,4,3,0,1,0,0,1],
							[1,1,1,0,3,1,1,1,0,0,1],
							[7,7,1,0,0,1,8,8,0,0,1],
							[7,1,1,0,1,1,8,1,0,1,1],
							[7,1,0,0,0,0,0,0,1,1,7],
							[7,1,0,0,0,0,0,1,1,7,7],
							[7,1,1,1,1,1,1,1,7,7,7]
		    			],

						[
							[7,1,1,7,1,1,1,1,1],
							[1,1,7,1,1,0,8,0,1],
							[1,7,1,1,0,3,8,0,1],
							[7,1,1,0,3,0,0,0,1],
							[1,1,0,3,4,0,1,1,1],
							[1,0,3,0,0,1,1,7,7],
							[1,8,8,0,1,1,7,1,1],
							[1,0,0,0,1,7,1,1,7],
							[1,1,1,1,1,7,1,7,7]
						],

						[
							[7,7,7,7,7,7,7,7,7,7,7,1,1,1,1,1],
							[7,7,7,7,7,7,7,7,7,7,1,1,0,0,0,1],
							[7,7,7,7,7,7,7,7,7,7,1,0,0,0,0,1],
							[7,7,7,7,1,1,1,1,7,7,1,0,3,0,1,1],
							[7,7,7,7,1,0,0,1,1,1,1,3,0,3,1,7],
							[7,7,7,7,1,0,0,0,0,0,3,0,3,0,1,7],
							[7,7,7,1,1,0,1,1,0,3,0,3,0,3,1,7],
							[7,7,7,1,0,0,8,1,0,0,3,0,3,0,1,7],
							[7,7,7,1,0,0,8,1,0,0,0,0,0,0,1,7],
							[1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,7],
							[1,8,8,8,8,0,4,0,0,1,7,7,7,7,7,7],
							[1,8,8,8,8,0,0,0,0,1,7,7,7,7,7,7],
							[1,1,0,0,1,1,1,1,1,1,7,7,7,7,7,7],
							[7,1,1,1,1,7,7,7,7,7,7,7,7,7,7,7],
						]

					];


		var levelProps = this.scanLevel(Levels[currentLevel]);
		var x = levelProps.man_x;
		var y = levelProps.man_y;
		var win = levelProps.game_win;
		var scenarioLevel = levelProps.level;

		return {
				levelList : Levels,
				scenario : scenarioLevel,
				level : currentLevel+1,
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

	scanLevel: function(level){
		var x = 0;
		var y = 0;
		var win = [];

		for(var i = 0; i < level.length; i++){
			for(var j = 0; j < level[0].length; j++){
				var piece = level[i][j]

				if(piece == this._MAN){
					x = i;
					y = j;

				}else if(piece == this._GOAL){
					win.push([i,j]);

				}
			}
		}

		return {
				level : level,
				man_x : x,
			    man_y : y,
			    game_win : win
		        }
	},

	nextLevel: function(){
		console.log('--- nextLevel ---')
		this.hideScore();
		var next_level = this.state.level += 1;
		if(next_level >= this.state.levelList.length){

			this.showMessage('No more levels.');

			return false;
		}

		var currentLevel = this.state.levelList[next_level]
		var levelProps = this.scanLevel(currentLevel);
		var x = levelProps.man_x;
		var y = levelProps.man_y;
		var win = levelProps.game_win;
		var scenarioLevel = levelProps.level;


		this.setState(function(){

			return {
					levelList : this.state.levelList,
					scenario : scenarioLevel,
					level : next_level,
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
			});

			return this.forceUpdate();
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
		}else if(value == 7){
			item = this.bg
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
		console.log('---hasWon ---')
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

	startListener: function(){
		document.onkeydown = function(e) {
			switch (e.keyCode) {
		        case 37:
		            this.moveLeft();
		            break;
		        case 38:
		            this.moveUP();
		            break;
		        case 39:
		            this.moveRight();
		            break;
		        case 40:
		            this.moveDown();
		            break;
				case 27:
					this.undo();
					break;
				case 82:
					this.resetTheGame();
					break;
				case 78:
					this.nextLevel();
					break;
				case 66:
					this.showMessage('Not implemented. :)');
					break;
		    }
		}.bind(this);
	},

	stopListener: function(){
		document.onkeydown = null;
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
				if(current_man_piece == this._SAVEMAN){
					this.update(x, y, this._GOAL)
				}else{
					this.update(x, y, this._BLANK)
				}
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
		console.log('--- moveLeft ---')
		this.state.info = ''
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x, y-1);
	},

	hideScore: function(){
		console.log('--- hideScore ---')

		var popup = document.getElementById('popup');
		var score = document.getElementById('showScore');

		popup.style.display = "none";
		this.startListener();
	},

	showScore: function(){
		console.log('--- showScore ---')

		var popup = document.getElementById('popup');
		var score = document.getElementById('showScore');

		popup.style.display =  "block";
		this.stopListener();
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

					<input type='button' value='Reset'title='Key: [ R ]' onClick={this.resetTheGame}/>
					<input type='button' value='Undo' title='Key: [Esc]' onClick={this.undo}/><br/><br/>
					<input type='button' value='Previus' title='Key: [ B ]' onClick={this.nextLevel}/>
					<input type='button' value='Next' title='Key: [ N ]' onClick={this.nextLevel}/><br/><br/>

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
