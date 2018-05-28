import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AUTHENTICATED, UNAUTHENTICATED } from '../actions/authentication';

//rename this to just auth and make middleware
export default function authorization(token, store) {
    
    //should you check state before dispatching actions each time?

    
	if (token) {
	    //decode token
		const decoded = jwtDecode(token);
		const currentTime = Date.now() / 1000;
		console.log('authorization');
		
		console.log(decoded);
		console.log(currentTime);
		
		//check exp
		if (currentTime < decoded.exp) {
		    //set auth header
		    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		    store.dispatch({ type: AUTHENTICATED, id: decoded.id });
		    console.log('authorized');
		} else {
		    sessionStorage.removeItem('p2k_token');
		    delete axios.defaults.headers.common['Authorization'];
	        store.dispatch({ type: UNAUTHENTICATED });
	        console.log('not authorized');
		}
        
	} else {
	    delete axios.defaults.headers.common['Authorization'];
	    store.dispatch({ type: UNAUTHENTICATED });
	    
	    console.log('no token');
	}
}