import { css, html, LitElement } from "lit";
import "@awesome.me/webawesome/dist/styles/themes/default.css";
// import "@awesome.me/webawesome/dist/components/page/page.js"; // not working w/npm despite version match
import "@awesome.me/webawesome/dist/components/slider/slider.js";
import "@awesome.me/webawesome/dist/components/select/select.js";
import "@awesome.me/webawesome/dist/components/option/option.js";
import '@awesome.me/webawesome/dist/components/button-group/button-group.js';
import '@awesome.me/webawesome/dist/components/progress-bar/progress-bar.js';
import '@awesome.me/webawesome/dist/components/tooltip/tooltip.js';
import '@awesome.me/webawesome/dist/components/details/details.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';


// Automatically detect the base URL for images based on where this script was loaded from
const scriptUrl = new URL(import.meta.url);
// In dev, Vite serves public dir at root, so images are at /images/
// In prod, images are relative to the script location at ./images
const isDev = scriptUrl.pathname.includes("/src/");
const defaultImgUrl = isDev
	? new URL("/images", scriptUrl.origin).href
	: new URL("./images", scriptUrl).href;

class MicrosimViewer extends LitElement {
static properties = {
    imgUrl: { type: String },
    na: { type: Number },
    modality: { type: String },
    filter: { type: String },
    exposure: { type: Number },
    power: { type: Number },
    brightnessMin: { type: Number },
    brightnessMax: { type: Number },
    acquisitionMode: { type: String },  // Add this
  };

static styles = css`
  :host {
    display: block;
    width: 100%;
    height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
    box-sizing: border-box;
    background: #1a1a1a;
    color: #e0e0e0;
  }

  * {
    box-sizing: border-box;
  }

  .page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "nav-header main-header aside-header"
      "nav main aside"
      "footer footer footer";
    width: 100%;
    height: 100vh;
    gap: 0;
  }

  /* Navigation column (left) */
  .nav-header {
    grid-area: nav-header;
    padding: 16px;
    background: #2a2a2a;
    border-right: 1px solid #3a3a3a;
    border-bottom: 1px solid #3a3a3a;
  }

  .nav {
    grid-area: nav;
    padding: 16px;
    background: #1e1e1e;
    border-right: 1px solid #3a3a3a;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Main column (center) */
  .main-header {
    grid-area: main-header;
    padding: 12px 20px;
    background: #2a2a2a;
    border-bottom: 1px solid #3a3a3a;
  }

  .main {
    grid-area: main;
    background: #0a0a0a;
    display: grid;
    grid-template-rows: 1fr auto;
    overflow: hidden;
  }

  .image-area {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: auto;
  }

  .histogram-area {
    padding: 16px 20px;
    background: #1a1a1a;
    border-top: 1px solid #3a3a3a;
  }

  /* Aside column (right) */
  .aside-header {
    grid-area: aside-header;
    padding: 16px;
    background: #2a2a2a;
    border-left: 1px solid #3a3a3a;
    border-bottom: 1px solid #3a3a3a;
    font-weight: 600;
    font-size: 14px;
    color: #e0e0e0;
  }

  .aside {
    grid-area: aside;
    padding: 16px;
    background: #1e1e1e;
    border-left: 1px solid #3a3a3a;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Footer */
  .footer {
    grid-area: footer;
    padding: 12px 20px;
    background: #2a2a2a;
    border-top: 1px solid #3a3a3a;
    font-size: 11px;
    color: #999;
    text-align: center;
  }

  /* Common styles */
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .control-group label {
    font-weight: 600;
    font-size: 13px;
    color: #e0e0e0;
  }

  .description {
    margin: 0;
    font-size: 12px;
    color: #999;
    line-height: 1.5;
  }

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: brightness(var(--brightness, 1)) contrast(var(--contrast, 1));
  }

  .histogram {
    width: 100%;
    height: 70px;
    background: #2a2a2a;
    border-radius: 4px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 11px;
  }

  .brightness-controls {
    display: flex;
    gap: 16px;
  }

  .slider-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .slider-group label {
    font-size: 11px;
    color: #999;
    font-weight: 500;
  }

  .slider-with-value {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .slider-with-value wa-slider {
    flex: 1;
  }

  .value-display {
    min-width: 65px;
    padding: 6px 10px;
    background: #2a2a2a;
    border-radius: 4px;
    text-align: center;
    font-size: 11px;
    font-weight: 500;
    color: #e0e0e0;
  }

  .footer a {
    color: #4CAF50;
    text-decoration: none;
  }

  .footer a:hover {
    text-decoration: underline;
  }

    /* Customize web-awesome buttons with TURQUOISE chrome effect */
  wa-button {
    --wa-button-color: #26225d;
  }

  wa-button::part(base) {
    /* Turquoise chrome gradient */
    background: linear-gradient(180deg, #7bcdcf 0%, #00a896 50%, #008880 100%);
    border: 1px solid #007770;
    border-radius: 6px; /* Rounded corners */
    padding: 8px 12px;
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.3),
      0 2px 4px rgba(0,0,0,0.5);
    transition: all 0.2s ease;
    color: #26225d;
    font-weight: 600;
  }

  wa-button:hover::part(base) {
    background: linear-gradient(180deg, #8bdde0 0%, #10b8a6 50%, #109890 100%);
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.4),
      0 2px 6px rgba(0,0,0,0.6);
  }

  wa-button[active]::part(base) {
    background: linear-gradient(180deg, #008880 0%, #00a896 50%, #7bcdcf 100%);
    box-shadow: 
      inset 0 2px 4px rgba(0,0,0,0.6),
      0 1px 0 rgba(255,255,255,0.3);
  }

  /* Customize button groups */
  wa-button-group::part(base) {
    gap: 2px;
    border-radius: 6px;
  }

  /* Customize select dropdowns */
  wa-select::part(combobox) {
    background: linear-gradient(180deg, #7bcdcf 0%, #00a896 50%, #008880 100%);
    border: 1px solid #007770;
    border-radius: 6px;
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.3),
      0 2px 4px rgba(0,0,0,0.5);
    color: #26225d;
    font-weight: 600;
  }

  wa-select:hover::part(combobox) {
    background: linear-gradient(180deg, #8bdde0 0%, #10b8a6 50%, #109890 100%);
  }

  wa-select::part(listbox) {
    background: #26225d;
    border: 1px solid #007770;
    border-radius: 6px;
  }

  wa-option::part(base) {
    background: #26225d;
    color: #cfe8e4;
    border-radius: 0px;
  }

  wa-option:hover::part(base) {
    background: #473f77;
  }

  /* Customize sliders */
  wa-slider::part(track) {
    background: #2a2a2a;
    border-radius: 3px;
    height: 6px;
  }

  wa-slider::part(track-active) {
    background: #cfe8e4; /* Light blue/teal */
    border-radius: 3px;
  }

  wa-slider::part(thumb) {
    width: 18px;
    height: 18px;
    background: linear-gradient(180deg, #7bcdcf 0%, #00a896 50%, #008880 100%);
    border: 1px solid #007770;
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.3),
      0 2px 4px rgba(0,0,0,0.5);
    border-radius: 50%;
  }

  /* Rounded corners on control groups */
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: #2a2a2a;
    border-radius: 8px;
    border: 1px solid #3a3a3a;
  }

  /* Style the value display boxes */
  .value-display {
    min-width: 65px;
    padding: 6px 10px;
    background: linear-gradient(180deg, #7bcdcf 0%, #00a896 50%, #008880 100%);
    border: 1px solid #007770;
    border-radius: 6px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: #26225d;
    box-shadow: 
      inset 0 1px 0 rgba(255,255,255,0.3),
      0 2px 3px rgba(0,0,0,0.4);
  }

    /* Accordion styles for channel settings */
  .channel-accordion {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  wa-details {
    background: #2a2a2a;
    border-radius: 8px;
    border: 1px solid #3a3a3a;
    overflow: hidden;
  }

  wa-details::part(base) {
    background: transparent;
  }

  wa-details::part(header) {
    background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
    padding: 12px;
    border-radius: 8px 8px 0 0;
  }

  wa-details[open]::part(header) {
    border-bottom: 1px solid #3a3a3a;
    border-radius: 8px 8px 0 0;
  }

  wa-details::part(summary) {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #cfe8e4;
    font-weight: 600;
    font-size: 13px;
  }

  wa-details::part(content) {
    padding: 12px;
    background: #1e1e1e;
  }

  wa-checkbox::part(base) {
    color: #cfe8e4;
  }

  wa-checkbox::part(control) {
    border: 2px solid #00a896;
    border-radius: 4px;
    background: #1a1a1a;
  }

  wa-checkbox[checked]::part(control) {
    background: linear-gradient(180deg, #7bcdcf 0%, #00a896 50%, #008880 100%);
    border-color: #007770;
  }

  .channel-controls {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .channel-header {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  /* Footer link styles - teal theme */
  .footer a {
    color: #7bcdcf;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer a:hover {
    color: #00a896;
    text-decoration: underline;
  }
`;

