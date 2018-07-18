export const createOuterBounds = (maps) => {
    return [
        new maps.LatLng(85, 180),
        new maps.LatLng(85, 90),
        new maps.LatLng(85, 0),
        new maps.LatLng(85, -90),
        new maps.LatLng(85, -180),
        new maps.LatLng(0, -180),
        new maps.LatLng(-85, -180),
        new maps.LatLng(-85, -90),
        new maps.LatLng(-85, 0),
        new maps.LatLng(-85, 90),
        new maps.LatLng(-85, 180),
        new maps.LatLng(0, 180),
        new maps.LatLng(85, 180)
    ]
}