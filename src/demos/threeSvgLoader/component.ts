import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { setup, changExtrusion, changeScale, stop } from "./main"

@customElement('three-svg-loader1')
export class MainAppComponent extends LitElement {
    
    _canvas: HTMLCanvasElement | null = null

    static styles = css`
        :host {
		    display: grid;
		    grid-template-rows: auto 1fr auto;
		    box-sizing: border-box;
            height: 100%;
            width: 100%;
		    min-height: 100%;
	    }
	    header {
		    position: absolute;
            z-index: 10;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
		    justify-content: center;
		    align-items: center;
            width: 100%;
	    }
        main {
            background: var(--av-main-background);
        }
	    .controls {
            /* height: 300px;
            width: 500px; */
            background: var(--gl-controls-background);
            /* opacity: 0.3; */
            border-radius: 5px;
            color: white;
            padding: 0.5rem;
            /* animation: fadeout 2s; */
            /* animation-fill-mode: forwards; */
            /* animation-delay: 0; */
        }
        
        a {
            color: var(--av-main-foreground);
        }

        canvas {
            background-color: grey;
        }
    `
    
    disconnectedCallback() {
        super.disconnectedCallback()
        stop()
    }

    updated() {
        this._canvas = this.shadowRoot?.querySelector("#c") as HTMLCanvasElement
        //this.resizeCanvas()
        //initThree(this._canvas)
        setup(this._canvas)
    }
    
    rangeChange(e: Event) {
        //@ts-ignore
        let val = e.currentTarget.value
        changExtrusion(Number(val))
    }
    scaleChange(e: Event) {
        //@ts-ignore
        let val = e.currentTarget.value
        changeScale(Number(val))
    }
    render() {
        return html`
            <header>
            <div class="controls">
                <span>Controls:</span>
                <input type="range" min="1" max="50" id="input" value="1" @input=${(e:Event) => this.rangeChange(e)} />
                <input type="range" min="0.001" max="0.01" step="0.001" id="input" value="0.005"
                    @input=${(e:Event) => this.scaleChange(e)} />
            </div>
            </header>
            
            <section>
                <canvas id="c" width="800" height="600"></canvas>
            </section>
            
        `
    }
}
