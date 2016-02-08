import uuid      from 'uuid';
import immutable from 'immutable';
import ReactDOM  from 'react-dom';
import React from 'react';
import Dialog from './dialog.es6';

import {
	Pagination, Button, ListGroup, ListGroupItem, Grid, Row, Col
} from 'react-bootstrap';

let people  = immutable.Map();
let gender = { Male: 'Male', Female: 'Female' };
let names = [
	'Donald Duck',
	'Minnie Mouse',
	'Goofy',
	'Mickey Mouse',
	'Uncle Scrooge',
	'Hewey',
	'Lewey',
	'Dewey'
]

const peopleCount = 10;
const usersToList = 5;

ReactDOM.render(
	React.createElement(React.createClass({

		getInitialState() {

			/**
			 * Populate the people map, identifying each item by a uuid
			 */
			while(people.size < peopleCount) {
				people = people.set(uuid.v1(), {
					age    : Math.floor((Math.random() * 100) + 10),
					name   : names[Math.floor((Math.random() * names.length))]
				})
			}
			return {
				people         : people,
				activePage     : 1,
				itemToEdit     : null,
				dialogActive   : false,
				dialogType     : null,
				nameSortOrder  : false,
				ageSortOrder   : false,
				genderSortOrder: false
			}
		},

		sortDesc(item, sortState) {
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
			newState[sortState] = !this.state[sortState]
			this.setState(newState)
		},

		sortAsc(item, sortState) {
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
			newState[sortState] = !this.state[sortState]
			this.setState(newState)
		},

		handleSelect(event, selectedEvent) {
			this.setState({ activePage: selectedEvent.eventKey });
		},

		renderSortingRow() {
			return (
				<Row style={{ margin: 0 }}>
					<Col xs={6} >
						Name <i className="fa fa-sort"
								onClick={e => this.sortRouter('name','nameSortOrder')}/>
					</Col>
					<Col xs={2} className='list-small-blocks'>
						Gender <i className="fa fa-sort"
								onClick={e => this.sortRouter('gender','genderSortOrder')}/>
					</Col>
					<Col xs={2} className='list-small-blocks'>
						Age <i className="fa fa-sort"
								onClick={e => this.sortRouter('age','ageSortOrder')}/>
					</Col>
				</Row>
			)
		},

		sortRouter(attribute, stateVar) {
			if(this.state[stateVar])
				this.sortAsc(attribute, stateVar)
			else
				this.sortDesc(attribute, stateVar)
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
								onClick={ e => {if(e)this.toggleDialog('edit', key)} }>
								<Row>
									<Col xs={6} >{ value.name }</Col>
									<Col xs={2} className='list-small-blocks'>Gender</Col>
									<Col xs={2} className='list-small-blocks'>
										{ value.age }
									</Col>
									<Col xs={2} className='list-small-blocks'>
										<i className="fa fa-times fa-2x"
											onClick={
												e => {if(e)this.toggleDialog('delete', key)}
										} />
									</Col>
								</Row>
							</ListGroupItem>
							)

				}
				iteration++;
			})
			return elements;
		},

		toggleDialog(dialogType, itemToEdit) {
			this.setState({
				dialogActive : !this.state.dialogActive,
				type         : dialogType,
				itemToEdit   : itemToEdit
			})
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
							bsSize="small"
							items={pages}
							activePage={this.state.activePage}
							onSelect={this.handleSelect} />
					</Col>
				</Row>
			);
		},

		dialogSubmit(...params) {
			if(params[0])
				this.setState({
					dialogActive: !this.state.dialogActive,
					people: this.state.people.set(this.state.itemToEdit, params[0])
				})
			else
				this.setState({
					dialogActive: !this.state.dialogActive,
					people: this.state.people.delete(this.state.itemToEdit)
				})
		},

		render() {
			let dialog = this.state.dialogActive ?
				<Dialog type={this.state.dialogType} action={this.dialogSubmit} />
				: null;
			return (
				<Grid>
					<Col xs={10}>
						{this.renderSortingRow()}
						<ListGroup>
							{this.renderList()}
						</ListGroup>
						{this.renderPagination()}
						{dialog}
					</Col>
				</Grid>
			)
		}

	})),
	document.getElementById('application')
)
