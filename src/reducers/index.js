import { combineReducers } from 'redux';
import users from './users.reducer';
import auth from './auth.reducer';
import flash from './flash.reducer';

export default combineReducers({
	users,
	auth,
	flash
});