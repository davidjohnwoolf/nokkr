import { combineReducers } from 'redux';
import users from './users';
import auth from './auth';
import flashMessages from './flash-messages';

export default combineReducers({
	users,
	auth,
	flashMessages
});