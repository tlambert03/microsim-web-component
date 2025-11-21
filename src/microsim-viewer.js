import { css, html, LitElement } from "lit";
import "@awesome.me/webawesome/dist/styles/themes/default.css";
import "@awesome.me/webawesome/dist/components/slider/slider.js";

// Automatically detect the base URL for images based on where this script was loaded from
const scriptUrl = new URL(import.meta.url);
// In dev, Vite serves public dir at root, so images are at /images/
// In prod, images are relative to the script location at ./images
const isDev = scriptUrl.pathname.includes('/src/');
const defaultImgUrl = isDev
	? new URL('/images', scriptUrl.origin).href
	: new URL('./images', scriptUrl).href;

class MicrosimViewer extends LitElement {
	static properties = {
		imageIndex: { type: Number },
		imgUrl: { type: String },
	};

	static styles = css`
    :host {
      display: block;
      padding: 20px;
    }
    
    .container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
      height: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .controls {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .image-container {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;
      overflow: hidden;
    }
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `;

	constructor() {
		super();
		this.imageIndex = 0;
		this.imageCount = 3;
		this.imgUrl = defaultImgUrl;
	}

	getImageUrl(index) {
		return `${this.imgUrl}/image${index}.png`;
	}

	handleSliderChange(e) {
		this.imageIndex = parseInt(e.target.value, 10);
	}

	render() {
		return html`
      <div class="container">
        <div class="controls">
          <wa-slider
            label="Select Image"
            min="0"
            max="${this.imageCount - 1}"
            value="${this.imageIndex}"
            step="1"
            with-markers
            with-tooltip
            @input="${this.handleSliderChange}"
          >
            ${Array.from(
							{ length: this.imageCount },
							(_, i) => html`
              <span slot="reference">${i}</span>
            `,
						)}
          </wa-slider>
        </div>
        
        <div class="image-container">
          <img 
            src="${this.getImageUrl(this.imageIndex)}" 
            alt="Image ${this.imageIndex}"
            loading="lazy"
          >
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
