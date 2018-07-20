import React from 'react';
import { Link } from 'react-router-dom';

import { getBounds, createMap, setArea, setPosition, locationError } from '../helpers/maps';
import { AREA_PATH, USER } from '../../../lib/constants';

import Modal from '../layout/modal';

//can you write your own react style listeners for maps?

class Map extends React.Component {
    
	constructor(props) {
        super(props);
        
        this.state = {
            locationActive: false,
            settingsModalShown: false,
            overlayShown: true,
            mapType: 'roadmap',
            isInitialized: false,
            settingPosition: false,
            positionMarker: null,
            map: null,
            areaPolygon: null,
            outerPolygon: null
        };
        
        
        this.toggleProp = this.toggleProp.bind(this);
        this.setMapType = this.setMapType.bind(this);
        this.goToArea = this.goToArea.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        
        //maps no longer supports getBounds so we build our own function
        window.google.maps.Polygon.prototype.getBounds = getBounds(window.google.maps);
    }
    
    componentDidMount() {
        //component must be mounted to reference the map element
        this.setState({ map: createMap(window.google.maps) });
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { areas, id },
            state: { map, mapType, overlayShown, isInitialized }
        } = this;
        
        if (!isInitialized) {
            
            this.state.map.addListener('click', () => {
                console.log('click');
            });
            
            this.setState({ isInitialized: true, ...setArea({ googleMaps: window.google.maps, map, id, areas }) });
        }
        
        if (prevState.mapType !== mapType) this.state.map.setMapTypeId(mapType);
        
        if (prevProps.id !== this.props.id) {
            //clear current overlay
            this.state.outerPolygon.setMap(null);
            
            this.setState(setArea({ googleMaps: window.google.maps, map, id, areas }));
        }
        
        if (prevState.overlayShown !== overlayShown) {
            overlayShown
                ? this.state.outerPolygon.setOptions({ fillOpacity: .5 })
                : this.state.outerPolygon.setOptions({ fillOpacity: 0 });
        }
    }
    
    setLocation() {
        const { state: { map, positionMarker, positionWatcher } } = this;
        
        const displayAndWatch = position => {
            
            //go to position
            this.state.map.panTo(new window.google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude
            ));
            
            //set and watch position
            this.setState(setPosition({ position, positionMarker, positionWatcher, map }));
        };
        
        //actual call
        if (window.navigator.geolocation) {
            
            if (!this.state.locationActive) {
                window.navigator.geolocation.getCurrentPosition(displayAndWatch, locationError);
                
                this.state.map.addListener('center_changed', () => {
                    if (this.state.locationActive && !this.state.settingPosition) {
                        window.google.maps.event.clearListeners(this.state.map, 'center_changed');
                        window.navigator.geolocation.clearWatch(this.state.positionWatcher);
                        
                        this.setState({ positionWatcher: null, locationActive: false });
                    }
                    
                    if (this.state.locationActive && this.state.settingPosition) {
                        this.setState({ settingPosition: false });
                    }
                });
            }
                
        } else {
            alert('Your browser does not support the Geolocation API');
        }
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    setMapType(type) {
        return () => this.setState({ mapType: type });
    }
    
    goToArea(e) {
        this.props.history.push(AREA_PATH + e.target.value);
    }

    render() {
        const {
            props: { id, areas, isReadOnly, role },
            state: { settingsModalShown, locationActive, mapType, overlayShown },
            setLocation, toggleProp, setMapType, goToArea
        } = this;
        
        return (
            <div className="full-map-container">
                <div style={{ position: 'absolute', right: '1rem', zIndex: '10' }}>
                    <button style={{ marginRight: '1rem' }} onClick={ setLocation } className={ locationActive ? 'map-button success' : 'map-button cancel' }>
                        <i className="fas fa-location-arrow"></i>
                    </button>
                    <button onClick={ toggleProp('settingsModalShown') } className="map-button primary">
                        <i className="fas fas fa-cog"></i>
                    </button>
                </div>
                
                <div id="map" style={{ height: window.innerHeight - 58 }}></div>
                
                <Modal close={ toggleProp('settingsModalShown') } shown={ settingsModalShown } title="Area Settings">
                    <section className="area-settings">
                        <div className="button-toggle">
                            <button onClick={ setMapType('roadmap') } className={ mapType === 'roadmap' ? 'active' : '' }>Roadmap</button>
                            <button onClick={ setMapType('satellite') } className={ mapType === 'satellite' ? 'active' : '' }>Satellite</button>
                            <button onClick={ setMapType('hybrid') } className={ mapType === 'hybrid' ? 'active' : '' }>Hybrid</button>
                        </div>
                        
                        <div className="toggle" onClick={ toggleProp('overlayShown') }>
                            <label>Show Overlay</label>
                            <span>
                                <i className={ overlayShown ? 'fas fa-toggle-on' : 'fas fa-toggle-off' }></i>
                            </span>
                        </div>
                        
                        <h4>Switch Area</h4>
                        <select onChange={ (e) => goToArea(e) } value={ id }>
                            { areas.map(area => {
                                return <option key={ area._id } value={ area._id }>{ area.title } ({ area.assignedUserName })</option>;
                            }) }
                        </select>
                        <div className="button-group">
                            <button onClick={ () => console.log('go to leads') } className="button primary">
                                Area Leads <i className="fas fa-users"></i>
                            </button>
                            {
                                !isReadOnly && role !== USER
                                    ? (<Link className="button primary" to={ AREA_PATH + id + '/edit' }>
                                        Edit Area <i className="fas fa-edit"></i>
                                    </Link>)
                                    : ''
                            }
                        </div>
                    </section>
                </Modal>
            </div>
        );
    }
}

export default Map;