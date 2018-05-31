export const required = value => value ? undefined : 'Required';

export const password = value => {
    return (
        (!value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,24}/.test(value))
            ? undefined
            : 'Password must contain 8-24 characters including a number, an uppercase and lowercase letter, and a special character'
    );
};

export const passwordMatch = () => {
    return (
        document.querySelector('[name=password]').value === document.querySelector('[name=passwordConfirmation]').value
            ? undefined : 'Passwords must match'
    );
};

export const validate = (e, rules, fields) => {
    let formValid = true;
    let error;
    
    //handle all rules
    for (let key in fields ) {
        rules[key].forEach(rule => {
            if (rule(fields[key].value)) formValid = false;
        });
    }
    
    //handle target rules
    rules[e.target.name].forEach(rule => {
        
        let result = rule(e.target.value);
        
        if (result) error = result;

        fields[e.target.name].error = error;
    });

    fields[e.target.name].value = e.target.value;
    
    return { fields, formValid };
};