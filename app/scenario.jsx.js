var React = require('react');



var Part = React.createClass({
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
				pos_x : x,
				pos_y : y,
				moves : 0
			 };
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


		return <Part value={item}/>
	},

	resetTheGame: function(message){

		console.log('--- Reset ---')
		this.getInitialState;
		return this.forceUpdate();
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

		console.log('--- Update ---')
		var x = this.state.pos_x;
		var y = this.state.pos_y;

		console.log('cur X: ' + this.state.pos_x + ", cur Y: " + this.state.pos_y)


		var piece = this.state.scenario[new_x][new_y]
		var current = this.state.scenario[x][y]
		console.log('current: ' + current)
		console.log('piece: ' + piece)


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
				<div className='Moves'>Moves Number: {this.state.moves}</div>
				<table>{
						this.state.scenario.map(function(line, i){

							return (
								<tr key={i}>{
									line.map(function(column, j){
										// console.log('x = ' + i)
										// console.log('y = ' + j)
										// console.log('[x,y] = ' + this.state.scenario[i][j])

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
				<div className='buttons'>
					<input type='button' value='up' onClick={this.moveUP}/><br/>
					<input type='button' value='Left' onClick={this.moveLeft}/>
					<input type='button' value='Right' onClick={this.moveRight}/><br/>
					<input type='button' value='Down' onClick={this.moveDown}/><br/><br/>
					<input type='button' value='Reset' onClick={this.resetTheGame}/>
				</div>
				<div className='info'>{this.state.info}</div>
			</div>
		)

	}
});

//export default Person;
export default Scenario;