  constructor() {
    super();
    this.na = 0.45;
    this.modality = "widefield";
    this.filter = "widefield_blue";
    this.exposure = 100;
    this.power = 0.01;
    this.brightnessMin = 0;
    this.brightnessMax = 255;
    this.acquisitionMode = "snap";  // Add this
    this.imgUrl = defaultImgUrl;
  }

  // Map NA to magnification
  getMagnification() {
    const naToMag = {
      0.45: 10,
      0.75: 20,
      1.4: 60,
      1.45: 100,
    };
    return naToMag[this.na] || 60;
  }

  // getImageUrl() {
  //   const mag = this.getMagnification();
  //   const url = `${this.imgUrl}/${this.modality}_${this.filter}_na${this.na}_${mag}x_exp${this.exposure}ms_power${this.power}W.webp`;
  //   console.log("Loading image:", url);
  //   return url;
  // }
  getImageUrl() {
  // Placeholder image
  return `https://placehold.co/512x512/gray/white?text=WIP`;
  }


  handleAcquisitionModeChange(e) {
    this.acquisitionMode = e.target.value;
    console.log("Acquisition mode:", this.acquisitionMode);
  }

  handleNaChange(e) {
    this.na = parseFloat(e.target.value);
  }

  handleModalityChange(e) {
    this.modality = e.target.value;
    if (this.modality === "widefield") {
      this.filter = "widefield_blue";
    } else {
      this.filter = "confocal_405";
    }
  }

