import {
    FETCH_TEAM,
    FETCH_TEAMS,
    CREATE_TEAM,
    UPDATE_TEAM,
    DELETE_TEAM,
    CLEAR_TEAMS
} from '../actions/teams.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_TEAM:
            return { ...state, team: action.payload };
        
        case FETCH_TEAMS:
            return { ...state, teams: action.payload };
        
        case CREATE_TEAM:
            return { ...state, success: true, message: action.message, teamId: action.payload };
        
        case UPDATE_TEAM:
            return { ...state, success: true, message: action.message };
            
        case DELETE_TEAM:
            return { ...state, success: true, deleted: true, message: action.message };
            
        case CLEAR_TEAMS:
            return { ...state, success: false, deleted: false, message: '' };
            
        default:
            return state;
    }
}