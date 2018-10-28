export default (layer) => {

    return {
        vertex: { // drawn feature vertex
            pane: layer.key,
            stroke: true,
            color: "darkgrey",
            fillColor: "steelblue",
            weight: 1,
            radius: 5
        },
        trail: { // trail left behind cursor
            pane: layer.key,
            stroke: true,
            color: '#666',
            dashArray: "5 5",
            weight: 1
        },
        path: { // actual drawn feature
            pane: layer.key,
            stroke: true,
            color: '#666',
            dashArray: "5 5",
            fill: true,
            fillColor: "#cf9",
            weight: 1
        },
        point: { // new staged point
            pane: layer.key,
            stroke: true,
            color: "darkgrey",
            fillColor: "steelblue",
            weight: 2,
            radius: 8
        }
    }
}