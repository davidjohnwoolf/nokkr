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
        this.props.history.push(`/areas/${ e.target.value }`);
    }
    
    setLocation() {
        
        let currentPositionMarker;
        let positionWatcher;
            
        const locError = error => {
            // the current position could not be located
            console.log(error);
            alert("The current position could not be found!");
        };
        
        const setCurrentPosition = (pos) => {
            if (!currentPositionMarker) {
                currentPositionMarker = new window.google.maps.Marker({
                    map: this.state.map,
                    position: new window.google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    ),
                    title: 'You are here',
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#4169e1',
                        fillOpacity: 1,
                        strokeColor: '#6687e7',
                        strokeOpacity: 0.3
                    }
                });
            } else {
                currentPositionMarker.setPosition(
                    new window.google.maps.LatLng(
                        pos.coords.latitude,
                        pos.coords.longitude
                    )
                );
            }
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
            positionWatcher = window.navigator.geolocation.watchPosition(position => {
                setMarkerPosition(
                    currentPositionMarker,
                    position
                );
            });
        };
        
        const displayAndWatch = position => {
            // set current position
            setCurrentPosition(position);
            // watch position
            watchCurrentPosition();
        };
        
        //this doesn't really work well
        this.state.map.addListener('dragstart', () => {
            if (this.state.locationActive) {
                this.setState({ locationActive: false });
                if (positionWatcher) window.navigator.geolocation.clearWatch(positionWatcher);
            }
        });
        
        if (this.state.locationActive) {
            this.setState({ locationActive: false });
            window.navigator.geolocation.clearWatch(positionWatcher);
            
        } else {
            this.setState({ locationActive: true });
            
            if (window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
            } else {
                alert("Your browser does not support the Geolocation API");
            }
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