import ReactDOM  from 'react-dom';
import React from 'react';
import { Button, Input, Grid, Col }  from 'react-bootstrap';
import { maxAge, gender } from '../variables.es6';

export default React.createClass({
	propTypes: {
		type  :  React.PropTypes.string,
		item  :  React.PropTypes.object,
		action:  React.PropTypes.func,
		dismiss: React.PropTypes.func
	},

	submit(event) {
		event.preventDefault();
		if(this.props.type ==="edit")
			this.props.action({
				name: this.capitalize(this.refs.name.getValue()),
				age: this.refs.age.getValue()
			});
		else this.props.action();
		this.props.dismiss();
	},

	capitalize(str) {
		return str.toLowerCase().replace(
				/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
				letter => {return letter.toUpperCase()}
		);
	},

	renderSelect() {
		let options = [];
		while(options.length < maxAge){
			options.push(
				<option
					key={options.length}
					value={options.length}>
					{options.length}
				</option>
			)
		}
		return (
			<Input ref='age' type='select' defaultValue={this.props.item.age}>
				{ options }
			</Input>
		)
	},

	renderForm() {
		if(this.props.type === "edit") {
			return (
				<Col xs={6} className='dialog-window'>
					<Input type='text' ref='name' placeholder={this.props.item.name}/>
					{this.renderSelect()}
					<Input type='select' ref='gender' defaultValue={this.props.item.gender}>
						<option value={gender.MALE}>{gender.MALE}</option>
						<option value={gender.FEMALE}>{gender.FEMALE}</option>
					</Input>
					<Button onClick={this.submit}>
						edit
					</Button>
					<Button onClick={this.props.dismiss}>
						cancel
					</Button>
				</Col>
			);
		}
		return (
			<Col xs={6} className='dialog-window'>
				Do you really wish to delete this item?
				<Button onClick={this.submit}>
					remove
				</Button>
				<Button onClick={this.props.dismiss}>
					cancel
				</Button>
			</Col>
		);
	},

	render() {
		return (
			<div className='dialog-overlay'>
				{this.renderForm()}
			</div>
		)
	}
});