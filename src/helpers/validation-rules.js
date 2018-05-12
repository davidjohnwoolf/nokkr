const validationRules = {
    required: value => value ? undefined : 'Required',
    password: value => {
        return (
            value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(value)
                ? undefined
                : 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
        );
    },
    passwordMatch: () => {
        return (
            document.querySelector('input[name=password]').value === document.querySelector('input[name=passwordConfirmation]').value
                ? undefined
                : 'Passwords must match'
        );
    }
};

export default validationRules;