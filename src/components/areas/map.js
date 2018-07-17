import React from 'react';

import mapStyles from '../helpers/map-styles';

import Modal from '../layout/modal';
import MapOptions from './map-options-show';

//can you write your own react style listeners?

class Map extends React.Component {
    
	constructor(props) {
        super(props);
        
        //not in state, letting Google handle map control, just making available to component
        //think of a different pattern for this
        this.map = null;
        this.infoWindow = null;
        
        //maybe move overlay to state
        this.overlay = null;
        this.areaPolygons = {};
        
        this.state = {
            locationUsed: false,
            modalShown: false,
            mapType: 'roadmap'
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.setMapType = this.setMapType.bind(this);
        this.goToArea = this.goToArea.bind(this);
        this.renderAreaOptions = this.renderAreaOptions.bind(this);
        this.useLocation = this.useLocation.bind(this);
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (prevState.mapType !== this.state.mapType) this.map.setMapTypeId(this.state.mapType);
    }
    
    componentDidMount() {
        
        //maps no longer supports getBounds so we construct our own
        window.google.maps.Polygon.prototype.getBounds = function() {
            let bounds = new window.google.maps.LatLngBounds();
            let paths = this.getPaths();
            let path;
            for (var i = 0; i < paths.getLength(); i++) {
                path = paths.getAt(i);
                
                for (var ii = 0; ii < path.getLength(); ii++) {
                    bounds.extend(path.getAt(ii));
                }
            }
            return bounds;
        };
        
        this.map = new window.google.maps.Map(document.getElementById('map'), {
            center: {lat: 40, lng: -100},
            zoom: 4,
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyles
        });

        this.props.areas.forEach(area => {
            
            let areaPolygon = new window.google.maps.Polygon({
                paths: area.coords,
                strokeColor: 'red',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'red',
                fillOpacity: 0.35
            });
            
            this.areaPolygons[area._id] = {
                bounds: areaPolygon.getBounds(),
                center: areaPolygon.getBounds().getCenter(),
                polygon: areaPolygon
            };
        });
        
        //show area
        this.areaPolygons[this.props.id].polygon.setMap(this.map);
        
        //go to initial area
        this.map.fitBounds(this.areaPolygons[this.props.id].bounds)
    }
    
    renderAreaOptions() {
        return this.props.areas.map(area => {
            return <option key={ area._id } value={ area._id }>{ area.title }</option>;
        });
    }
    
    goToArea(e) {
        this.props.history.push(`/areas/${ this.props.areas[e.target.value] }`);
    }
    
    useLocation() {
        if ('geolocation' in window.navigator) {
            console.log('geolocation');
            this.setState({ locationUsed: true });
            window.navigator.geolocation.getCurrentPosition(position => {
                console.log(position);
            });
        } else {
            alert('no location services detected')
        }
        
        this.infoWindow = new window.google.maps.InfoWindow;
        
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation
                ? 'Error: The Geolocation service failed.'
                : 'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(this.map);
        }
        
        if (window.navigator.geolocation) {
            this.setState({ locationUsed: true });
            
            window.navigator.geolocation.getCurrentPosition(position => {
                let pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                this.infoWindow.setPosition(pos);
                this.infoWindow.setContent('Location found.');
                this.infoWindow.open(this.map);
                this.map.setCenter(pos);
            }, function() {
                handleLocationError(true, this.infoWindow, this.map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, this.infoWindow, this.map.getCenter());
        }
    }
    
    toggleModal() {
        this.setState({ modalShown: !this.state.modalShown });
    }
    
    setMapType(type) {
        this.setState({ mapType: type });
    }

    render() {
        const {
            state: { modalShown, locationUsed, mapType },
            useLocation, toggleModal, setMapType, renderAreaOptions, goToArea
        } = this;
        
        return (
            <div className="map-container">
                <div className="custom-map-controls">
                    <button onClick={ useLocation } className={ locationUsed ? 'button success' : 'button cancel' }><i className="fas fa-location-arrow"></i></button>
                    <select onChange={ (e) => goToArea(e) }>
                        { renderAreaOptions() }
                    </select>
                    <button onClick={ toggleModal } className="button primary"><i className="fas fas fa-cog"></i></button>
                </div>
                <div id="map"></div>
                <button onClick={ () => console.log('go to leads') } className="button primary"><i className="fas fa-users"></i></button>
                <Modal close={ toggleModal } shown={ modalShown } title="Area Settings">
                    <MapOptions mapType={ mapType } setMapType={ setMapType } />
                </Modal>
            </div>
        );
    }
}

export default Map;