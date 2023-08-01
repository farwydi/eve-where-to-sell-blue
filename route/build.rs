use std::collections::HashMap;
use std::env;
use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::Path;

use serde::Deserialize;

static SYSTEM: &str = include_str!("../data/eve_map_with_blueloot.json");

static SEARCH_MAP: &str = include_str!("../data/search_map.json");

static BLUE_LOOT: &str = include_str!("../data/blueloot.json");

#[derive(Deserialize)]
pub struct SolarSystem {
    pub name: String,
    pub security: f64,
    pub neighbors: Vec<u32>,
    pub blue_loots: Vec<BlueLootShort>,
}

#[derive(Deserialize)]
pub struct BlueLootShort {
    pub location_id: u32,
    pub location_name: String,
}

#[derive(Deserialize)]
pub struct BlueLoot {
    pub solar_system_id: u32,
    pub location_id: u32,
    pub location_name: String,
}

fn main() {
    let out_dir = env::var_os("OUT_DIR").unwrap();

    let systems: HashMap<u32, SolarSystem> = serde_json::from_str(SYSTEM).unwrap();
    let search_map: HashMap<String, Vec<u32>> = serde_json::from_str(SEARCH_MAP).unwrap();
    let blue_loots: Vec<BlueLoot> = serde_json::from_str(BLUE_LOOT).unwrap();

    // map.rs

    let map_dest_path = Path::new(&out_dir).join("map.rs");
    let mut map_file = BufWriter::new(File::create(&map_dest_path).unwrap());

    let mut map_gen = phf_codegen::Map::new();

    for (id, ss) in &systems {
        // skip wormholes
        if *id >= 31000000 {
            continue;
        }
        map_gen.entry(
            id,
            format!(
                "eve::SolarSystem {{ security: {:.8}, neighbors: &{:?}, blue_loot_location: {} }}",
                ss.security, ss.neighbors, match ss.blue_loots.first() {
                    Some(bl) => format!("Some({})", bl.location_id),
                    _ => format!("None"),
                }.as_str(),
            ).as_str(),
        );
    }

    write!(
        &mut map_file,
        "static EVE_MAP: phf::Map<u32, eve::SolarSystem> = {}",
        map_gen.build()
    ).unwrap();
    write!(&mut map_file, ";\n").unwrap();

    // name.ts

    let name_dest_path = Path::new(&out_dir).join("name.rs");
    let mut name_file = BufWriter::new(File::create(&name_dest_path).unwrap());

    let mut name_gen = phf_codegen::Map::new();

    for (id, ss) in &systems {
        // skip wormholes
        if *id >= 31000000 {
            continue;
        }

        name_gen.entry(
            id,
            format!("\"{}\"", ss.name).as_str(),
        );

        for blue_loot in &ss.blue_loots {
            name_gen.entry(
                &blue_loot.location_id,
                format!("\"{}\"", blue_loot.location_name).as_str(),
            );
        }
    }

    write!(
        &mut name_file,
        "static EVE_NAME: phf::Map<u32, &str> = {}",
        name_gen.build()
    ).unwrap();
    write!(&mut name_file, ";\n").unwrap();

    // search.ts

    let search_dest_path = Path::new(&out_dir).join("search.rs");
    let mut search_file = BufWriter::new(File::create(&search_dest_path).unwrap());

    let mut search_gen = phf_codegen::Map::new();

    for (prefix, sid) in &search_map {
        search_gen.entry(
            prefix,
            format!("&{:?}", sid).as_str(),
        );
    }

    write!(
        &mut search_file,
        "static SEARCH_MAP: phf::Map<&str, &[u32]> = {}",
        search_gen.build()
    ).unwrap();
    write!(&mut search_file, ";\n").unwrap();

    // location.ts

    let location_dest_path = Path::new(&out_dir).join("location.rs");
    let mut location_file = BufWriter::new(File::create(&location_dest_path).unwrap());

    let mut location_gen = phf_codegen::Map::new();

    for bl in &blue_loots {
        location_gen.entry(
            &bl.location_id,
            format!("{}", bl.solar_system_id).as_str(),
        );
    }

    write!(
        &mut location_file,
        "static LOCATION: phf::Map<u32, u32> = {}",
        location_gen.build()
    ).unwrap();
    write!(&mut location_file, ";\n").unwrap();
}