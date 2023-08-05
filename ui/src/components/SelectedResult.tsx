import React from 'react';
import {find_where_to_sell_blue, get_waypoint, Waypoint} from "eve-where-to-sell-blue";
import WaypointShow from "./WaypointShow";

interface SelectedResultProps {
    selectedResult: Waypoint;
}

const SelectedResult: React.FC<SelectedResultProps> = ({selectedResult}) => {
    const route: Waypoint[] = Array.from(find_where_to_sell_blue(selectedResult.id, 0))
        .map(ssid => get_waypoint(ssid)!);

    const jumps = (route: Waypoint[]): number => {
        if (route.length == 0) {
            return 0
        }

        return route.length - 1
    }

    return (
        <div className="w-[500px]">
            <div className="flex mb-1">
                <h2 className="text-white">Кратчайший маршрут</h2>
                <p className="text-white ml-auto">Jumps: <strong>{jumps(route)}</strong></p>
            </div>
            <ul>
                {route.map((waypoint) => (
                    <li key={waypoint.id}
                        className="cursor-pointer hover:font-bold"
                        onClick={() => {
                            navigator.clipboard.writeText(waypoint.name)
                        }}>
                        <WaypointShow waypoint={waypoint}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedResult;