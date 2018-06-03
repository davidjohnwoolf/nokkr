import { combineReducers } from 'redux';
import users from './users';
import auth from './auth';
import flash from './flash';

export default combineReducers({
	users,
	auth,
	flash
});