import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

export const notAuthorized = ({ role, managerOwn, userOwn, sessionTeam, sessionId, team, id }) => {
    switch (role) {
        case SU:
            return undefined;
            
        case ADMIN:
            return undefined;
            
        case MANAGER:
            return managerOwn
                ? (sessionTeam === team ? undefined : true)
                : undefined;
            
        case USER:
            return userOwn
                ? (sessionId === id ? undefined : true)
                : undefined;
        
        default:
            return undefined
    }
}

/*
const authParams = {
    role,
    sessionTeam,
    sessionId,
    managerOwn: true,
    userOwn: true,
    team: user.team,
    id: user._id
}

if (notAuthorized(authParams)) return history.push('/not-authorized');

*/