import MapComponent from "@/components/map-components";
import Mapbox from "@/components/mapbox";
import { Suspense } from "react";

export default async function Home() {
 

    return (
        <main className="w-full h-full">
            <Suspense fallback={<div>loading...</div>}>
                <MapComponent />
            </Suspense>
        </main>
    );
}
