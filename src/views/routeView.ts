const html = String.raw
class RouteView extends HTMLElement {
    private component: string = ""
    
    constructor() {
        super()
        this.attachShadow({mode: 'open'}) //this.shadowRoot will be set
    }
    static get observedAttributes() {
        return ["view"]
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name == "view") {
            this.component = newValue
            this.update()
        }
    }
    // connectedCallback() {
    //     this.update()
    // }
    update() {
        const view = document.createElement(this.component)
        // if (this.param)
        //     view.setAttribute("param", this.param)
        this.removeAllChildren()
        this.shadowRoot?.appendChild(view)
    }
    removeAllChildren() {
        var child = this.shadowRoot?.lastElementChild
        while (child) {
            this.shadowRoot?.removeChild(child)
            child = this.shadowRoot?.lastElementChild
        }
    }
}
customElements.define('route-view', RouteView);