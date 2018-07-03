import { combineReducers } from 'redux';
import users from './users.reducer';
import auth from './auth.reducer';
import flash from './flash.reducer';
import areas from './areas.reducer';
import teams from './teams.reducer';

export default combineReducers({
	users,
	auth,
	flash,
	areas,
	teams
});