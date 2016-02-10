import uuid      from 'uuid';
import immutable from 'immutable';

const gender = { MALE: 'Male', FEMALE: 'Female' };
const names = [
	'Donald Duck',
	'Minnie Mouse',
	'Goofy',
	'Mickey Mouse',
	'Uncle Scrooge',
	'Hewey',
	'Lewey',
	'Dewey'
]

const regExp      = /^[a-zA-ZäÄåÅöÖ ]+$/;
const peopleCount = 10;
const usersToList = 5;
const maxAge      = 100;

let capitalize = (str) => {
	return str.toLowerCase().replace(
			/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g,
			letter => {return letter.toUpperCase()}
	);
}

/**
 * Populate the people map, identifying each item by a uuid
 */
let people = () => {
	let items  = immutable.Map();
	while(items.size < peopleCount) {
		items = items.set(uuid.v1(), {
			age    : Math.floor(Math.random() * maxAge),
			name   : names[Math.floor((Math.random() * names.length))],
			gender : gender[
						Object.keys(gender)[
							Math.floor(
								Math.random() * Object.keys(gender).length
							)
						]
					]
		})
	}
	return items;
}

export { usersToList, people, maxAge, gender, regExp, capitalize }