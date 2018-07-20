import React from 'react';
import { Link } from 'react-router-dom';

import { getBounds, createMap, setArea } from '../helpers/maps';
import { AREA_PATH } from '../../../lib/constants';

import Modal from '../layout/modal';

//can you write your own react style listeners for maps?

class Map extends React.Component {
    
	constructor(props) {
        super(props);
        
        this.state = {
            locationActive: false,
            modalShown: false,
            overlayShown: true,
            mapType: 'roadmap',
            isInitialized: false,
            settingPosition: false,
            currentPositionMarker: null,
            map: null,
            areaPolygon: null,
            outerPolygon: null
        };

        this.toggleModal = this.toggleModal.bind(this);
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
                ? this.state.outerPolygon.setMap(this.state.map)
                : this.state.outerPolygon.setMap(null);
        }
    }
    
    goToArea(e) {
        this.props.history.push(AREA_PATH + e.target.value);
    }
    
    setLocation() {
            
        const locError = error => {
            // the current position could not be located
            console.log(error);
            alert("The current position could not be found!");
        };
        
        const setCurrentPosition = (pos) => {
            let positionMarker;
            
            if (!this.state.currentPositionMarker) {
                positionMarker: new window.google.maps.Marker({
                    map: this.state.map,
                    position: new window.google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    ),
                    title: 'You are here',
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 7,
                        fillColor: '#306eff',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                        strokeOpacity: 1
                    }
                });
            } else {
                console.log(this.state.currentPositionMarker)
                this.state.currentPositionMarker.setPosition(
                    new window.google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    )
                );
            }

            positionMarker
                ? this.setState({ currentPositionMarker: positionMarker, settingPosition: true })
                : this.setState({ settingPosition: true });

            this.state.map.panTo(new window.google.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
            ));
        };
        
        const setMarkerPosition = (marker, position) => {
            marker.setPosition(
                new window.google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude)
            );
        };
        
        const watchCurrentPosition = () => {
            if (!this.state.positionWatcher) {
                this.setState({
                    positionWatcher: window.navigator.geolocation.watchPosition(position => {
                        setMarkerPosition(
                            this.state.currentPositionMarker,
                            position
                        );
                    })
                });
            }
        };
        
        const displayAndWatch = position => {
            // set current position
            setCurrentPosition(position);
            // watch position
            watchCurrentPosition();
        };
        
        this.state.map.addListener('center_changed', () => {
            if (this.state.locationActive && !this.state.settingPosition) {
                this.setState({ locationActive: false });
                window.google.maps.event.clearListeners(this.state.map, 'center_changed');
                if (this.state.positionWatcher) {
                    window.navigator.geolocation.clearWatch(this.state.positionWatcher);
                }
            } else if (this.state.locationActive && this.state.settingPosition) {
                this.setState({ settingPosition: false });
            }
        });
        
        //actual calls
        if (window.navigator.geolocation) {
            
            if (!this.state.locationActive) {
                this.setState({ locationActive: true });
                window.navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
            }
                
        } else {
            alert("Your browser does not support the Geolocation API");
        }
        
    }
    
    toggleModal() {
        this.setState({ modalShown: !this.state.modalShown });
    }
    
    toggleOverlay() {
        this.setState({ overlayShown: !this.state.overlayShown });
    }
    
    setMapType(type) {
        this.setState({ mapType: type });
    }

    render() {
        const {
            props: { id, areas },
            state: { modalShown, locationActive, mapType, overlayShown },
            setLocation, toggleModal, setMapType, goToArea, toggleOverlay
        } = this;
        
        return (
            <div className="full-map-container">
                <button style={{ position: 'absolute', top: '0', left: '1rem', zIndex: 10 }} onClick={ setLocation } className={ locationActive ? 'map-button success' : 'map-button cancel' }>
                    <i className="fas fa-location-arrow"></i>
                </button>
                <button style={{ position: 'absolute', top: '0', right: '1rem', zIndex: 10 }} onClick={ toggleModal } className="map-button primary"><i className="fas fas fa-cog"></i></button>
                <div id="map" style={{ height: window.innerHeight - 58 }}></div>
                
                <Modal close={ toggleModal } shown={ modalShown } title="Area Settings">
                    <section className="area-settings">
                        <div className="button-toggle">
                            <button onClick={ () => setMapType('roadmap') } className={ mapType === 'roadmap' ? 'active' : '' }>Roadmap</button>
                            <button onClick={ () => setMapType('satellite') } className={ mapType === 'satellite' ? 'active' : '' }>Satellite</button>
                            <button onClick={ () => setMapType('hybrid') } className={ mapType === 'hybrid' ? 'active' : '' }>Hybrid</button>
                        </div>
                        
                        <div className="checkbox-options">
                            <div>
                                <input type="checkbox" id="show-leads" value="true" defaultChecked />
                                <label htmlFor="show-leads">Show Leads</label>
                            </div>
                            <div>
                                <input type="checkbox" id="show-area" value="true" checked={ overlayShown } onChange={ toggleOverlay } />
                                <label htmlFor="show-area">Show Area Overlay</label>
                            </div>
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
                            <Link className="button primary" to={ AREA_PATH + id + '/edit' }>
                                Edit Area <i className="fas fa-edit"></i>
                            </Link>
                        </div>
                    </section>
                </Modal>
            </div>
        );
    }
}

export default Map;