'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'About',

    render: function() {
        return (
            <div className="jumbotron">
              <h1>About Sokoban</h1>
              <br/><br/><br/>
              <p>Sokoban game based on KSokoban by Anders Widell.</p>
              <p>This version uses the same graphics and levels of original KSokoban and it is written using React.</p>

              <p><a className="btn btn-primary btn-lg" href="https://github.com/jonathadv/Sokoban" role="button">Source Code</a></p>
              <br/><br/><br/>
            </div>
        );
    }
});
