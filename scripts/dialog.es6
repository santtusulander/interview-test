import ReactDOM  from 'react-dom';
import React from 'react';
import { Button }  from 'react-bootstrap';

export default React.createClass({
	propTypes: {
		type  : React.PropTypes.string,
		item  : React.PropTypes.string,
		action: React.PropTypes.func
	},

	handleClick(event) {
		event.preventDefault();
		this.props.action();
	},

	render() {
		return (
			<Button onClick={this.handleClick}>
				edit
			</Button>
		)
	}
});