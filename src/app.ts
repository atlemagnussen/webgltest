import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

// import "@material/mwc-icon"
// import "@material/mwc-button"
import "@material/mwc-select"
import "@material/mwc-list"
import "@material/mwc-list/mwc-list-item"

import "@app/styles/colors.css"
import "@app/styles/theme.css"
import "@app/styles/site.css"

import "@app/views/routeView"
import "@app/views/componentSelector"

import "@app/demos"

import { selectedComponent } from "@app/stores/componentStore"
import { Subscription } from "rxjs"

const comps = ["three-test1", "three-svg-loader1"]
@customElement('main-app')
export class MainAppComponent extends LitElement {
    sub: Subscription | null = null
    selected = ""
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
            opacity: 0;
		    position: absolute;
            /* z-index: -1; */
            left: 0;
            top: 100px;
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
		    justify-content: center;
		    align-items: center;
            height: 300px;
	    }
        header:hover {
            opacity: 1;
            z-index: 10;
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
    `    
    
    connectedCallback() {
        super.connectedCallback()
        this.sub = selectedComponent.subscribe(s => {
            this.selected = s
            this.requestUpdate()
        })
    }
    disconnectedCallback() {
        super.disconnectedCallback()
        this.sub?.unsubscribe()
    }
    render() {
        return html`
            <header>
                ${
                    this.selected ? html`
                    <div class="controls">
                        <component-selector .components=${comps}></component-selector>
                    </div>` : html``
                }
            </header>
            
            <main>
                ${
                    this.selected ? html`
                        <route-view view=${this.selected}></route-view>
                    ` : html`
                        <component-selector .components=${comps}></component-selector>
                    `
                }
            </main>
            <footer>
            </footer>
        `
    }
}
