import { combineReducers } from 'redux';
import users from './users.reducer';
import auth from './auth.reducer';
import flash from './flash.reducer';
import areas from './areas.reducer';
import areaGroups from './area-groups.reducer';
import teams from './teams.reducer';
import leads from './leads.reducer';
import leadStatuses from './lead-statuses.reducer';
import leadFields from './lead-fields.reducer';
import account from './account.reducer';

export default combineReducers({
	flash,
	auth,
	users,
	teams,
	areas,
	areaGroups,
	leads,
	leadStatuses,
	leadFields,
	account
});