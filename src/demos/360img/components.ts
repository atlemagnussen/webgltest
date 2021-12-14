import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"
import { debounce } from "@app/funcs/helpers"

@customElement('panorama-image')
export class PanoramaImage extends LitElement {
    constructor() {
        super()
    }
    static styles = css`
        :host {
            background: black;
            /* position: absolute;
            top:0;
            left:0; */
		    display: grid;
		    grid-template-rows: auto 1fr auto;
		    box-sizing: border-box;
            height: 100vh;
            width: 100%;
		    min-height: 100%;
            touch-action: none;
	    }
        img {
            display: none;
        }
        a-scene {
            width: 100%;
            height: 100%;
        }
    `

    render() {
        return html`
            <header>
            
            </header>
            
            <section>
                <a-scene>
                    <a-assets>
                        <img id="img" src="https://storage.googleapis.com/trainquility-project.appspot.com/assets/Tilde.jpg" />
                    </a-assets>
                    <a-sky id="img-360" radius="10" src="#img"> </a-sky>
                </a-scene>
            </section>
            
        `
    }
}
