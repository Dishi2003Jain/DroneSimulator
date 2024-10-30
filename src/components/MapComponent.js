import React, { useEffect, useRef } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function MapComponent({ paths, currentIndexes, startCoordinates, currentPositions , width}) {
    const mapRef = useRef(null);
    const lineLayerStyle = {
        type: 'line',
        paint: {
            'line-color': '#0070f3',
            'line-width': 3,
        },
    };

    useEffect(() => {
        if (startCoordinates && mapRef.current) {
            mapRef.current.flyTo({
                center: [startCoordinates.longitude, startCoordinates.latitude],
                zoom:6,
                essential: true,
            });
        }
    }, [startCoordinates]);

    return (
        <Map
            ref={mapRef}
            initialViewState={{
                latitude: paths[0]?.[0]?.latitude || 20.5937,
                longitude: paths[0]?.[0]?.longitude || 78.9629,
                zoom: 3,
            }}
            style={{ width:width, height: '500px' }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
        >
            {paths.map((path, pathIndex) => {
                if (!path || !currentPositions[pathIndex]) {
                    return null; // Skip rendering if data is missing
                }
                const coordinates = path
                    .slice(0, currentIndexes[pathIndex] + 1)
                    .map((point) =>
                        point && point.longitude !== undefined && point.latitude !== undefined
                            ? [point.longitude, point.latitude]
                            : null
                    )
                    .filter((coord) => coord !== null);

                if (currentPositions[pathIndex]?.longitude && currentPositions[pathIndex]?.latitude) {
                    coordinates.push([currentPositions[pathIndex].longitude, currentPositions[pathIndex].latitude]);
                }
                return (
                    <React.Fragment key={pathIndex}>
                        {path[currentIndexes[pathIndex]] && currentPositions[pathIndex] && (
                            <Marker
                                key={`${pathIndex}-${currentIndexes[pathIndex]}`}
                                latitude={currentPositions[pathIndex].latitude}
                                longitude={currentPositions[pathIndex].longitude}
                            >
                                <div className="drone-marker">🚁</div>
                            </Marker>
                        )}

                        <Source
                            id={`path-${pathIndex}`}
                            type="geojson"
                            data={{
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'LineString',
                                    coordinates: coordinates,
                                },
                            }}
                        >
                            <Layer id={`lineLayer-${pathIndex}`} {...lineLayerStyle} />
                        </Source>
                    </React.Fragment>
                );
            })}
        </Map>
    );
}

export default MapComponent;
