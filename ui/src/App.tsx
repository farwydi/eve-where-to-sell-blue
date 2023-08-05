import React, {useState} from 'react';
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import SelectedResult from "./components/SelectedResult";
import {get_waypoint, search_solar_system_id, Waypoint} from "eve-where-to-sell-blue";

const App: React.FC = () => {
    const [searchResults, setSearchResults] = useState<Waypoint[]>([]);
    const [selectedResult, setSelectedResult] = useState<Waypoint>(get_waypoint(30000142)!);

    const handleSearch = (searchTerm: string) => {
        const systems: Waypoint[] = Array.from(search_solar_system_id(searchTerm))
            .map(ssid => get_waypoint(ssid)!)
            .sort((a, b) => b.security - a.security);

        setSearchResults(systems);

        if (systems.length == 1) {
            setSelectedResult(systems[0]);
        }
    };

    const handleSelectResult = (result: Waypoint) => {
        setSelectedResult(result);
    };

    return (
        <div className="m-5">
            <h1 className="text-white text-xl mb-5">Где продать синьку?</h1>
            <div className="flex">
                <div className="mr-5">
                    <SearchBar onSearch={handleSearch}/>
                    <SearchResults waypoints={searchResults}
                                   onSelectResult={handleSelectResult}/>
                </div>
                <SelectedResult selectedResult={selectedResult}/>
            </div>
        </div>
    );
};

export default App;