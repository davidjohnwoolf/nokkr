import {
    FETCH_TEAM,
    FETCH_TEAMS,
    CREATE_TEAM,
    UPDATE_TEAM,
    DELETE_TEAM,
    CLEAR_TEAM
} from '../actions/teams.action';

export default function(state = {}, action) {

    switch (action.type) {
        case FETCH_TEAM:
            return { ...state, team: action.team };
        
        case FETCH_TEAMS:
            return { ...state, teams: action.teams };
        
        case CREATE_TEAM:
            return { ...state, success: true, message: action.message, teamId: action.teamId };
        
        case UPDATE_TEAM:
            return { ...state, success: true, message: action.message };
            
        case DELETE_TEAM:
            return { ...state, success: true, message: action.message, team: null };
            
        case CLEAR_TEAM:
            return {};
            
        default:
            return state;
    }
}