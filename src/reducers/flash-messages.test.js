import reducer from './flash-messages';
import { SEND_MESSAGE, CLOSE_MESSAGE } from '../actions/flash-messages/';

describe('flash messages reducer', () => {
    
    it('should return initial state', () => {
        
        expect(reducer(undefined, { type: 'NO MATCH' })).toEqual({});
    });
    
    it('should return message', () => {
        
        expect(reducer(undefined, { type: SEND_MESSAGE, message: 'User created' }))
            .toEqual({ message: 'User created' });
    });
    
    it('should clear message', () => {
        
        expect(reducer({ message: 'User created' }, { type: CLOSE_MESSAGE })).toEqual({});
    });
})