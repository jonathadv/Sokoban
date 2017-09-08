module.exports = {

copyMatrix: function(array){


	var new_array = array.slice()
	var count = 0

	array.map(function(i){
		new_array[count] = i.slice()
		count++
	})

	return new_array;

},


printMatrix: function(array){
	array.map(function(i){
		console.log(i)
	})
},

}
