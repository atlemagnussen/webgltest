import {LitElement, html, css} from "lit"
import {customElement, property} from "lit/decorators.js"
import { selectedComponent, setSelectedComponent } from "@app/stores/componentStore"
import type { Subscription } from "rxjs"
import { gotoPath } from "@app/routing/router"

@customElement('component-selector')
export class ComponentSelector extends LitElement {
    sub: Subscription | null = null
    selected = ""

    static styles = css`
        :host {
            display: block;
            color: white;
        }
    `
    @property({attribute: false})
    components: string[] = []

    setSelected(e: Event) {
        // @ts-ignore
        let val = e.currentTarget.value
        if (val)
            gotoPath(`/${val}`)
    }

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
            <div>
                <p>SELECT</p>
                <mwc-select @selected=${(e:any) => this.setSelected(e)}>
                    <mwc-list-item value=""></mwc-list-item>
                    ${this.components.map(c => {
                        return html`
                            <mwc-list-item 
                                value=${c}
                                .selected=${c == this.selected}>
                                    <span>${c}</span>
                                    <!-- <mwc-icon slot="graphic">mic</mwc-icon> -->
                                
                            </mwc-list-item>
                        `
                    })}
                </mwc-select>
            </div>
        `
    }
}
