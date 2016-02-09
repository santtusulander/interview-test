import ReactDOM  from 'react-dom';
import React from 'react';
import { Button, Input, Grid, Col, Row }  from 'react-bootstrap';
import { maxAge, gender } from '../variables.es6';

export default React.createClass({
	propTypes: {
		type  :  React.PropTypes.string,
		item  :  React.PropTypes.object,
		action:  React.PropTypes.func,
		dismiss: React.PropTypes.func
	},

	getInitialState() {
		return {
			nameField      : '',
			submitDisabled : true,
			submitValid    : null,
			nameValid      : null,
			ageValid       : null,
			genderValid    : null
		}
	},

	submit(event) {
		event.preventDefault();
		if(this.props.type ==="edit")
			this.props.action({
				name  : this.capitalize(this.refs.name.getValue()),
				age   : this.refs.age.getValue(),
				gender: this.refs.gender.getValue()
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

	renderAgeSelect() {
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

	validationState() {
		let nameValid   = null;
		let length      = this.refs.name.getValue().length;
		let genderValid = this.refs.gender.getValue() !== 'Gender' ? 'success' : null;
		let ageValid    = this.refs.age.getValue()    !== 'Age'    ? 'success' : null;
		if(length > 5)      nameValid = 'success';
		else if(length > 0) nameValid = 'warning';

		let submitValid = ageValid && genderValid && nameValid === 'success' ?
			'success' : 'warning';
		let submitDisabled = submitValid !== 'success';
		return { submitValid, nameValid, submitDisabled, ageValid, genderValid }
	},

	handleChange() {
		this.setState( this.validationState() );
	},

	renderForm() {
		if(this.props.type === "edit") {
			return (
				<div className='dialog-window'>
					<Row>
						<Col xs={6} >
							<Input type='text' ref='name'
								bsStyle={this.state.nameValid}
								onChange={this.handleChange}
								placeholder={this.props.item.name}
								hasFeedback/>
						</Col>
						<Col xs={2} className='list-small-blocks'>
							<Input type='select'
								defaultValue={this.props.item.gender}
								bsStyle={this.state.genderValid}
								onChange={this.handleChange}
								ref='gender'>
								<option value={gender.MALE}>{gender.MALE}</option>
								<option value={gender.FEMALE}>{gender.FEMALE}</option>
							</Input>
						</Col>
						<Col xs={2} className='list-small-blocks'>
							{this.renderAgeSelect()}
						</Col>
					</Row>
					<Row style={{ textAlign: 'center' }}>
						<div>
							<Button onClick={this.submit}>
								EDIT
							</Button>
							<Button onClick={this.props.dismiss}>
								CANCEL
							</Button>
						</div>
					</Row>
				</div>
			);
		}
		return (
			<div className='dialog-window'>
				Do you really wish to delete this item?
				<Row>
					<Button onClick={this.submit}>
						remove
					</Button>
					<Button onClick={this.props.dismiss}>
						cancel
					</Button>
				</Row>
			</div>
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