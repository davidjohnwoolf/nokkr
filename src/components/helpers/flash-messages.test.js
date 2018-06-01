import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { FlashMessage } from './flash-messages';

configure({ adapter: new Adapter() });

describe('flash messages', () => {
    let wrapper;
    
    beforeEach(() => wrapper = shallow(<FlashMessage />));
    
    it('should show message', () => {
        wrapper.setProps({ message: 'User Created' });

        expect(wrapper.find('.flash-message p').text()).toEqual('User Created');
        
    });
    
    it('should hide element', () => {

        expect(wrapper.find('.invisible')).toHaveLength(1);
        
    });
});