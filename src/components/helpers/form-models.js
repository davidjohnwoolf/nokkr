import { required, unique } from './forms';
import stateArray from './state-array';

export const LEAD_FORM_MODEL = Object.freeze([
    {
        name: 'leadStatusId',
        label: 'status',
        type: 'select',
        rules: [required],
        options: [],
        value: '',
        error: ''
    },
    {
        name: 'firstName',
        label: 'first name',
        type: 'text',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'lastName',
        label: 'last name',
        type: 'text',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'address',
        label: 'address',
        type: 'text',
        rules: [required, unique],
        value: '',
        error: ''
    },
    {
        name: 'city',
        label: 'city',
        type: 'text',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'state',
        label: 'state',
        type: 'select',
        rules: [required],
        options: stateArray,
        value: '',
        error: ''
    },
    {
        name: 'zipcode',
        label: 'zipcode',
        type: 'text',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'primaryPhone',
        label: 'home phone',
        type: 'tel',
        value: '',
        error: ''
    },
    {
        name: 'secondaryPhone',
        label: 'cell phone',
        type: 'tel',
        value: '',
        error: ''
    },
    {
        name: 'userId',
        label: 'assigned user',
        type: 'select',
        rules: [required],
        options: [],
        value: '',
        error: ''
    },
    {
        name: 'areaId',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'lat',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'createdBy',
        rules: [required],
        value: '',
        error: ''
    },
    {
        name: 'lng',
        rules: [required],
        value: '',
        error: ''
    }
]);