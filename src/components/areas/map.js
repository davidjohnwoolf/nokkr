import React from 'react';

import { getBounds, createMap, createOuterPolygon, setArea } from '../helpers/maps';

import Modal from '../layout/modal';
import MapOptions from './map-options-show';

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
        
        console.log('positionsetting', this.state.settingPosition)
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
        this.props.history.push(`/areas/${ e.target.value }`);
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
                        scale: 5,
                        fillColor: '#4169e1',
                        fillOpacity: 1,
                        strokeColor: '#91a6e2',
                        strokeWeight: 20,
                        strokeOpacity: 0.3
                    }
                })
            } else {
                this.state.currentPositionMarker.setPosition(
                    new window.google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    )
                );
            }
            
            this.setState({ currentPositionMarker: positionMarker || this.state.currentPositionMarker, settingPosition: true });
            
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
            props: { id },
            state: { modalShown, locationActive, mapType, overlayShown },
            setLocation, toggleModal, setMapType, goToArea, toggleOverlay
        } = this;
        
        return (
            <div className="map-container">
                <div className="custom-map-controls">
                    <button onClick={ setLocation } className={ locationActive ? 'button success' : 'button cancel' }>
                        <i className="fas fa-location-arrow"></i>
                    </button>
                    <select onChange={ (e) => goToArea(e) } value={ id }>
                        { this.props.areas.map(area => {
                            return <option key={ area._id } value={ area._id }>{ area.title } ({ area.assignedUserName })</option>;
                        }) }
                    </select>
                    <button onClick={ toggleModal } className="button primary"><i className="fas fas fa-cog"></i></button>
                </div>
                <div id="map"></div>
                <button onClick={ () => console.log('go to leads') } className="button primary">
                    <i className="fas fa-users"></i>
                </button>
                <Modal close={ toggleModal } shown={ modalShown } title="Area Settings">
                    <MapOptions mapType={ mapType } setMapType={ setMapType } toggleOverlay={ toggleOverlay } overlayShown={ overlayShown } />
                </Modal>
            </div>
        );
    }
}

export default Map;