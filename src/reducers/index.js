import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import usersReducer from './users.reducer';

export default combineReducers({
	usersReducer,
	form
});