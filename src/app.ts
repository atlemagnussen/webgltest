import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { doSetup } from "./services/glTriangle"
import { mainCube } from "./services/glCube"

@customElement('main-app')
export class MainAppComponent extends LitElement {
    
    private stream: MediaStream | null = null
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
    
    updated() {
        const canvas = this.shadowRoot.querySelector("#c") as HTMLCanvasElement
        // doSetup(canvas)
        mainCube(canvas)
    }
    
    render() {
        return html`
            ${
                html`
                    <header>
                        <h2>webgl test</h2>
                    </header>
                `
            }
            
            <main>
                <canvas id="c" width="800" height="600"></canvas>
            </main>
            <footer>
            </footer>
        `
    }
}
