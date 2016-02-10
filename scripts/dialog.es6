import ReactDOM  from 'react-dom';
import React from 'react';
import { Button, Input, Grid, Col, Row }  from 'react-bootstrap';
import { maxAge, gender, regExp, capitalize } from '../variables.es6';

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
			nameValid      : null
		}
	},

	submit(event) {
		event.preventDefault();
		if(this.props.type === "edit")
			this.props.action({
				name  : capitalize(this.refs.name.getValue()),
				age   : this.refs.age.getValue(),
				gender: this.refs.gender.getValue()
			});
		else this.props.action();
		this.props.dismiss();
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
			<Input ref='age' type='select'
				defaultValue={this.props.item.age}>
				{ options }
			</Input>
		)
	},

	validationState() {
		let nameValid   = null;
		let name        = this.refs.name.getValue();
		if(regExp.test(name)) {
			if(name.length > 5)      nameValid = 'success';
			else if(name.length > 0) nameValid = 'warning';
		}
		else if(!regExp.test(name))
			nameValid = 'warning';
		let submitDisabled = nameValid !== 'success';
		return { nameValid, submitDisabled }
	},

	handleChange() {
		this.setState( this.validationState() );
	},

	renderForm() {
		if(this.props.type === "edit") {
			return (
				<div className='dialog-window'>
					<h2 className='dialog-header'>
						Edit person
					</h2>
					<Row className='dialog-paragraph'>
						<Col xs={6} >
							<Input type='text' ref='name'
								bsStyle={this.state.nameValid}
								onChange={this.handleChange}
								placeholder={this.props.item.name}
								hasFeedback/>
						</Col>
						<Col xs={3} className='list-small-blocks'>
							<Input type='select'
								defaultValue={this.props.item.gender}
								ref='gender'>
								<option value={gender.MALE}>{gender.MALE}</option>
								<option value={gender.FEMALE}>{gender.FEMALE}</option>
							</Input>
						</Col>
						<Col xs={2} className='list-small-blocks'>
							{this.renderAgeSelect()}
						</Col>
					</Row>
					<Row className='dialog-button-row'>
						<Button
							disabled={this.state.submitDisabled}
							onClick={this.submit}
							bsClass='dialog-button-submit'>
							EDIT
						</Button>
						<Button
							onClick={this.props.dismiss}
							bsClass='dialog-button-cancel'>
							CANCEL
						</Button>
					</Row>
				</div>
			);
		}
		return (
			<div className='dialog-window'>
				<h2 className='dialog-header'>
					Remove person
				</h2>
				<p className='dialog-paragraph'>
					Are you sure you want to remove this entry?
				</p>
				<Row className='dialog-button-row'>
					<Button bsClass='dialog-button-submit' onClick={this.submit}>
						REMOVE
					</Button>
					<Button bsClass='dialog-button-cancel' onClick={this.props.dismiss}>
						CANCEL
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