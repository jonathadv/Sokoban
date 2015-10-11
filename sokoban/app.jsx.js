var React = require('react'),
	Router = require('react-router'),
    routes = require('./routes.jsx');




//React.render(<SokobanGame/>, document.getElementById('main'));

Router.run(routes, function(Handler) {
    React.render(
        <Handler {...this.props} />,
		document.getElementById('main')
    );
});
