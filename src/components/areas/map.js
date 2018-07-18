import React from 'react';

import { getBounds, createMap, createOuterPolygon, setArea } from '../helpers/maps';

import Modal from '../layout/modal';
import MapOptions from './map-options-show';

//can you write your own react style listeners for maps?

class Map extends React.Component {
    
	constructor(props) {
        super(props);

        this.googleMaps = window.google.maps;
        
        this.state = {
            locationActive: false,
            modalShown: false,
            overlayShown: true,
            mapType: 'roadmap',
            isInitialized: false,
            map: null,
            areaPolygon: null,
            outerPolygon: null,
            infoWindow: null
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.setMapType = this.setMapType.bind(this);
        this.goToArea = this.goToArea.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.toggleOverlay = this.toggleOverlay.bind(this);
        
        //maps no longer supports getBounds so we build our own function
        window.google.maps.Polygon.prototype.getBounds = getBounds(this.googleMaps);
    }
    
    componentDidMount() {
        this.setState({ map: createMap(this.googleMaps) });
    }
    
    componentDidUpdate(prevProps, prevState) {
        const { props: { areas }, state: { mapType, overlayShown, isInitialized }, googleMaps } = this;
        
        if (!isInitialized) {
            const areaCoords = areas.find(area => area._id === this.props.id).coords;
            const polygon = new googleMaps.Polygon({ paths: areaCoords });
            //overlay for everything but area
            const outerPolygon = createOuterPolygon(googleMaps, areaCoords);
            const areaPolygon = {
                bounds: polygon.getBounds(),
                center: polygon.getBounds().getCenter(),
                polygon: polygon
            };
            
            //show area
            outerPolygon.setMap(this.state.map);
            
            //set area bounds
            this.state.map.fitBounds(areaPolygon.bounds);
            
            this.setState({ isInitialized: true, outerPolygon, areaPolygon });
        }
        
        if (prevState.mapType !== mapType) this.state.map.setMapTypeId(mapType);
        
        if (prevProps.id !== this.props.id) {
            const areaCoords = areas.find(area => area._id === this.props.id).coords;
            const polygon = new googleMaps.Polygon({ paths: areaCoords });
            const outerPolygon = createOuterPolygon(googleMaps, areaCoords);
            const areaPolygon = {
                bounds: polygon.getBounds(),
                center: polygon.getBounds().getCenter(),
                polygon: polygon
            };
            
            //clear current overlay
            this.state.outerPolygon.setMap(null);
            
            //show area
            outerPolygon.setMap(this.state.map);
            
            //set area bounds
            this.state.map.fitBounds(areaPolygon.bounds);
            
            this.setState({ outerPolygon, areaPolygon });
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

        this.setState({ infoWindow: new this.googleMaps.InfoWindow });
        
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation
                ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(this.state.map);
        }
        
        if (window.navigator.geolocation) {
            this.setState({ locationActive: true });
            
            window.navigator.geolocation.getCurrentPosition(position => {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                this.state.infoWindow.setPosition(pos);
                this.state.infoWindow.setContent('Location found.');
                this.state.infoWindow.open(this.state.map);
                this.state.map.setCenter(pos);
            }, function() {
                handleLocationError(true, this.state.infoWindow, this.state.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, this.state.infoWindow, this.state.map.getCenter());
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
                            return <option key={ area._id } value={ area._id }>{ area.title }</option>;
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