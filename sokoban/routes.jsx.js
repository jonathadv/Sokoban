var React = require('react'),
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute;

var Main = require('./main.jsx'),
	SokobanGame = require('./sokoban-game.jsx'),
	About = require('./about.jsx'),
	Score = require('./score.jsx'),
	NotFoundPage = require('./main.jsx');


module.exports = (
    <Route handler={Main}>
        <DefaultRoute handler={SokobanGame} />
        <Route handler={About} name="about" />
		<Route handler={SokobanGame} name="game" />
        <Route handler={Score} name="score" />
		<Route handler={SokobanGame} name="level" path=":level" />
        <NotFoundRoute handler={NotFoundPage} />
    </Route>
);
