import { USER, MANAGER } from '../../../lib/constants.js';

export const required = value => value ? undefined : 'Required';

export const requiredExceptAdmin = value => {
    const role = document.querySelector('[name=role]').value;
    
    if ((role === USER) || (role === MANAGER)) {
        return (value ? undefined : 'Required');
    }
    
    return undefined;
};

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

const unique = (value, field, candidates) => candidates.find(c => value === c[field]) ? `${ value } already exists` : undefined;

export const validate = (e, rules, fields, objects) => {
    let formValid = true;
    let error;
    
    //for checkboxes
    if ('checked' in fields[e.target.name]) {
        fields[e.target.name].checked = e.target.checked;
        
        //handle target rules
        rules[e.target.name].forEach(rule => {
            
            let result = rule(e.target.checked);
            
            if (result) error = result;
    
            fields[e.target.name].error = error;
        });
    }
    
    //for other inputs
    if ('value' in fields[e.target.name]) {
        fields[e.target.name].value = e.target.value;
        
        //handle target rules
        rules[e.target.name].forEach(rule => {
            let result;
            
            if (rule === 'unique') {
                result = unique(e.target.value, e.target.name, objects);
            } else {
                result = rule(e.target.value);
            }
            
            if (result) error = result;
    
            fields[e.target.name].error = error;
        });
    }
    
    //handle all rules
    for (let key in fields ) {

        //run function for the rule (e.g. required) from validation rules on each field value
        rules[key].forEach(rule => {
            
            if ('checked' in fields[key]) {
                if (rule(fields[key].checked)) formValid = false;
            }
            
            if ('value' in fields[key]) {
                if (rule === 'unique') {
                    if (unique(fields[key].value, key, objects)) formValid = false;
                } else {
                    if (rule(fields[key].value)) formValid = false;
                }
            }
            
        });
    }
    
    return { fields, formValid };
};