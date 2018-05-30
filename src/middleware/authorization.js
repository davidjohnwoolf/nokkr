import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AUTHENTICATED, UNAUTHENTICATED } from '../actions/authentication';

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
			//remove storage and delete auth header
		    sessionStorage.removeItem('token');
		    delete axios.defaults.headers.common['Authorization'];
		}
        
	} else {
		
	    delete axios.defaults.headers.common['Authorization'];
	}
	
	next(action);
};

export default authorization;