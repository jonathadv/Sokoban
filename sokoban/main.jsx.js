var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    Header = require('./header.jsx');

module.exports = React.createClass({
    displayName: 'Main',

    render: function() {
        return (
            <div>
                <Header />
                <RouteHandler />
            </div>
        );
    }
});
