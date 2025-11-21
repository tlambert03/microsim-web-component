import { css, html, LitElement } from "lit";
import "@awesome.me/webawesome/dist/styles/themes/default.css";
import "@awesome.me/webawesome/dist/components/slider/slider.js";




class ImageViewer extends LitElement {
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
		this.imgUrl = "./images";
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

customElements.define("image-viewer", ImageViewer);
