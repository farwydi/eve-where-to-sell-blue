import React from 'react';
import {Waypoint} from "eve-where-to-sell-blue";
import WaypointShow from "./WaypointShow";

interface SearchResultsProps {
    waypoints: Waypoint[];
    onSelectResult: (result: Waypoint) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({waypoints, onSelectResult}) => {
    const handleSelectResult = (result: Waypoint) => {
        onSelectResult(result);
    };

    return (
        <ul>
            {waypoints.map((waypoint) => (
                <li key={waypoint.id}
                    onClick={() => handleSelectResult(waypoint)}
                    className="cursor-pointer hover:font-bold">
                    <WaypointShow waypoint={waypoint}/>
                </li>
            ))}
        </ul>
    );
};

export default SearchResults;