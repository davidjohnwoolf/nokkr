import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchTeams } from '../../actions/teams.action';

import { SU, ADMIN, MANAGER, USER } from '../../../lib/constants';

class TeamIndex extends React.Component {
    
    constructor(props) {
        super(props);
        
        props.fetchTeams();
    }
	
    renderTeams() {
        const { teams } = this.props;
        
        if (!teams) return;
        
        return (
            teams.map(team => {
                
                return (
                    <li className="cell-container" key={ team._id }>
                        <Link to={ `/teams/${ team._id }` } className="icon-link">
                            { team.title }
                            <i className="fa fa-chevron-right"></i>
                        </Link>
                    </li>
                );
            })
        );
    }
    
    render() {
        
        return (
            <main id="user-index" className="content">
                <section className="index">
                    <header className="content-header">
                        <a onClick={ this.props.history.goBack } href="#" className="icon-button-primary"><i className="fas fa-arrow-left"></i></a>
                        <h1>Team Management</h1>
                        { !this.props.isReadOnly ? <Link className="icon-button-success" to="/teams/new"><i className="fas fa-plus"></i></Link> : '' }
                    </header>

                    <ul className="link-list">
                        { this.renderTeams() }
                    </ul>
                </section>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    teams: state.teams.teams
});


export default connect(mapStateToProps, { fetchTeams })(TeamIndex);