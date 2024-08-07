const speedyMap = (config) => {

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/light-v11",
        center: [10, 40],
        zoom: 2
    });
    
    map.on("load", () => {
    
        map.addSource("density", {
            type: "geojson",
            data: config.sources.density
        });
    
        map.addSource("summary", {
            type: "geojson",
            data: config.sources.summary
        });
    
        map.addSource("envelope", {
            type: "geojson",
            data: config.sources.envelope
        });
    
        map.addSource("distribution", {
            type: "geojson",
            data: config.sources.distribution
        });
    
        map.addLayer({
            "id": "envelope",
            "type": "fill",
            "source": "envelope",
            "paint": {
                "fill-color": "rgb(146, 181, 85)",
                "fill-opacity": 0.5
            }
        });
    
        map.addLayer({
            "id": "density",
            "type": "fill",
            "source": "density",
            "paint": {
                "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "density"],
                    0, "#008080",
                    0.000025, "#70a494",
                    0.00005, "#b4c8a8",
                    0.0001, "#f6edbd",
                    0.0002, "#edbb8a",
                    0.0004, "#de8a5a",
                    0.0008, "#ca562c"
    
                ],
                "fill-opacity": 0.5
            }
        });
        
        map.addLayer({
            "id": "summary",
            "type": "fill",
            "source": "summary",
            "paint": {
                "fill-color": [
                    "match",
                    ["get", "establishmentMeans"],
                    "native", "rgb(171, 196, 147)",
                    "introduced", "rgb(245, 66, 93)",
                    "uncertain", "rgb(202, 117, 255)",
                    "none", "rgb(237, 167, 69)",
                    "rgb(237, 167, 69)"
                ],
                "fill-opacity": 0.5
            }
        });
    
        map.addLayer({
            "id": "distribution",
            "type": "circle",
            "source": "distribution",
            "paint": {
                "circle-radius": 2,
                "circle-opacity": 0,
                "circle-stroke-width": 1.2,
                "circle-stroke-color": "#000"
            }
        });

    });

    map.on("idle", () => {

        const toggleableLayerIds = ["density", "summary", "envelope", "distribution"];

        for (const id of toggleableLayerIds) {
            if (document.getElementById(id)) {
                continue;
            }

            const link = document.createElement("a");
            link.id = id;
            link.href = "#";
            link.textContent = id;
            link.className = "active";

            link.onclick = function (e) {
                const clickedLayer = this.textContent;
                e.preventDefault();
                e.stopPropagation();

                const visibility = map.getLayoutProperty(
                    clickedLayer,
                    "visibility"
                );

                if (visibility === undefined || visibility === "visible") {
                    map.setLayoutProperty(clickedLayer, "visibility", "none");
                    this.className = "";
                } else {
                    this.className = "active";
                    map.setLayoutProperty(
                        clickedLayer,
                        "visibility",
                        "visible"
                    );
                }
            };

            const layers = document.getElementById("menu");
            layers.appendChild(link);
        }
    });

}