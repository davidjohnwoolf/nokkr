import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchTeams } from '../../actions/teams.action';

import Loading from '../layout/loading';
import ContentHeader from '../layout/content-header';
import IconLink from '../layout/icon-link';

class TeamIndex extends React.Component {
    
    state = { isLoading: true }
    
    componentDidMount() {
        this.props.fetchTeams();
    }
    
    componentDidUpdate() {
        const { props: { teams }, state: { isLoading } } = this;
        
        if (teams && isLoading) this.setState({ isLoading: false });
    }
	
    renderTeams() {
        const { teams } = this.props;
        
        return (
            teams.map(team => {
                
                return (
                    <li key={ team._id }>
                        <Link to={ `/teams/${ team._id }` } className="with-icon">
                            <span>{ team.title }</span>
                            <i className="fas fa-chevron-right"></i>
                        </Link>
                    </li>
                );
            })
        );
    }
    
    render() {
        const { props: { isReadOnly, history }, state: { isLoading } } = this;
        
        if (isLoading) return <Loading />;
        
        return (
            <main id="team-index" className="content">
                <ContentHeader title="Team Management" history={ history } chilrenAccess={ !isReadOnly }>
                    <IconLink type="success" url="/teams/new" icon="plus" />
                </ContentHeader>

                <ul className="link-list">
                    { this.renderTeams() }
                </ul>
            </main>
        );
    }
}

const mapStateToProps = state => ({
    teams: state.teams.teams
});


export default connect(mapStateToProps, { fetchTeams })(TeamIndex);