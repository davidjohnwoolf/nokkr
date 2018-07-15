//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';

export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_TEAM = 'FETCH_TEAM';
export const CREATE_TEAM = 'CREATE_TEAM';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const CLEAR_TEAMS = 'CLEAR_TEAMS';

const BASE_URL = '/teams/';

export const fetchTeams = () => {
    return fetchList({ url: BASE_URL, type: FETCH_TEAMS });
};

export const fetchTeam = id => {
    return fetchObject({ url: BASE_URL + id, type: FETCH_TEAM });
};

export const createTeam = team => {
    return createObject({ url: BASE_URL, type: CREATE_TEAM, body: team })
};

export const updateTeam = (id, team) => {
    return updateObject({ url: BASE_URL + id, type: UPDATE_TEAM, body: team });
};

export const deleteTeam = id => {
    return deleteObject({ url: BASE_URL + id, type: DELETE_TEAM });
};

export const clearTeams = () => {
    return clearReducer({ type: CLEAR_TEAMS });
};