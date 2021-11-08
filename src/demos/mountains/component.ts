import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { debounce } from "@app/funcs/helpers"
import { setup } from "./main"

@customElement('three-mountain')
export class ThreeMountain extends LitElement {
    _isrunning = false
    _canvas: HTMLCanvasElement | null = null

    debounceSetup: Function
    interval = 500
    constructor() {
        super()
        this.debounceSetup = debounce(() => {
            console.log("debounce setup")
            if (this._canvas)
                setup(this._canvas!)
        }, 500, this.interval)
    }
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
            top: 10rem;
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
		    justify-content: center;
		    align-items: center;
            width: 100%;
            color: white;
	    }
        main {
            background: var(--av-main-background);
        }

        canvas {
            background-color: grey;
        }
        h1 {
            font-size: 10rem;
        }
    `
    
    disconnectedCallback() {
        console.log("disconnectedCallback")
        super.disconnectedCallback()
        stop()
    }
    connectedCallback() {
        super.connectedCallback()
        console.log("connectedCallback")
        this.debounceSetup()
    }

    updated() {
        this._canvas = this.shadowRoot?.querySelector("#c") as HTMLCanvasElement
    }

    render() {
        return html`
            <header>
                <h1>Hello</h1>
            </header>
            
            <section>
                <canvas id="c" width="800" height="600"></canvas>
            </section>
            
        `
    }
}
