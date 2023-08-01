package main

import (
	_ "embed"
	"encoding/json"
	"os"
	"strings"
)

//go:embed data/blueloot.json
var blueLootData []byte

type BlueLootInfo struct {
	SolarSystemID int64  `json:"solar_system_id"`
	LocationID    int64  `json:"location_id"`
	LocationName  string `json:"location_name"`
}

//go:embed data/system_map.json
var systemMapData []byte

type System struct {
	Name      string  `json:"name"`
	Security  float64 `json:"security"`
	Neighbors []int64 `json:"neighbors"`

	// calculate params
	BlueLoots []BlueLoot `json:"blue_loots"`
}

type BlueLoot struct {
	LocationID   int64  `json:"location_id"`
	LocationName string `json:"location_name"`
}

func main() {
	var err error
	var systemMap map[int64]*System

	err = json.Unmarshal(systemMapData, &systemMap)
	if err != nil {
		panic(err)
	}

	var blueLoots []BlueLootInfo

	err = json.Unmarshal(blueLootData, &blueLoots)
	if err != nil {
		panic(err)
	}

	blueLootMap := map[int64][]BlueLoot{}
	for _, bl := range blueLoots {
		blueLootMap[bl.SolarSystemID] = append(blueLootMap[bl.SolarSystemID], BlueLoot{
			LocationID:   bl.LocationID,
			LocationName: bl.LocationName,
		})
	}

	for sid, system := range systemMap {
		system.BlueLoots = blueLootMap[sid]
		if system.BlueLoots == nil {
			system.BlueLoots = make([]BlueLoot, 0)
		}
	}

	eveMapFile, err := os.OpenFile("../data/eve_map_with_blueloot.json", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, os.ModePerm)
	if err != nil {
		panic(err)
	}
	defer eveMapFile.Close()

	err = json.NewEncoder(eveMapFile).Encode(systemMap)
	if err != nil {
		panic(err)
	}

	searchMap := make(map[string][]int64, len(systemMap))

	for sid, system := range systemMap {
		if sid >= 31000000 {
			continue
		}

		for i := range system.Name {
			subName := system.Name[:i+1]
			subName = strings.ToLower(subName)

			searchMap[subName] = append(searchMap[subName], sid)
		}
	}

	searchMapFile, err := os.OpenFile("../data/search_map.json", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, os.ModePerm)
	if err != nil {
		panic(err)
	}
	defer searchMapFile.Close()

	err = json.NewEncoder(searchMapFile).Encode(searchMap)
	if err != nil {
		panic(err)
	}
}
