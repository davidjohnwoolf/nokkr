//helper functions to construct common action creators
import { fetchList, fetchObject, createObject, updateObject, deleteObject, clearReducer } from './helpers';
const { TEAM_PATH } = '../../lib/constants';

export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_TEAM = 'FETCH_TEAM';
export const CREATE_TEAM = 'CREATE_TEAM';
export const UPDATE_TEAM = 'UPDATE_TEAM';
export const DELETE_TEAM = 'DELETE_TEAM';
export const CLEAR_TEAMS = 'CLEAR_TEAMS';

export const fetchTeams = () => {
    return fetchList({ url: TEAM_PATH, type: FETCH_TEAMS });
};

export const fetchTeam = id => {
    return fetchObject({ url: TEAM_PATH + id, type: FETCH_TEAM });
};

export const createTeam = team => {
    return createObject({ url: TEAM_PATH, type: CREATE_TEAM, body: team })
};

export const updateTeam = (id, team) => {
    return updateObject({ url: TEAM_PATH + id, type: UPDATE_TEAM, body: team });
};

export const deleteTeam = id => {
    return deleteObject({ url: TEAM_PATH + id, type: DELETE_TEAM });
};

export const clearTeams = () => {
    return clearReducer({ type: CLEAR_TEAMS });
};