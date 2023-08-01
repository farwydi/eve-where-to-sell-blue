use pathfinding::prelude::dijkstra;
use wasm_bindgen::prelude::*;

include!(concat!(env!("OUT_DIR"), "/map.rs"));
include!(concat!(env!("OUT_DIR"), "/name.rs"));
include!(concat!(env!("OUT_DIR"), "/search.rs"));
include!(concat!(env!("OUT_DIR"), "/location.rs"));

#[wasm_bindgen]
#[derive(Debug, Copy, Clone)]
pub enum RouteType {
    Safest,
    Shortest,
    LessSafe,
}

fn calculate_weight(solar_system_id: &u32, weight: RouteType) -> u32 {
    let solar_system = EVE_MAP.get(solar_system_id).unwrap();

    match weight {
        RouteType::Shortest => 1,
        RouteType::Safest => if solar_system.security < 0.45 { 50000 } else { 1 }
        RouteType::LessSafe => if solar_system.security >= 0.45 { 50000 } else { 1 }
    }
}

fn successors(solar_system_id: &u32, weight: RouteType) -> Vec<(u32, u32)> {
    let solar_system = EVE_MAP.get(solar_system_id).unwrap();

    solar_system.neighbors.iter().
        map(|solar_system_id| (*solar_system_id, calculate_weight(solar_system_id, weight))).
        collect::<Vec<_>>()
}

fn success(solar_system_id: &u32) -> bool {
    let solar_system = EVE_MAP.get(solar_system_id).unwrap();

    solar_system.blue_loot_location.is_some()
}

#[wasm_bindgen]
pub fn find_where_to_sell_blue(start_solar_system_id: u32, weight: RouteType) -> Vec<u32> {
    let r = dijkstra(
        &start_solar_system_id,
        |solar_system_id| successors(solar_system_id, weight),
        success,
    );

    match r {
        Some(mut t) => {
            if let Some(last) = t.0.last_mut() {
                let solar_system = EVE_MAP.get(&last).unwrap();

                if let Some(location) = solar_system.blue_loot_location {
                    *last = location;
                }
            }

            t.0
        }
        _ => vec![]
    }
}

#[wasm_bindgen]
pub fn search_solar_system_id(prefix: String) -> Vec<u32> {
    let binding = prefix.trim().to_lowercase();
    let key = binding.as_str();

    if let Some(systems) = SEARCH_MAP.get(key).cloned() {
        return systems.to_vec();
    }

    vec![]
}

#[wasm_bindgen]
pub struct Waypoint {
    pub id: u32,
    name: String,
    pub security: f64,
}

#[wasm_bindgen]
impl Waypoint {
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(setter)]
    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }
}

#[wasm_bindgen]
pub fn get_waypoint(id: u32) -> Option<Waypoint> {
    if let Some(solar_system) = EVE_MAP.get(&id) {
        let name = EVE_NAME.get(&id).unwrap();

        return Some(Waypoint {
            id,
            name: name.to_string(),
            security: solar_system.security,
        });
    }

    if let Some(solar_system_id) = LOCATION.get(&id) {
        let name = EVE_NAME.get(&id).unwrap();
        let solar_system = EVE_MAP.get(solar_system_id).unwrap();

        return Some(Waypoint {
            id,
            name: name.to_string(),
            security: solar_system.security,
        });
    }

    None
}