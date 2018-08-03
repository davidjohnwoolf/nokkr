import React from 'react';
import { Link } from 'react-router-dom';

import { getBounds, createMap, setArea, setPosition, locationError } from '../helpers/maps';
import { AREA_PATH, USER } from '../../../lib/constants';

import Modal from '../layout/modal';
import LeadNew from '../leads/lead-new';

//can you write your own react style listeners for maps?

class Map extends React.Component {
    
	constructor(props) {
        super(props);
        
        this.constants = Object.freeze({
            SETTINGS_MODAL_SHOWN: 'settingsModalShown',
            LEAD_MODAL_SHOWN: 'leadModalShown',
            OVERLAY_SHOWN: 'overlayShown',
        });
        
        this.state = {
            locationActive: false,
            geocoder: null,
            settingsModalShown: false,
            leadModalShown: false,
            overlayShown: true,
            isInitialized: false,
            settingPosition: false,
            positionMarker: null,
            newLeadMarker: null,
            newLeadAddress: undefined,
            newLeadCity: undefined,
            newLeadState: undefined,
            newLeadZipcode: undefined,
            newLeadLatLng: null,
            map: null,
            areaPolygon: null,
            outerPolygon: null
        };
        
        
        this.toggleProp = this.toggleProp.bind(this);
        this.goToArea = this.goToArea.bind(this);
        this.setLocation = this.setLocation.bind(this);
        
        //build get bounds function
        window.google.maps.Polygon.prototype.getBounds = getBounds(window.google.maps);
    }
    
    componentDidMount() {
        //component must be mounted to reference the map element
        this.setState({ map: createMap(window.google.maps), geocoder: new window.google.maps.Geocoder });
    }
    
    componentDidUpdate(prevProps, prevState) {
        const {
            props: { areas, id },
            state: { map, overlayShown, isInitialized },
            toggleProp, constants: { LEAD_MODAL_SHOWN }
        } = this;
        
        if (!isInitialized) {
            
            this.state.map.addListener('click', e => {
                console.log(e.latLng.lng())
                this.state.geocoder.geocode({ 'location': e.latLng }, (results, status) => {
                    if (status === 'OK') {
                        if (results[0]) {
                            let marker = new window.google.maps.Marker({
                                position: e.latLng,
                                map: map
                            });
                            let addressInfo = results[0].address_components
                            
                            this.setState({
                                newLeadMarker: marker,
                                newLeadAddress: addressInfo[0].short_name + ' ' + addressInfo[1].short_name,
                                newLeadCity: addressInfo[3].short_name,
                                newLeadState: addressInfo[5].short_name,
                                newLeadZipcode: addressInfo[7].short_name,
                                newLeadLatLng: e.latLng,
                                leadModalShown: true
                            });
                            
                            console.log(this.state.newLeadAddress)
                        } else {
                            window.alert('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                    }
                });
            });
            
            this.setState({ isInitialized: true, ...setArea({ googleMaps: window.google.maps, map, id, areas }) });
        }
        
        if (prevProps.id !== this.props.id) {
            //clear current overlay
            this.state.outerPolygon.setMap(null);
            
            this.setState(setArea({ googleMaps: window.google.maps, map, id, areas }));
        }
        
        if (prevState.leadModalShown !== this.state.leadModalShown) {
            if (!this.state.leadModalShown) {
                this.state.newLeadMarker.setMap(null);
                this.setState({ newLeadMarker: null });
            }
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
            
            this.state.map.setZoom(19);
            
            //set and watch position
            this.setState(setPosition({ position, positionMarker, positionWatcher, map }));
        };
        
        const onMapChange = () => {
            if (this.state.locationActive && !this.state.settingPosition) {
                window.google.maps.event.clearListeners(this.state.map, 'center_changed');
                window.navigator.geolocation.clearWatch(this.state.positionWatcher);
                
                this.setState({ positionWatcher: null, locationActive: false });
            }
            
            if (this.state.locationActive && this.state.settingPosition) {
                this.setState({ settingPosition: false });
            }
        };
        
        //actual call
        if (window.navigator.geolocation) {
            
            if (!this.state.locationActive) {
                window.navigator.geolocation.getCurrentPosition(displayAndWatch, locationError);
                
                this.state.map.addListener('center_changed', onMapChange);
            }
                
        } else {
            alert('Your browser does not support the Geolocation API');
        }
    }
    
    toggleProp(prop) {
        return () => this.setState({ [prop]: !this.state[prop] });
    }
    
    goToArea(e) {
        window.google.maps.event.trigger(this.state.map, 'center_changed');
        this.props.history.push(AREA_PATH + e.target.value);
    }

    render() {
        const {
            props: { id, areas },
            state: {
                settingsModalShown,
                locationActive,
                overlayShown,
                leadModalShown,
                newLeadAddress,
                newLeadCity,
                newLeadState,
                newLeadZipcode,
                newLeadLatLng
            },
            setLocation, toggleProp, goToArea,
            constants: { SETTINGS_MODAL_SHOWN, LEAD_MODAL_SHOWN, OVERLAY_SHOWN }
        } = this;
        
        return (
            <div className="full-map-container">
                <div style={{ position: 'absolute', right: '1rem', zIndex: '10' }}>
                    <button style={{ marginRight: '1rem' }} onClick={ setLocation } className={ locationActive ? 'map-button success' : 'map-button cancel' }>
                        <i className="fas fa-location-arrow"></i>
                    </button>
                    <button onClick={ toggleProp(SETTINGS_MODAL_SHOWN) } className="map-button primary">
                        <i className="fas fas fa-cog"></i>
                    </button>
                </div>
                
                <div id="map" style={{ height: window.innerHeight - 58 }}></div>
                
                <Modal close={ toggleProp(SETTINGS_MODAL_SHOWN) } shown={ settingsModalShown } title="Area Settings">
                    <section className="area-settings">
                        
                        <div className="toggle" onClick={ toggleProp(OVERLAY_SHOWN) }>
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
                        
                        <button onClick={ () => console.log('go to leads') } className="button primary">
                            View Leads List <i className="fas fa-users"></i>
                        </button>
                        
                    </section>
                </Modal>
                <Modal close={ toggleProp(LEAD_MODAL_SHOWN) } shown={ leadModalShown } title="Create Lead">
                    { /* make hasAddress more intuitive and certain, leadmoModalShown may not be best */ }
                    <LeadNew
                        close={ toggleProp(LEAD_MODAL_SHOWN) }
                        address={ newLeadAddress }
                        city={ newLeadCity }
                        state={ newLeadState }
                        zipcode={ newLeadZipcode }
                        latLng={ newLeadLatLng }
                        hasAddress={ leadModalShown }
                    />
                </Modal>
            </div>
        );
    }
}

export default Map;