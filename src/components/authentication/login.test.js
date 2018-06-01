import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Dashboard from './login';

configure({ adapter: new Adapter() });

describe('login', () => {
    it('should return undefined', () => {
        /*const wrapper = shallow(<Dashboard />);
        
        expect(wrapper.find('.dashboard h1')).toHaveLength(1);*/
        return undefined;
    });
});