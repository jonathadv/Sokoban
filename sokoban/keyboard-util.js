module.exports = {

	_UP : 38,
	_DOWN : 40,
	_LEFT : 37,
	_RIGHT : 39,
	_ESC : 27,
	_R : 82,
	_N : 78,
	_B : 66,

	startKeyListener: function(mainLogic){
		document.onkeydown = function(e) {
			switch (e.keyCode) {
		        case this._LEFT:
		            mainLogic.moveLeft();
		            break;
		        case this._UP:
		            mainLogic.moveUP();
		            break;
		        case this._RIGHT:
		            mainLogic.moveRight();
		            break;
		        case this._DOWN:
		            mainLogic.moveDown();
		            break;
				case this._ESC:
					mainLogic.undo();
					break;
				case this._R:
					mainLogic.resetTheGame();
					break;
				case this._N:
					mainLogic.nextLevel();
					break;
				case this._B:
					mainLogic.previusLevel();
					break;
		    }
		}.bind(this);
	},

	stopKeyListener: function(){
		document.onkeydown = null;
	}

}
