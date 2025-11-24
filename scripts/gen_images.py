from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from itertools import product 
from functools import lru_cache

import imageio.v3 as iio
import microsim.schema as ms
from microsim.schema.optical_config import lib

DEST = Path(__file__).parent.parent / "src" / "public" / "images"

# OBJECTIVE NAS & MAGNIFICATIONS
# organized as NA, Magnification
objectives = [
    (0.45, 10),
    (0.75, 20),
    (1.4, 60),
    (1.45, 100),
]

# DISK PINHOLE SIZE 
PINHOLE_SIZE_UM = 50

# EMISSION PEAKS PER FLUOROPHORE
EM_PEAKS = {
    'confocal_405': 0.461,  # DAPI emission peak
    'confocal_488': 0.520,  # EGFP emission peak  
    'confocal_561': 0.610,  # mCherry emission peak
}

def calculate_pinhole_au(pinhole_um, wavelength_um, na, magnification):
    """Convert physical pinhole size to Airy Units"""
    airy_disk_um = 1.22 * wavelength_um * magnification / na
    return pinhole_um / airy_disk_um

# MODALITIES & FILTER SETS
# FPBase microscope ID for the filter sets
microscope_id = "QaADgrEPMPn3UiqAyZVmA"

def get_modality_filters(na, mag):
    """Generate modality filters with correct pinhole AU for given objective NA & magnification"""
    return {
        'widefield': {
            'widefield_blue': ms.Widefield(),
            'widefield_green': ms.Widefield(),
            'widefield_red': ms.Widefield(),
        },
        'confocal': {
            'confocal_405': ms.Confocal(
                pinhole_au=calculate_pinhole_au(PINHOLE_SIZE_UM, EM_PEAKS['confocal_405'], na, mag)
            ),
            'confocal_488': ms.Confocal(
                pinhole_au=calculate_pinhole_au(PINHOLE_SIZE_UM, EM_PEAKS['confocal_488'], na, mag)
            ),
            'confocal_561': ms.Confocal(
                pinhole_au=calculate_pinhole_au(PINHOLE_SIZE_UM, EM_PEAKS['confocal_561'], na, mag)
            ),
        }
    }

# ILLUMINATION (approximate with fluorophore concentration)
concentrations = [0, 0.5, 1.0, 2.0] # testing...123

# EXPOSURE TIMES (ms)
exposure_times = [1, 50, 100]  # testing...123


BASE_SIMULATION = ms.Simulation(
    truth_space=ms.ShapeScaleSpace(shape=(32, 512, 512), scale=(0.064, 0.064, 0.064)),
    output_space={"downscale": 2},
    sample=ms.Sample(
        labels=[
            # pick dataset and layer name from https://openorganelle.janelia.org/datasets
            ms.FluorophoreDistribution(
                distribution=ms.CosemLabel(dataset="jrc_hela-3", label="nucleus_pred"), 
                fluorophore="DAPI", concentration=1.0),

            ms.FluorophoreDistribution(
                distribution=ms.CosemLabel(dataset="jrc_hela-3", label="er-mem_pred"),
                fluorophore="EGFP", concentration=1.0,
            ),
            ms.FluorophoreDistribution(
                distribution=ms.CosemLabel(dataset="jrc_hela-3", label="mito-mem_pred"),
                fluorophore="mCherry", concentration=1.0,
            ),
        ]
    ),
    objective_lens=ms.ObjectiveLens(na=1.4),
    channels=[
        lib.DAPI,
        lib.FITC,
        lib.DSRED,
    ],
    modality=ms.Widefield(),
    detector=ms.CameraCCD(qe=0.82, read_noise=6, exposure_ms=100),
    settings=ms.Settings(max_psf_radius_aus=2, random_seed=42),
)

@lru_cache(maxsize=None) # cache the configs so that FPbase fetching doesn't happen each time
def get_optical_config(filter_name):
    """Gets optical config options from FPBase"""
    # Map filter names to FPBase config names
    config_map = {
        'widefield_blue': "Widefield Blue",
        'widefield_green': "Widefield Green", 
        'widefield_red': "Widefield Red",
        'confocal_405': "Confocal 405",
        'confocal_488': "Confocal 488",
        'confocal_561': "Confocal 561"
    }
    
    return ms.OpticalConfig.from_fpbase(
        microscope_id=microscope_id, 
        config_name=config_map[filter_name]
    )

def simulate(params: tuple, dest_path: Path = DEST) -> None:
    na, mag, modality_type, filter_name, modality_obj, exposure_ms, concentration = params
    
    sim = BASE_SIMULATION.model_copy(deep=True)
    sim.objective_lens.numerical_aperture = na
    sim.modality = modality_obj
    sim.channels = [get_optical_config(filter_name)]
    sim.exposure_ms = exposure_ms

    # set concentration of fluorophores
    for label in sim.sample.labels:
        label.concentration = concentration
    
    result = sim.run()

    # scale 16 bit to 8 bit without clipping
    min_val = result.min()
    max_val = result.max()
    result_8bit = ((result - min_val) / (max_val - min_val) * 255.0).astype("uint8")

    middle_z = result.sizes["z"] // 2
    for c in range(result_8bit.sizes["c"]):
        image = result_8bit.isel(c=c, z=middle_z)
        channel_name = image.coords["c"].item().name
        filename = f"{modality_type}_{filter_name}_na{na}_{mag}x_exp{exposure_ms}_conc{concentration}.webp"
        iio.imwrite(dest_path / filename, image)
        print(f"Saved: {filename}")



if __name__ == "__main__":
    # Create all valid combinations
    params = [
        (na, mag, modality_type, filter_name, modality_obj, exposure_ms, concentration)
        for na, mag in objectives
        for modality_type, filters in get_modality_filters(na, mag).items()
        for filter_name, modality_obj in filters.items()
        for exposure_ms in exposure_times
        for concentration in concentrations
    ]
    
    print(f"Generating {len(params)} images...")
    print(f"Using {PINHOLE_SIZE_UM}µm physical pinhole size")
    print(f"Exposure times: {exposure_times} ms")
    print(f"Concentrations: {concentrations}")
    
    # Run first one to populate cache
    print("Warming up cache...")
    simulate(params[0])
    
    # Limit to 4 workers to reduce cache conflicts
    print("Running remaining simulations...")
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = list(executor.map(simulate, params[1:]))