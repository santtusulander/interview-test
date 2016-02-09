import ReactDOM  from 'react-dom';
import uuid      from 'uuid';
import React     from 'react';

import Dialog from './dialog.es6';

import { people, usersToList, gender, maxAge } from '../variables.es6';
import {
	Pagination, Button, ListGroup,
	ListGroupItem, Grid, Row, Col, Input }
from 'react-bootstrap';


ReactDOM.render(
	React.createElement(React.createClass({

		getInitialState() {
			return {
				people         : people(),
				activePage     : 1,
				itemToEdit     : null,
				dialogActive   : false,
				dialogType     : null,
				nameSortOrder  : false,
				ageSortOrder   : false,
				genderSortOrder: false,
				nameField      : '',
				submitDisabled : true,
				submitValid    : null,
				nameValid      : null,
				ageValid       : null,
				genderValid    : null
			}
		},

		sortDesc(item, sortBy) {
			let newState = {
					people: this.state.people.sort(
					(a, b) => {
						if (a[item] > b[item])
							return -1;
						else if (a[item] < b[item])
							return 1;
						return 0;
					}
				)
			}
			newState[sortBy] = !this.state[sortBy]
			this.setState(newState)
		},

		sortAsc(item, sortBy) {
			let newState = {
				people: this.state.people.sort(
					(a, b) => {
						if (a[item] < b[item])
							return -1;
						else if (a[item] > b[item])
							return 1;
						return 0;
					}
				)
			}
			newState[sortBy] = !this.state[sortBy]
			this.setState(newState)
		},

		changePage(event, selectedEvent) {
			this.setState({ activePage: selectedEvent.eventKey });
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

		createUser(e) {
			e.preventDefault();
			let user = {
				gender : this.refs.gender.getValue(),
				age    : this.refs.age.getValue(),
				name   : this.refs.name.getValue()
			}
			let newState = {
				people: this.state.people.set(uuid.v1(), user)
			}
			this.setState(newState);
		},

		sortRouter(attribute, sortBy) {
			if(this.state[sortBy])
				this.sortAsc(attribute, sortBy)
			else
				this.sortDesc(attribute, sortBy)
		},

		toggleDialog(type, itemToEdit) {
			this.setState({
				dialogActive : !this.state.dialogActive,
				dialogType   : type,
				itemToEdit   : itemToEdit
			})
		},

		dialogDismiss() {
			this.setState({ dialogActive: !this.state.dialogActive })
		},

		dialogSubmit(...params) {
			if(params[0])
				this.setState({
					people: this.state.people.set(this.state.itemToEdit, params[0])
				})
			else
				this.setState({
					people: this.state.people.delete(this.state.itemToEdit)
				})
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
				<Input type='select' ref='age'
					bsStyle={this.state.ageValid}
					onChange={this.handleChange}>
					<option disabled hidden selected>Age</option>
					{ options }
				</Input>
			)
		},

		renderPagination() {
			let pages;
			if(this.state.people.size < usersToList)
				pages = 1;
			else if(this.state.people.size % usersToList !== 0)
				pages = Math.ceil(this.state.people.size / usersToList)
			else
				pages = this.state.people.size / usersToList

			return (
				<Row>
					<Col xs={6} xsOffset={3} className='pagination-container'>
						<Pagination
							bsSize='small'
							items={pages}
							activePage={this.state.activePage}
							onSelect={this.changePage} />
					</Col>
				</Row>
			);
		},

		renderList() {
			let iteration = 0
			, startAt   = this.state.activePage * usersToList - usersToList
			, stopAt    = this.state.activePage * usersToList
			, elements  = [];
			this.state.people.forEach((value, key) => {
				if(startAt <= iteration && iteration < stopAt) {
						elements.push(
							<ListGroupItem
								key={key}
								onClick={ e => this.toggleDialog("edit", key) }>
								<Row>
									<Col xs={6}>{ value.name }</Col>
									<Col xs={2} className='list-small-blocks'>
										{ value.gender }
									</Col>
									<Col xs={2} className='list-small-blocks'>
										{ value.age }
									</Col>
									<Col xs={2} className='list-small-blocks'>
										<i
											className='fa fa-times fa-2x'
											onClick={ e => {
												e.stopPropagation();
												this.toggleDialog("delete", key)
											}}/>
									</Col>
								</Row>
							</ListGroupItem>
							)

				}
				iteration++;
			})
			return elements;
		},

		renderSortingRow() {
			return (
				<Row>
					<Col xs={6} >
						<span className='sort-row-span'
							onClick={e => this.sortRouter('name','nameSortOrder')}>
							Name <i className='fa fa-sort'/>
						</span>
					</Col>
					<Col xs={2} className='list-small-blocks'>
						<span className='sort-row-span'
							onClick={e => this.sortRouter('gender','genderSortOrder')}>
							Gender <i className='fa fa-sort'
								onClick={e => this.sortRouter('gender','genderSortOrder')}/>
						</span>
					</Col>
					<Col xs={2} className='list-small-blocks'>
						<span className='sort-row-span'
							onClick={e => this.sortRouter('age','ageSortOrder')}>
							Age <i className='fa fa-sort'/>
						</span>
					</Col>
				</Row>
			)
		},

		renderCreationRow() {
			return (
				<Row>
					<Col xs={6} >
						<Input type='text' ref='name'
							bsStyle={this.state.nameValid}
							onChange={this.handleChange}
							placeholder='Name' hasFeedback/>
					</Col>
					<Col xs={2} className='list-small-blocks'>
						<Input type='select'
							bsStyle={this.state.genderValid}
							onChange={this.handleChange}
							ref='gender'>
							<option disabled hidden selected>Gender</option>
							<option value={gender.MALE}>{gender.MALE}</option>
							<option value={gender.FEMALE}>{gender.FEMALE}</option>
						</Input>
					</Col>
					<Col xs={2} className='list-small-blocks'>
						{this.renderAgeSelect()}
					</Col>
					<Col xs={2} className='list-small-blocks'>
						<Button type='submit'
							bsStyle={this.state.submitValid}
							disabled={this.state.submitDisabled}
							onClick={this.createUser}>
							<i className='fa fa-plus fa-2x'></i>
						</Button>
					</Col>
				</Row>
			)
		},

		render() {
			let dialog = this.state.dialogActive ?
				<Dialog
					type={this.state.dialogType}
					action={this.dialogSubmit}
					dismiss={this.dialogDismiss}
					item={this.state.people.get(this.state.itemToEdit)} />
				: null;
			return (
				<Grid>
					<Row className='header-row'>
						<Col xs={6}>Create user</Col>
					</Row>
					{this.renderCreationRow()}
					{this.renderSortingRow()}
					<ListGroup>
						{this.renderList()}
					</ListGroup>
					{this.renderPagination()}
					{dialog}
				</Grid>
			)
		}

	})),
	document.getElementById('application')
)
