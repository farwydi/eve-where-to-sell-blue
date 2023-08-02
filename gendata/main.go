package main

import (
	"bytes"
	_ "embed"
	"encoding/csv"
	"encoding/json"
	"os"
	"strconv"
	"strings"
)

//go:embed data/blueloot.json
var blueLootData []byte

type BlueLootInfo struct {
	SolarSystemID int64  `json:"solar_system_id"`
	LocationID    int64  `json:"location_id"`
	LocationName  string `json:"location_name"`
}

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

//go:embed data/mapSolarSystems.csv
var mapSolarSystems []byte

//go:embed data/mapSolarSystemJumps.csv
var mapSolarSystemJumps []byte

var regionFilter = map[int64]struct{}{
	// Jove
	10000004: {},
	10000017: {},
	10000019: {},
	// Pochven
	10000070: {},
	// w-space
	11000001: {},
	11000002: {},
	11000003: {},
	11000004: {},
	11000005: {},
	11000006: {},
	11000007: {},
	11000008: {},
	11000009: {},
	11000010: {},
	11000011: {},
	11000012: {},
	11000013: {},
	11000014: {},
	11000015: {},
	11000016: {},
	11000017: {},
	11000018: {},
	11000019: {},
	11000020: {},
	11000021: {},
	11000022: {},
	11000023: {},
	11000024: {},
	11000025: {},
	11000026: {},
	11000027: {},
	11000028: {},
	11000029: {},
	11000030: {},
	11000031: {},
	11000032: {},
	11000033: {},
	// other
	12000001: {},
	12000002: {},
	12000003: {},
	12000004: {},
	12000005: {},
	13000001: {},
	14000001: {},
	14000002: {},
	14000003: {},
	14000004: {},
	14000005: {},
}

func main() {
	var err error
	systemMap := map[int64]*System{}

	mapSolarSystemsCsv := csv.NewReader(bytes.NewReader(mapSolarSystems))
	_, err = mapSolarSystemsCsv.Read()
	if err != nil {
		panic(err)
	}

	mapSolarSystemsRows, err := mapSolarSystemsCsv.ReadAll()
	if err != nil {
		panic(err)
	}

	for _, row := range mapSolarSystemsRows {
		regionID, err := strconv.ParseInt(row[0], 10, 64)
		if err != nil {
			panic(err)
		}

		if _, f := regionFilter[regionID]; f {
			continue
		}

		solarSystemID, err := strconv.ParseInt(row[2], 10, 64)
		if err != nil {
			panic(err)
		}

		solarSystemName := row[3]

		security, err := strconv.ParseFloat(row[21], 10)
		if err != nil {
			panic(err)
		}

		systemMap[solarSystemID] = &System{
			Name:      solarSystemName,
			Security:  security,
			Neighbors: make([]int64, 0),
		}
	}

	mapSolarSystemJumpsCsv := csv.NewReader(bytes.NewReader(mapSolarSystemJumps))
	_, err = mapSolarSystemJumpsCsv.Read()
	if err != nil {
		panic(err)
	}

	mapSolarSystemJumpsRows, err := mapSolarSystemJumpsCsv.ReadAll()
	if err != nil {
		panic(err)
	}

	for _, row := range mapSolarSystemJumpsRows {
		fromSolarSystemID, err := strconv.ParseInt(row[2], 10, 64)
		if err != nil {
			panic(err)
		}

		toSolarSystemID, err := strconv.ParseInt(row[3], 10, 64)
		if err != nil {
			panic(err)
		}

		if system, found := systemMap[fromSolarSystemID]; found {
			system.Neighbors = append(system.Neighbors, toSolarSystemID)
		}
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
