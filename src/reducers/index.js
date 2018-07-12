import { combineReducers } from 'redux';
import users from './users.reducer';
import auth from './auth.reducer';
import flash from './flash.reducer';
import areas from './areas.reducer';
import areaGroups from './area-groups.reducer';
import teams from './teams.reducer';

export default combineReducers({
	flash,
	auth,
	users,
	teams,
	areas,
	areaGroups
});