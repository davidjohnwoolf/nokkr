import {
    FETCH_TEAM,
    FETCH_TEAMS,
    CREATE_TEAM_FAIL,
    CREATE_TEAM_SUCCESS,
    UPDATE_TEAM_FAIL,
    UPDATE_TEAM_SUCCESS,
    DELETE_TEAM,
    CLEAR_TEAM
} from '../actions/users.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_TEAM:
            return { ...state, team: action.team };
        
        case FETCH_TEAMS:
            return { ...state, teams: action.teams };
        
        case CREATE_TEAM_FAIL:
            return { ...state, fail: true, message: action.message };
        
        case CREATE_TEAM_SUCCESS:
            return { ...state, success: true, message: action.message };
            
        case UPDATE_TEAM_FAIL:
            return { ...state, fail: true, message: action.message };
        
        case UPDATE_TEAM_SUCCESS:
            return { ...state, success: true, message: action.message };
            
        case DELETE_TEAM:
            return { ...state, message: action.message };
            
        case CLEAR_TEAM:
            return {};
            
        default:
            return state;
    }
}