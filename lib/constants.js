module.exports = Object.freeze({
    SUCCESS: 'success',
    FAIL: 'fail',
    ERROR: 'error',
    PW_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/,
    USER: 'user',
    MANAGER: 'manager',
    ADMIN: 'admin',
    SU: 'su'
});