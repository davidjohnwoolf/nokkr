import React from 'react';

import mapStyles from '../helpers/map-styles';

import Modal from '../layout/modal';
import IconLink from '../layout/icon-link';
import MapOptions from './map-options';

//can you write your own react style listeners?

class MapIndex extends React.Component {
    
	constructor(props) {
        super(props);
        
        //not in state, letting Google handle map control, just making available to component
        //think of a different pattern for this
        this.autocomplete = null;
        this.map = null;
        
        //maybe move overlay to state
        this.overlay = null;
        this.areaPolygons = {};
        
        this.state = {
            mapType: 'roadmap'
        };
        
        this.setMapType = this.setMapType.bind(this);
        this.setGroupBounds = this.setGroupBounds.bind(this);
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
        
        this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('map-search'));
        
        this.autocomplete.addListener('place_changed', () => {
            let place = this.autocomplete.getPlace();
            
            //update the alert to be flash message
            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert('No details available for input: "' + place.name + '"');
                return;
            }
            
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(15);
            }
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
            
            areaPolygon.addListener('click', () => this.map.fitBounds(this.areaPolygons[area._id].bounds));
            
        });
        
        //show areas
        for (let poly in this.areaPolygons) {
            this.areaPolygons[poly].polygon.setMap(this.map);
        }
    }
    
    setMapType(type) {
        this.setState({ mapType: type });
    }
    
    setGroupBounds(groupId) {
        //make the bounds the whole group, not just the one area
        //only show groups with areas
        //set the group in are form on selection
        
        let bounds = [];
        let id;
        this.props.areas.forEach(area => {
            
            if (area.areaGroup === groupId) {
                console.log(this.areaPolygons[area._id].bounds);
                return id = area._id;
            }
            
        });
        
        if (!id) return alert('No areas in this group');
        
        this.map.fitBounds(this.areaPolygons[id].bounds);
    }

    render() {
        const {
            props: { areaGroups },
            state: { mmapType },
            setMapType, setGroupBounds
        } = this;
        
        return (
            <div className={ `map-container ${ this.props.mapShown ? '' : 'invisible' }` }>
                <div className="custom-map-controls">
                    { /*<button onClick={ setLocation } className={ locationActive ? 'button success' : 'button cancel' }>
                        <i className="fas fa-location-arrow"></i>
                    </button> */}
                    <div><input id="map-search" type="text" placeholder="enter location to go to" /></div>
                    <button onClick={ () => console.log('settings') } className="button primary"><i className="fas fas fa-cog"></i></button>
                </div>
                <div id="map"></div>
                <select onChange={ (e) => setGroupBounds(e.target.value) }>
                    <option value="">Go to Group</option>
                    {
                        areaGroups.map(group => {
                            return (
                                <option key={ group._id } value={ group._id }>{ group.title }</option>
                            );
                        })
                    }
                </select>
                { /*<Modal close={ toggleModal } shown={ modalShown } title="Area Settings">
                    <MapOptions mapType={ mapType } setMapType={ setMapType } />
                </Modal> */}
            </div>
        );
    }
}

export default MapIndex;