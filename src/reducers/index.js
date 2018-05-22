import { combineReducers } from 'redux';
import users from './users';
import authentication from './authentication';
import flashMessages from './flash-messages';

export default combineReducers({
	users,
	authentication,
	flashMessages
});