  handleFilterChange(e) {
    this.filter = e.target.value;
  }

  handleExposureChange(e) {
    this.exposure = parseInt(e.target.value);
  }

  handlePowerChange(e) {
    this.power = parseFloat(e.target.value);
  }

  handleBrightnessMinChange(e) {
    this.brightnessMin = parseInt(e.target.value);
    this.updateImageStyle();
  }

  handleBrightnessMaxChange(e) {
    this.brightnessMax = parseInt(e.target.value);
    this.updateImageStyle();
  }

  handleChannelToggle(channel, checked) {
  console.log(`Channel ${channel} toggled:`, checked);
  }

  updateImageStyle() {
    const range = this.brightnessMax - this.brightnessMin;
    const brightness = 1 - (this.brightnessMin / 255);
    const contrast = 255 / range;
    
    const img = this.shadowRoot.querySelector('img');
    if (img) {
      img.style.setProperty('--brightness', brightness);
      img.style.setProperty('--contrast', contrast);
    }
  }



  render() {
    return html`
      <div class="page-container">
        <!-- Nav Header: Modality (as dropdown) -->
        <div class="nav-header">
          <div class="control-group">
            <label>Modality</label>
            <wa-select value="${this.modality}" @wa-change="${this.handleModalityChange}">
              <wa-option value="widefield">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 3v18M3 12h18"/>
                  </svg>
                  Widefield
                </div>
              </wa-option>
              <wa-option value="confocal">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Confocal
                </div>
              </wa-option>
            </wa-select>
          </div>
        </div>

        <!-- Nav: Just Objective Lens -->
        <div class="nav">
          <div class="control-group">
              <label>Objective Lens</label>
              <wa-button-group value="${this.na}" @wa-change="${this.handleNaChange}">
                <wa-button value="0.45">
                  <div style="display: flex; flex-direction: column; line-height: 1.3;">
                    <span style="font-size: 11px;">10×</span>
                    <span style="font-size: 10px; opacity: 0.8;">NA 0.45</span>
                  </div>
                </wa-button>
                <wa-button value="0.75">
                  <div style="display: flex; flex-direction: column; line-height: 1.3;">
                    <span style="font-size: 11px;">20×</span>
                    <span style="font-size: 10px; opacity: 0.8;">NA 0.75</span>
                  </div>
                </wa-button>
                <wa-button value="1.4">
                  <div style="display: flex; flex-direction: column; line-height: 1.3;">
                    <span style="font-size: 11px;">60×</span>
                    <span style="font-size: 10px; opacity: 0.8;">NA 1.4</span>
                  </div>
                </wa-button>
                <wa-button value="1.45">
                  <div style="display: flex; flex-direction: column; line-height: 1.3;">
                    <span style="font-size: 11px;">100×</span>
                    <span style="font-size: 10px; opacity: 0.8;">NA 1.45</span>
                  </div>
                </wa-button>
              </wa-button-group>
          </div>
        </div>

       <!-- Main Header: Acquisition Mode -->
      <div class="main-header">
        <div class="control-group" style="padding: 0;">
          <label>Acquisition Mode</label>
          <wa-button-group value="${this.acquisitionMode}" @wa-change="${this.handleAcquisitionModeChange}">
            <wa-button value="live">
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
                Live
              </div>
            </wa-button>
            <wa-button value="snap">
              <div style="display: flex; align-items: center; gap: 6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Snap
              </div>
            </wa-button>
          </wa-button-group>
        </div>
      </div>

      <!-- Main: Image + Histogram -->
      <div class="main">
        <div class="image-area">
          <img 
            src="${this.getImageUrl()}" 
            alt="Microscopy simulation"
            @load="${this.updateImageStyle}"
          />
        </div>
        <div class="histogram-area">
          <div class="histogram">Intensity histogram (coming soon)</div>
          <div class="brightness-controls">
            <!-- brightness controls -->
          </div>
        </div>
      </div>


        <!-- Aside Header -->
        <div class="aside-header">
          Acquisition Settings
        </div>

        <!-- Aside: CHANNEL ACCORDIONS HERE (RIGHT SIDE) -->
        <div class="aside">
          <div class="channel-accordion">
            <!-- DAPI Channel -->
            <wa-details>
              <div slot="summary" class="channel-header">
                <wa-checkbox 
                  ?checked="${this.filter.includes('blue') || this.filter.includes('405')}"
                  @wa-change="${(e) => this.handleChannelToggle('dapi', e.target.checked)}"
                ></wa-checkbox>
                <span>DAPI (Nucleus)</span>
              </div>
              <div class="channel-controls">
                <div class="slider-group">
                  <label>Filter Set</label>
                  <wa-select 
                    value="${this.modality === 'widefield' ? 'widefield_blue' : 'confocal_405'}"
                    @wa-change="${(e) => this.filter = e.target.value}"
                  >
                    ${this.modality === 'widefield'
                      ? html`<wa-option value="widefield_blue">Blue</wa-option>`
                      : html`<wa-option value="confocal_405">405nm</wa-option>`
                    }
                  </wa-select>
                </div>
                <div class="slider-group">
                  <label>Power</label>
                  <div class="slider-with-value">
                    <wa-slider min="0" max="0.24" step="0.01" value="${this.power}" @wa-change="${this.handlePowerChange}"></wa-slider>
                    <div class="value-display">${this.power.toFixed(2)} W/cm²</div>
                  </div>
                </div>
                <div class="slider-group">
                  <label>Exposure</label>
                  <div class="slider-with-value">
                    <wa-slider min="1" max="1000" value="${this.exposure}" @wa-change="${this.handleExposureChange}"></wa-slider>
                    <div class="value-display">${this.exposure} ms</div>
                  </div>
                </div>
              </div>
            </wa-details>

            <!-- EGFP Channel -->
            <wa-details>
              <div slot="summary" class="channel-header">
                <wa-checkbox 
                  ?checked="${this.filter.includes('green') || this.filter.includes('488')}"
                  @wa-change="${(e) => this.handleChannelToggle('egfp', e.target.checked)}"
                ></wa-checkbox>
                <span>EGFP (ER)</span>
              </div>
              <div class="channel-controls">
                <div class="slider-group">
                  <label>Filter Set</label>
                  <wa-select 
                    value="${this.modality === 'widefield' ? 'widefield_green' : 'confocal_488'}"
                    @wa-change="${(e) => this.filter = e.target.value}"
                  >
                    ${this.modality === 'widefield'
                      ? html`<wa-option value="widefield_green">Green</wa-option>`
                      : html`<wa-option value="confocal_488">488nm</wa-option>`
                    }
                  </wa-select>
                </div>
                <div class="slider-group">
                  <label>Power</label>
                  <div class="slider-with-value">
                    <wa-slider min="0" max="0.24" step="0.01" value="${this.power}" @wa-change="${this.handlePowerChange}"></wa-slider>
                    <div class="value-display">${this.power.toFixed(2)} W/cm²</div>
                  </div>
                </div>
                <div class="slider-group">
                  <label>Exposure</label>
                  <div class="slider-with-value">
                    <wa-slider min="1" max="1000" value="${this.exposure}" @wa-change="${this.handleExposureChange}"></wa-slider>
                    <div class="value-display">${this.exposure} ms</div>
                  </div>
                </div>
              </div>
            </wa-details>

            <!-- mCherry Channel -->
            <wa-details>
              <div slot="summary" class="channel-header">
                <wa-checkbox 
                  ?checked="${this.filter.includes('red') || this.filter.includes('561')}"
                  @wa-change="${(e) => this.handleChannelToggle('mcherry', e.target.checked)}"
                ></wa-checkbox>
                <span>mCherry (Mitochondria)</span>
              </div>
              <div class="channel-controls">
                <div class="slider-group">
                  <label>Filter Set</label>
                  <wa-select 
                    value="${this.modality === 'widefield' ? 'widefield_red' : 'confocal_561'}"
                    @wa-change="${(e) => this.filter = e.target.value}"
                  >
                    ${this.modality === 'widefield'
                      ? html`<wa-option value="widefield_red">Red</wa-option>`
                      : html`<wa-option value="confocal_561">561nm</wa-option>`
                    }
                  </wa-select>
                </div>
                <div class="slider-group">
                  <label>Power</label>
                  <div class="slider-with-value">
                    <wa-slider min="0" max="0.24" step="0.01" value="${this.power}" @wa-change="${this.handlePowerChange}"></wa-slider>
                    <div class="value-display">${this.power.toFixed(2)} W/cm²</div>
                  </div>
                </div>
                <div class="slider-group">
                  <label>Exposure</label>
                  <div class="slider-with-value">
                    <wa-slider min="1" max="1000" value="${this.exposure}" @wa-change="${this.handleExposureChange}"></wa-slider>
                    <div class="value-display">${this.exposure} ms</div>
                  </div>
                </div>
              </div>
            </wa-details>
          </div>
        </div>


        <!-- Footer: Acknowledgements -->
        <div class="footer">
          Simulations by <a href="https://github.com/tlambert03/microsim" target="_blank">microsim</a> • 
          Data from <a href="https://openorganelle.janelia.org/" target="_blank">OpenOrganelle</a> • 
          Optical configurations & fluorophore spectra from <a href="https://www.fpbase.org/" target="_blank">FPbase</a>
        </div>
      </div>
    `;
  }
}


customElements.define("microsim-viewer", MicrosimViewer);


// For cases like moodle where custom elements are sanitized or not allowed,
// we also look for divs with data-component="microsim-viewer"
// and replace them with the web component.
function initViewers() {
	document
		.querySelectorAll('[data-component="microsim-viewer"]')
		.forEach((el) => {
			const viewer = document.createElement("microsim-viewer");

			// grab all data- attributes and pass them to the viewer
			Object.keys(el.dataset).forEach((key) => {
				viewer[key] = el.dataset[key];
			});

			el.replaceWith(viewer);
		});
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initViewers);
} else {
	initViewers();
}
