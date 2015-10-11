var React = require('react');
var ScoreBoard = require('./score.jsx');
var PopUp = require('./popup.jsx');
var Levels = require("./level-list");
var MatrixUtils = require("./matrix-utils");
var Logger = require("./log-util");

var BoardPiece = React.createClass({
	render: function(){
		return (
				<img src={this.props.value}/>
			);
	}
});


var SokobanGame = React.createClass({
	_MAN: 4,
	_SAVEMAN: 5,
	_STONE: 1,
	_BLANK: 0,
	_GOAL: 8,
	_OBJECT: 3,
	_TREASURE: 9,

	stone: "sokoban/assets/img/halfstone.png",
	man: "sokoban/assets/img/man.png",
	saveman: "sokoban/assets/img/saveman.png",
	object: "sokoban/assets/img/object.png",
	treasure:  "sokoban/assets/img/treasure.png",
	blank:  "sokoban/assets/img/blank.png",
	goal:   "sokoban/assets/img/goal.png",
	bg: "sokoban/assets/img/bg.png",


	getInitialState: function(){
		this.startListener();

		var currentLevel = 1;

		return this.launchLevel(currentLevel);

	},

	launchLevel: function(newLevel){
		Logger.log('--- launchLevel ---')

		var levelProps = this.createLevel(Levels.getLevel(newLevel));
		var x = levelProps.man_x;
		var y = levelProps.man_y;
		var win = levelProps.game_win;
		var scenarioLevel = levelProps.level;

//		MatrixUtils.printMatrix(scenarioLevel);

		return {
				levelList : Levels,
				scenario : scenarioLevel,
				level : newLevel,
				pos_x : x,
				pos_y : y,
				moves : 0,
				pushes: 0,
				win : win,

				scenario_history : [],
				x_hist : [],
				y_hist : [],
				move_hist : [],
				pushes_hist : [],

				popupVisible: 'false'

			 };
	},

	createLevel: function(level){
		Logger.log('--- createLevel ---')

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
		Logger.log('--- nextLevel ---')
		this.hideScore();

		var next_level = this.state.level += 1;

		if(next_level > Levels.size()){

			this.showMessage('No more levels.');

			return false;

		}else{
			Logger.log('Next Level available is ' + next_level);
		}

		return this.setState(this.launchLevel(next_level));

	},

	previusLevel: function(){
		Logger.log('--- previusLevel ---')

		var prev_level = this.state.level - 1;

		if(prev_level < 1){

			this.showMessage('You are alredy in the first level.');

		}else{
			Logger.log('Backing to level ' + prev_level);
			return this.setState(this.launchLevel(prev_level));
		}


	},


	enableScoreInputName : function(){
		if(document.getElementById('inputPlayer')){
			document.getElementById('inputPlayer').value=''
			document.getElementById('inputPlayer').style=""
			document.getElementById('inputPlayerButton').style=""
		}
	},



	convertComponent: function(value){
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

		return <BoardPiece value={item}/>
	},

	updateHistory: function(){
		Logger.log('--- Update History ---')
		var old_hist = MatrixUtils.copyMatrix(this.state.scenario)
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
		Logger.log('---hasWon ---')
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
		Logger.log('--- Undo ---')

		if(this.state.scenario_history.length >= 1){

			return this.setState(this.getLastState())

		}else{
			this.showMessage('No more history');
		}
	},

	resetTheGame: function(message){
		Logger.log('--- Reset ---')

		var currentLevel = this.state.level

		this.setState(this.launchLevel(currentLevel));
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
		Logger.log(message)
	},

	hideScore: function(){
			Logger.log('--- hideScore ---')

			var popup = document.getElementById('popup');

			popup.style.display = "none";

			this.startListener();
	},

	showScore: function(){
			Logger.log('--- showScore ---')

			var popup = document.getElementById('popup');

			popup.style.display =  "block";

			this.stopListener();
	},

	update: function(new_x, new_y, new_piece){
		Logger.log('--- update ---')
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
		Logger.log('--- Update ---')
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

		var newScenario = this.state.scenario

		return this.setState(
			function(){
				return {
					scenario : newScenario
				}
			}
		);

	},

	moveUP: function(){
		this.state.info = ''
		Logger.log('--- moveUP ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x-1, y);
	},

	moveDown: function(){
		this.state.info = ''
		Logger.log('--- moveDown ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x+1, y);
	},

	moveRight: function(){
		this.state.info = ''
		Logger.log('--- moveRight ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x, y+1);
	},

	moveLeft: function(){
		Logger.log('--- moveLeft ---')
		this.state.info = ''
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		this.updatePosition(x, y-1);
	},

	render: function(){
		return (
			<div className="container-fluid">
			<div id='preload1'/>
			<div id='preload2'/>
			<div id='preload3'/>
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
					<table className='canvas'>
					<tbody>{

							this.state.scenario.map(function(line, i){
								return (
									<tr key={i} className='piece'>{
										line.map(function(column, j){
											return (
												<td key={i + "" + j} className='piece'>
													{this.convertComponent(column)}
												</td>
											);
										}.bind(this))
									}</tr>
								);
							}.bind(this))

					}</tbody>
					</table>
				</div>
				<br/>
				<div className='buttons'>

					<input type='button' value='Reset'className='btn btn-danger' title='Key: [ R ]' onClick={this.resetTheGame}/>
					<input type='button' value='Undo' className='btn btn-danger' title='Key: [Esc]' onClick={this.undo}/><br/><br/>
					<input type='button' className='btn btn-danger' value='Previus' title='Key: [ B ]' onClick={this.previusLevel}/>

				</div>

				<br/><div className='message'>{this.state.info}</div>


				<PopUp>
					<ScoreBoard align='center' level={this.state.level} value={this.state.pushes}>
						<input type='button' className='button' value='Next Level' title='Key: [ N ]' onClick={this.nextLevel}/>
					</ScoreBoard>

				</PopUp>

			</div>
		)

	}
});

//export default
export default SokobanGame;
