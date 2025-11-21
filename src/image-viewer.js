import { LitElement, html, css } from 'lit';
import '@awesome.me/webawesome/dist/styles/themes/default.css';
import '@awesome.me/webawesome/dist/components/slider/slider.js';

class ImageViewer extends LitElement {
  static properties = {
    imageIndex: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      height: 100vh;
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
  }

  images = [
    '/images/image0.png',
    '/images/image1.png',
    '/images/image2.png'
  ];

  handleSliderChange(e) {
    this.imageIndex = parseInt(e.target.value);
  }

  render() {
    return html`
      <div class="container">
        <div class="controls">
          <wa-slider
            label="Select Image"
            min="0"
            max="2"
            value="${this.imageIndex}"
            step="1"
            with-markers
            with-tooltip
            @input="${this.handleSliderChange}"
          >
            <span slot="reference">0</span>
            <span slot="reference">1</span>
            <span slot="reference">2</span>
          </wa-slider>
        </div>
        
        <div class="image-container">
          <img src="${this.images[this.imageIndex]}" alt="Image ${this.imageIndex}">
        </div>
      </div>
    `;
  }
}

customElements.define('image-viewer', ImageViewer);
