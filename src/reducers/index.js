import { combineReducers } from 'redux';
import users from './users';
import flashMessages from './flash-messages';

export default combineReducers({
	users,
	flashMessages
});