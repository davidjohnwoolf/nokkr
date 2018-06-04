import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { CLEAR_AUTH } from '../actions/auth.action';

const authorization = store => next => action => {
	const token = sessionStorage.getItem('token');

	if (token) {
	    //decode token
		const decoded = jwtDecode(token);
		const currentTime = Date.now() / 1000;
		
		//check exp
		if (currentTime < decoded.exp) {
		    //set auth header
		    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

		} else {
			//remove storage and delete auth header and clear auth
		    sessionStorage.removeItem('token');
		    delete axios.defaults.headers.common['Authorization'];
		    
		    store.dispatch({ type: CLEAR_AUTH });
		}
        
	} else {
		
	    delete axios.defaults.headers.common['Authorization'];
	}
	
	next(action);
};

export default authorization;