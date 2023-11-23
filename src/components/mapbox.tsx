"use client";

import React, { memo, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Dexie from "dexie";

// Set your Mapbox access token here
mapboxgl.accessToken =
    "pk.eyJ1IjoicnVpLWRpYXMiLCJhIjoiY2xncDEya3pzMHZsODNrbW1vdHl4a21xNiJ9.ICq1P0o3JbqxVaTKxpRjqw";

const Mapbox = ({
    portugalDistricts,
    districtBoundaries,
    portugalList,
    portugalGeojson,
}: {
    portugalDistricts: any;
    districtBoundaries: any;
    portugalList: any;
    portugalGeojson: any;
}) => {
    const mapContainerRef = useRef("");
    const dbName = "mapDataDB";

    const db = new Dexie(dbName);
    db.version(1).stores({
        mapData:
            "id,portugalDistricts,districtBoundaries,portugalList,portugalGeojson",
    });


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/rui-dias/clopys8hz00l201qm16e96wzw", // You can choose a different map style
            center: [-7.4915, 39.8235], // Initial center coordinates
            zoom: 6, // Initial zoom level
            pitch: 40,
        });

        // Add any additional map customization or data layers here

        map.on("load", async () => {
            console.log("loaded")
            // Render Portugal
            const storedData = await db.table("mapData").get(1);

            if (storedData) {
                console.log("renderizar indexedDB")
                renderPortugal(map, "portugal", storedData?.portugalGeojson);

                storedData.districtBoundaries.map((response: any) => {
                    fetchDataAndStore();
                    renderPortugalCitiesBoundaries(
                        map,
                        response,
                        response.features[0].properties.NAME_1,
                        true,
                        response
                    );
                });
            } else {
                console.log("renderizar normal")
                await fetchDataAndStore();
                renderPortugal(map, "portugal", portugalGeojson);
                portugalList.districts.map((file: any, index: number) => {
                    const actualFile = `assets/datasets/portugal/${file.name}`;
                    const districtName = file.name;
                    fetch(actualFile).then(async (res: any) => {
                        const result = await res.json();
                        renderPortugalCitiesBoundaries(
                            map,
                            result,
                            districtName,
                            file.selected
                        );
                    });
                });
            }
        });

        const fetchDataAndStore = async () => {
            try {
                await db.table("mapData").put({
                    id: 1,
                    portugalDistricts,
                    districtBoundaries,
                    portugalList,
                    portugalGeojson,
                });
            } catch (error) {
                console.error("Error fetching and storing data:", error);
            }
        };

        // Clean up the map on component unmount
        return () => map.remove();
    }, []);

    const renderPortugal = (
        map: any,
        countryName: any,
        portugalGeojsonFromIndexedDb: any
    ) => {
        if (map.getSource(countryName)) {
            map.removeSource(countryName);
        }

        map.addSource(countryName, {
            type: "geojson",
            data: portugalGeojsonFromIndexedDb
                ? portugalGeojsonFromIndexedDb
                : portugalGeojson,
        });

        map.addLayer({
            id: `cf-${countryName}`, // country-fills
            type: "fill-extrusion",
            source: countryName,
            layout: {},
            paint: {
                "fill-extrusion-color": "#FFFFFF", // Color of the extrusion
                "fill-extrusion-height": 20000,
            },
        });

        map.on("click", `cf-${countryName}`, () => {
            // Adjust this logic based on your React component's state and functions
            console.log("Portugal clicked");
        });

        map.on("mouseenter", `cf-${countryName}`, () => {
            // Adjust this logic based on your React component's state and functions
            console.log("Mouse entered Portugal");
        });

        map.on("mouseleave", `cf-${countryName}`, () => {
            // Adjust this logic based on your React component's state and functions
            console.log("Mouse left Portugal");
        });
    };

    // Add function to render Portugal cities boundaries
    const renderPortugalCitiesBoundaries = (
        map: any,
        file: any,
        districtName: any,
        selected: any,
        response?: any
    ) => {
        map.addSource(`districts-${districtName}`, {
            type: "geojson",
            data: response ? response : file,
        });

        if (selected) {
            map.addLayer({
                id: `cf-${districtName}`, // country-fills
                type: "fill-extrusion",
                source: `districts-${districtName}`,
                layout: {},
                paint: {
                    "fill-extrusion-color": "#2E8EFF", // Color of the extrusion
                    "fill-extrusion-opacity": 1, // Opacity of the extrusion
                    "fill-extrusion-height": 25000,
                },
            });
        }
    };

    return <div ref={mapContainerRef as any} className="w-full h-full" />;
};

export default Mapbox;
