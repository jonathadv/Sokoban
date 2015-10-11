var superagent = require('superagent'),
    URL = 'http://app3.daguerre.com.br/sokoban/score'



module.exports = {

        getScoreByLevel: function(level, fn){
            return(
                superagent.get(URL + '/' + level).
                end(function(err, res){
                    res = JSON.parse(res.text);
                    fn(res);
                })
            );
    }

}
