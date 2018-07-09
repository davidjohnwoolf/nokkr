import axios from 'axios';

import { sendError } from './flash.action';

export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_TEAM = 'FETCH_TEAM';
export const CREATE_TEAM = 'CREATE_TEAML';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const CLEAR_TEAM = 'CLEAR_TEAM';

//status variables for Jsend API spec
import { SUCCESS, FAIL, ERROR } from '../../lib/constants';

export const fetchTeams = () => {
    return async dispatch => {
        const response = await axios.get('/account/teams');
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: FETCH_TEAMS, teams: response.data.data.teams });
    };
};

export const fetchTeam = id => {
    return async dispatch => {
        const response = await axios.get(`/account/teams/${id}`);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: FETCH_TEAM, team: response.data.data.team });
    };
};

export const createTeam = team => {
    
    return async dispatch => {
        const response = await axios.post('/account/teams', team);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));

        if (response.data.status === SUCCESS) {
            dispatch({
                type: CREATE_TEAM,
                message: response.data.data.message,
                teamId: response.data.data.id
            });
        }
    };
};

export const updateTeam = (id, team) => {
    
    return async dispatch => {
        const response = await axios.put(`/account/teams/${id}`, team);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        if (response.data.status === SUCCESS) {
            dispatch({
                type: UPDATE_TEAM,
                message: response.data.data.message
            });
        }
    };
};

export const deleteTeam = id => {
    
    return async dispatch => {
        const response = await axios.delete(`/account/teams/${id}`);
        
        if (response.data.status === ERROR) dispatch(sendError(response.data.message));
        
        dispatch({ type: DELETE_TEAM, message: response.data.data.message });
    };
};

export const clearTeam = () => {
    return dispatch => {
        dispatch({ type: CLEAR_TEAM });
    };
};