#[derive(Clone)]
pub struct SolarSystem<'a> {
    pub security: f64,
    pub neighbors: &'a [u32],
    pub blue_loot_location: Option<u32>,
}