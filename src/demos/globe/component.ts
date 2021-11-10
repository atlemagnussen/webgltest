import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { debounce } from "@app/funcs/helpers"
import { setup } from "./main"

@customElement('globe-page')
export class GlobePage extends LitElement {
    _isrunning = false
    _canvas: HTMLCanvasElement | null = null
    _popup: HTMLDivElement | null = null
    interval = 500
    debounceSetup = debounce(() => {
        console.log("debounce setup")
        if (this._canvas)
            setup(this._canvas!, this._popup!)
    }, 500, this.interval)
    
    constructor() {
        super()
    }
    static styles = css`
        :host {
            background: black;
            position: absolute;
            top:0;
            left:0;
		    display: grid;
		    grid-template-rows: auto 1fr auto;
		    box-sizing: border-box;
            height: 100vh;
            width: 100%;
		    min-height: 100%;
            touch-action: none;
	    }

        main {
            background: var(--av-main-background);
        }
        section {
            z-index: 10;
        }
        canvas {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            background-color: black;
            width: 100%;
            height: 100%;
        }
        #popup {
            z-index: 100;
            display: none;
            position: absolute;
            background: var(--gl-controls-background);
            padding: 0.1rem;
            border-radius: 4px;
            color: white;
        }
        /* @media only screen and (max-width: 640px) {
            
        } */
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
        this._popup = this.shadowRoot?.querySelector("#popup") as HTMLDivElement
    }

    render() {
        return html`
            <header>
            
            </header>
            <canvas id="c"></canvas>
            <section>
            
            </section>
            <div id="popup">
                <span>Hello</span>
            </div>
        `
    }
}
