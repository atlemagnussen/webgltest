import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

// import { doSetup } from "./services/glTriangle"
import { mainCube } from "./services/glCube"

@customElement('main-app')
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
		    background: var(--av-main-background);
		    display: flex;
		    flex-direction: row;
		    justify-content: space-between;
		    align-items: center;
		    width: 100%;
	    }
        main {
            background: var(--av-main-background);
        }
	    footer {
		    display: flex;
		    justify-content: center;
		    z-index: 500;
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
    }

    updated() {
        this._canvas = this.shadowRoot?.querySelector("#c") as HTMLCanvasElement
        // doSetup(canvas)
        mainCube(this._canvas)
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
        return true
    }
    render() {
        return html`
            <header>    
            </header>
            
            <main>
                <canvas id="c" width="800" height="600"></canvas>
            </main>
            <footer>
            </footer>
        `
    }
}
