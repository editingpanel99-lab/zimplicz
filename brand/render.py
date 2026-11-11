# Renders the logo SVGs in this folder to transparent PNGs (run: py -I render.py)
import pathlib, pymupdf

here = pathlib.Path(__file__).parent
jobs = {
    "zimplicz-logo-on-dark.svg": 3,
    "zimplicz-logo-on-light.svg": 3,
    "zimplicz-icon.svg": 2,
}
for name, scale in jobs.items():
    doc = pymupdf.open(here / name)
    pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=True)
    out = here / name.replace(".svg", ".png")
    pix.save(out)
    print(out.name, pix.width, "x", pix.height)
