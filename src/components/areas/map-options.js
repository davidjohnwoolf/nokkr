import React from 'react';


const MapOptions = ({ mapType, setMapType }) => {

    return (
        <section className="area-settings">
            <div className="button-toggle">
                <button onClick={ () => setMapType('roadmap') } className={ mapType === 'roadmap' ? 'active' : '' }>Roadmap</button>
                <button onClick={ () => setMapType('satellite') } className={ mapType === 'satellite' ? 'active' : '' }>Satellite</button>
                <button onClick={ () => setMapType('hybrid') } className={ mapType === 'hybrid' ? 'active' : '' }>Hybrid</button>
            </div>
            
            { /*<div style={{ display: 'flex' }}>
                <div className="field" style={{ marginRight: '2rem' }}>
                    <div className="checkbox">
                        <input
                            name="showLabels"
                            id="showLabels"
                            type="checkbox"
                            value="true"
                            checked="checked"
                            onChange={ () => true }
                        />
                        <label htmlFor="showLabels">Show Labels</label>
                    </div>
                </div>
                
                <div className="field">
                    <div className="checkbox">
                        <input
                            name="showAreas"
                            id="showAreas"
                            type="checkbox"
                            value="true"
                            checked="checked"
                            onChange={ () => true }
                        />
                        <label htmlFor="showAreas">Show Areas</label>
                    </div>
                </div>
            </div> */}
            
            <h4>Go To Group</h4>
            <select>
                <option value="">Select group to use</option>
            </select>
        </section>
    );
}

export default MapOptions;