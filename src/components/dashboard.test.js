import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Dashboard from './dashboard';

configure({ adapter: new Adapter() });

describe('dashboard', () => {
    it('should mount', () => {
        const wrapper = shallow(<Dashboard />);
        
        expect(wrapper.find('.dashboard h1')).toHaveLength(1);
        
    });
});