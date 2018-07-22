import React from 'react';

import mapStyles from '../helpers/map-styles';
import { getBounds, createMap, setAreas, getGroupBounds } from '../helpers/maps';

import Modal from '../layout/modal';
import IconLink from '../layout/icon-link';
import MapOptions from './map-options';

//can you write your own react style listeners?

class MapIndex extends React.Component {
    
	constructor(props) {
        super(props);
        
        this.state = {
            mapType: 'roadmap',
            overlay: null,
            areaPolygons: null,
            map: null,
            autocomplete: null,
            settingsModalShown: false,
            isInitialized: false
        };
        
        this.setGroupBounds = this.setGroupBounds.bind(this);
        
        //build get bounds function
        window.google.maps.Polygon.prototype.getBounds = getBounds(window.google.maps);
    }
    
    componentDidMount() {
        //component must be mounted to reference the map element
        this.setState({ map: createMap(window.google.maps) });
    }
    
    componentDidUpdate(prevProps, prevState) {
        if (!this.state.isInitialized) {
            const autocomplete = new window.google.maps.places.Autocomplete(document.getElementById('map-search'));

            autocomplete.addListener('place_changed', () => {
                let place = autocomplete.getPlace();
                
                //update the alert to be flash message
                if (!place.geometry) {
                    // User entered the name of a Place that was not suggested and
                    // pressed the Enter key, or the Place Details request failed.
                    window.alert('No details available for input: "' + place.name + '"');
                    return;
                }
                
                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    this.state.map.fitBounds(place.geometry.viewport);
                } else {
                    this.state.map.setCenter(place.geometry.location);
                    this.state.map.setZoom(15);
                }
            });
            
            this.setState({
                autocomplete,
                areaPolygons: setAreas(this.props.areas, this.state.map),
                isInitialized: true
            });
        }
        
        if (prevProps.areas !== this.props.areas) {
            //clear map
            for (let poly in this.state.areaPolygons) {
                this.state.areaPolygons[poly].polygon.setMap(null);
            }
            
            this.setState({
                areaPolygons: setAreas(this.props.areas, this.state.map)
            });
        }
        
        if (prevState.mapType !== this.state.mapType) this.state.map.setMapTypeId(this.state.mapType);
    }
    
    setGroupBounds(groupId) {
        let groupPolygons = [];
        this.props.areas.forEach(area => {
            
            if (area.areaGroup === groupId) {
                groupPolygons.push(this.state.areaPolygons[area._id]);
            }
            
        });
        
        this.state.map.fitBounds(getGroupBounds(groupPolygons));
    }

    render() {
        const {
            props: { areaGroups },
            state: { mapType },
            setGroupBounds
        } = this;
        
        return (
            <div className={ `map-container ${ this.props.mapShown ? '' : 'invisible' }` }>
                <div style={{ display: 'flex' }}>
                    <input id="map-search" type="text" placeholder="enter location to go to" className="map-input" style={{ width: '100%'}} />
                </div>
                <div id="map"></div>
                
                <h4>Go To Group</h4>
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
            </div>
        );
    }
}

export default MapIndex;