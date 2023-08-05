import React from 'react';
import {Waypoint} from "eve-where-to-sell-blue";
import {securityColor, securityRound} from "../util";

interface WaypointProps {
    waypoint: Waypoint;
}

const WaypointShow: React.FC<WaypointProps> = ({waypoint}) => {
    return (
        <div className={securityColor(waypoint.security) + " flex"}>
            <div className="min-w-[34px] text-right">
                {securityRound(waypoint.security)}
            </div>
            <div className="min-w-[0.5rem]"></div>
            <div>{waypoint.name}</div>
        </div>
    );
};

export default WaypointShow;