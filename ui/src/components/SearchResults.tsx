import React from 'react';
import {Waypoint} from "eve-where-to-sell-blue";
import {securityColor} from "../util";

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
                    <span className={securityColor(waypoint.security)}>
                        {waypoint.name}
                    </span>
                </li>
            ))}
        </ul>
    );
};

export default SearchResults;