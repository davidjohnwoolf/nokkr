/*const { AUTHENTICATED, UNAUTHENTICATED } = '../../actions/authentication';

export default authorize = store => next => action => {
  const token = sessionStorage.getItem('p2k_token');

    if (token) {
        //update state to authenticated
        store.dispatch({ type: AUTHENTICATED });
    } else {
        //update state to not authenticated
        store.dispatch({ type: UNAUTHENTICATED });
    }
}*/