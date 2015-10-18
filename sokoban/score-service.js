var superagent = require('superagent'),
    URL = 'http://app3.daguerre.com.br/rest/sokoban/score'



module.exports = {

        getScoreByLevel: function(level, fn){
            return(
                superagent.get(URL + '/' + level).
                end(function(err, res){
                    res = JSON.parse(res.text);
                    fn(res);
                })
            );
    },


    addScoreByLevel: function(level, name, moves){
        return(
            superagent.post(URL + '/' + level + '/' + name + '/' + moves).
            end(function(err, res){
                console.log('Created')
            })
        );
}


}
