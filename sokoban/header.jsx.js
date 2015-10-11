'use strict';

var React = require('react'),
    Router = require('react-router'),
    Link = Router.Link;

module.exports = React.createClass({
    displayName: 'Header',

    render: function() {
        return (
            <div>
                <div className="panel panel-default">
                    <h1 className='text-center'>
                        <Link to="/">Sokoban</Link>
                    </h1>
                </div>
                <nav className="navbar navbar-default">
                    <Link className='navbar-brand' to="game"> Game </Link>
                    <Link className='navbar-brand' to="score"> Score </Link>
                    <Link className='navbar-brand' to="about"> About </Link>
                </nav>
                <hr />
            </div>
        );
    }
});
