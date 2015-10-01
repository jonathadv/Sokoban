var superagent = require('superagent'),
    URL = 'http://app3.daguerre.com.br/sokoban'



module.exports = function getScoreByLevel(level, fn){
    return(
        superagent.get(URL + '/' + level).
        end(function(err, res){
            if(!err){
                res = JSON.parse(res.text);
            }
        })
    );
};
