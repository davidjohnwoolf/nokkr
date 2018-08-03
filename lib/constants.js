module.exports = Object.freeze({
    SUCCESS: 'success',
    FAIL: 'fail',
    ERROR: 'error',
    PW_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/,
    USER: 'user',
    MANAGER: 'manager',
    ADMIN: 'admin',
    SU: 'su',
    ACCOUNT_PATH: '/account/',
    TEAM_PATH: '/teams/',
    USER_PATH: '/users/',
    LEAD_PATH: '/leads/',
    LEAD_STATUS_PATH: '/lead-statuses/',
    AREA_PATH: '/areas/',
    AREA_GROUP_PATH: '/area-groups/',
    FIELD_PATH: '/fields/'
});