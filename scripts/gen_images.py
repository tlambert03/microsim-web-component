from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from itertools import product 

import imageio.v3 as iio
import microsim.schema as ms
from microsim.schema.optical_config import lib

DEST = Path(__file__).parent.parent / "src" / "public" / "images"

# OBJECTIVE NAS
objective_nas = (0.45, 0.75, 1.4, 1.45)

# MODALITIES
modalities = {
    "widefield": ms.Widefield(),
    "confocal": ms.Confocal(pinhole_au=1.0)
}

BASE_SIMULATION = ms.Simulation(
    truth_space=ms.ShapeScaleSpace(shape=(32, 512, 512), scale=(0.064, 0.064, 0.064)),
    output_space={"downscale": 2},
    sample=ms.Sample(
        labels=[
            # pick dataset and layer name from https://openorganelle.janelia.org/datasets
            ms.FluorophoreDistribution(
                distribution=ms.CosemLabel(dataset="jrc_hela-3", label="er-mem_pred"),
                fluorophore="EGFP",
            ),
            # ms.FluorophoreDistribution(
            #     distribution=ms.CosemLabel(dataset="jrc_hela-3", label="mito-mem_pred"),
            #     fluorophore="mCherry",
            # ),
        ]
    ),
    objective_lens=ms.ObjectiveLens(na=1.4),
    channels=[
        lib.FITC,
        # lib.DSRED,
    ],
    modality=ms.Widefield(),
    detector=ms.CameraCCD(qe=0.82, read_noise=6),
    settings=ms.Settings(max_psf_radius_aus=2, random_seed=42),
)


def simulate(params: tuple, dest_path: Path = DEST) -> None:
    na, (modality_name, modality_obj) = params
    
    sim = BASE_SIMULATION.model_copy(deep=True)
    sim.objective_lens.numerical_aperture = na
    sim.modality = modality_obj
    result = sim.run()

    # scale 16 bit to 8 bit without clipping
    min_val = result.min()
    max_val = result.max()
    result_8bit = ((result - min_val) / (max_val - min_val) * 255.0).astype("uint8")

    middle_z = result.sizes["z"] // 2
    for c in range(result_8bit.sizes["c"]):
        image = result_8bit.isel(c=c, z=middle_z)
        channel_name = image.coords["c"].item().name
        filename = f"{modality_name}_ch{channel_name}_na{na}.webp"
        iio.imwrite(dest_path / filename, image)
        print(f"Saved: {filename}")


if __name__ == "__main__":
    
    # Create all combinations
    params = list(product(objective_nas, modalities.items()))

    with ThreadPoolExecutor() as executor:
        futures = list(executor.map(simulate, params))