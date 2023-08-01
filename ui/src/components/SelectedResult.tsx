import React from 'react';
import {find_where_to_sell_blue, get_waypoint, Waypoint} from "eve-where-to-sell-blue";
import {securityColor} from "../util";

interface SelectedResultProps {
    selectedResult: Waypoint;
}

const SelectedResult: React.FC<SelectedResultProps> = ({selectedResult}) => {
    const route: Waypoint[] = Array.from(find_where_to_sell_blue(selectedResult.id, 0))
        .map(ssid => get_waypoint(ssid)!);

    return (
        <div>
            <h2 className="text-white">Кратчайший маршрут</h2>
            <p className="text-white">От: {selectedResult.name}</p>
            <ul>
                {route.map((waypoint) => (
                    <li key={waypoint.id}
                        className="cursor-pointer hover:font-bold"
                        onClick={() => {navigator.clipboard.writeText(waypoint.name)}}>
                        <span className={securityColor(waypoint.security)}>{waypoint.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SelectedResult;