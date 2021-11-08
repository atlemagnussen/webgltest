import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { initThree, resizeThree, shutdown } from "./main"

@customElement('three-test1')
export class ThreeTest1 extends LitElement {
    
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
    
    connectedCallback() {
        super.connectedCallback()
        window.addEventListener("resize", () => this.resizeCanvas())
    }
    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener("resize", () => this.resizeCanvas())
        shutdown()
    }

    updated() {
        this._canvas = this.shadowRoot?.querySelector("#c") as HTMLCanvasElement
        this.resizeCanvas()
        initThree(this._canvas)
    }
    
    resizeCanvas() {
        this._canvas = this.renderRoot.querySelector("#c")
        if (!this._canvas) {
            console.log("no canvas")
            return false
        }
        window.innerWidth
        const canvas = this._canvas as HTMLCanvasElement
        const w = window.innerWidth
        const h = window.innerHeight
        console.log(`Resize event width=${w}, height=${h}`)
        canvas.width = w
        canvas.height = h
        resizeThree()
        return true
    }
    
    render() {
        return html`
            <header>
            <div class="controls">
                <span>Controls:</span>
            </div>
            </header>
            
            <main>
                <canvas id="c" width="800" height="600"></canvas>
            </main>
            <footer>
            </footer>
        `
    }
}
