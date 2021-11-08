import {LitElement, html, css} from "lit"
import {customElement} from "lit/decorators.js"

import { debounce } from "@app/funcs/helpers"
import { setup } from "./main"

@customElement('landing-page')
export class LandingPage extends LitElement {
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
            background: black;
            position: absolute;
            top:0;
            left:0;
		    display: grid;
		    grid-template-rows: auto 1fr auto;
		    box-sizing: border-box;
            height: 100vh;
            width: 100vw;
		    min-height: 100%;
	    }
	    
        article {
            box-sizing: border-box;
            width: 50vw;
            margin: auto;
            color: var(--cyan);
        }
        main {
            background: var(--av-main-background);
        }
        section {
            z-index: 10;
        }
        canvas {
            position: fixed;
            top: 0;
            left: 0;
            background-color: black;
            height: 100vh;
            width: 100vw;
        }
        @media only screen and (max-width: 640px) {
            article {
                width: 100vw;
                padding: 0.5rem;
                margin: 0;
            }
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
            
            </header>
            <canvas id="c"></canvas>
            <section>
            <article id="sane-scanners-on-linux"><h1 id="scannersonlinuxprojectsanetestedwithraspberrypiasserversharingacanonmg6150overthelan">Scanners on Linux - Project SANE - Tested with Raspberry Pi as server sharing a Canon MG6150 over the LAN</h1>
                
                <p>So you might have tried to install some 8 year old drivers from Canon on an up-to-date Linux distribution. It will not remotely work in any ways. Turns out we have great open source alternatives with a lot of support</p>
                <h3 id="forprintersyouhavecupshttpswwwcupsorgandforscannersyouhavesanehttpwwwsaneprojectorg">For printers you have <a href="https://www.cups.org/">CUPS</a> and for scanners you have <a href="http://www.sane-project.org/">SANE</a>.</h3>
                <p>They pretty much saves the day if you don't want to have a dedicated Windows PC just for scanning or printing every once in a while. As the world shifts to the full digital age, it's less and less common to perform these tasks. Yet when you need the old hardware to work, you need it badly. Printers are not famous for being very trustworthy or stable. Because after all, the manufacturers make money on the ink and not on good hardware. It's a perfect usecase for a tiny Raspberry Pi, as these tasks don't require much horse power.</p>
                <p><em>Even though you have one device for both scanner and printer, they are separate things. Nowadays multi-function boxes like this is pretty common, but the software is still pretty different for scanning and printing. Also the official Windows drivers and software are separate</em></p>
                <h2 id="thisarticleisforthescanningpart">This article is for the scanning part</h2>
                <p>First and foremost, this is a setup that works both for LAN connection and USB connection as I figured out for this particular scanner, Canon MG6150. You should just try with LAN if you are doing this with a network enabled device, then try USB if it's doesn't work.</p>
                <h2 id="serverraspberrypi">Server - Raspberry Pi</h2>
                <p>So I won't cover setting up a Pi with Raspbian OS. You can go to <a href="https://www.raspberrypi.org/downloads/raspbian/">Raspberry PI</a> homepages to find that<br>
                <em>You can use any PC you want for this of course, old or new, big or small</em></p>
                <h3 id="installingsane">Installing SANE</h3>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">sudo apt install sane-utils
                </code></pre>
                <p>Most distros have SANE in their main repositories. So this should install what you need.</p>
                <h3 id="detectthescanner">Detect the scanner</h3>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">scanimage -L
                </code></pre>
                <p>If you have a working LAN connection to your scanner it might look like this:<br>
                <code class=" language-none">device pixma:MG6100_Canon6150-wired' is a CANON Canon PIXMA MG6100 multi-function peripheral</code></p>
                <p>For USB it might look like this:<br>
                <code class=" language-none">device pixma:04A9174A_41A152' is a CANON Canon PIXMA MG6100 multi-function peripheral</code></p>
                <h4 id="troubleshootinglandetection">Troubleshooting LAN detection</h4>
                <p>I don't know excactly what makes my scanner work with LAN. Other than of course with the official Windows driver it also works and it's a network multi-function printer.
                If you know your scanner's IP-address, type it into the browser and see if you can get a settings page.
                Or go through your settings manually on the scanner's own screen and menu system -
                and try to enable everything you can find. For Canon there are some stuff under "Other settings":<br>
                <code class=" language-none">WSD - LLTD - Bonjour - LPR - all enabled</code></p>
                <h4 id="troubleshootingusbdetection">Troubleshooting USB detection</h4>
                <p>If you have trouble finding anything, try with <code class=" language-none">lsusb</code> and see if there is anything like this<br>
                <code class=" language-none">Bus 001 Device 004: ID 04a9:174a Canon, Inc.</code></p>
                <p>If this does not work, try <code class=" language-none">sudo sane-find-scanner</code>, it might return something like this<br>
                <code class=" language-none">found USB scanner (vendor=0x04a9 [Canon], product=0x174a [MG6100 series]) at libusb:001:004</code></p>
                <h3 id="testingthescannerontheserver">Testing the scanner on the server</h3>
                <p>So if <em>scanimage -L</em> returns something, it's time to test actual scanning, stick a picture in there and type:  </p>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">scanimage &gt; test.ppm
                </code></pre>
                <p><br>
                the file will be an image that you can open in Gimp for verification. You can actually use this command line tool as your primary scanner client if you don't mind. See -h for options and you will see that you can controll all typical settings like resolution and colors and so on.</p>
                <h3 id="sharingthescanneroverlan">Sharing the scanner over LAN</h3>
                <p>Once you have successfully test scanned from your Raspberry Pi scanner server, it's time to share.</p>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">sudo nano /etc/sane.d/saned.conf
                </code></pre>
                <p>and uncomment <code class=" language-none">192.168.1.0/24</code> for enabling you typical LAN subnet, or just type a single or more IP addresses to enable access to saned from other computers</p>
                <p><em>If you have a firewall enabled you should open up for incoming connections on port 6566</em></p>
                <p>Then start the socket service (if you use systemd)</p>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">sudo systemctl start saned.socket
                </code></pre>
                <h4 id="makingitstillshareafterreboot">Making it still share after reboot</h4>
                
                
                <h2 id="theclient">The client</h2>
                <p>This should be the easy part if no network or firewall magic is playing its games with you. Installation command is the same as for the server:</p>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">sudo apt install sane-utils
                </code></pre>
                <p>But this time you only need to edit this file:
                <code class=" language-none">sudo nano /etc/sane.d/net.conf</code>and set the server's ip and a timeout
                <strong>connect_timeout = 60</strong><br>
                <strong>192.168.1.6</strong></p>
                <h3 id="testontheclient">Test on the client</h3>
                <p>Familiar command:<br>
                <code class=" language-none">scanimage -L</code> for listing, should look something like this<br>
                <code class=" language-none">device net:192.168.1.6:pixma:MG6100_Canon6150-wired' is a CANON Canon PIXMA MG6100 multi-function peripheral</code></p>
                <p>Then <code class=" language-none">scanimage &gt; test.ppm</code> to test scanning</p>
                <p>If you got this far you might be good enough, as I said this is as good a client.</p>
                <h3 id="graphicalclient">Graphical client</h3>
                <p>Enter <a href="http://gscan2pdf.sourceforge.net/">gscan2pdf</a>
                The project is still pouring out new versions in 2018. Amazing, and it warms my heart when I see open source projects like this endure. To get the latest explore the official good old sourceforge page. Or just get whatever version apt has to offer</p>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">sudo apt install gscan2pdf
                </code></pre>
                <p>This client is pretty much as good as it gets.</p>
                <h2 id="atypicalproblem">A typical problem</h2>
                <p>If you have a problem on the client, try to see log files on the server, a quick way is asking systemd right after the error occours.</p>
                <pre class=" language-terminal" tabindex="0"><code class="terminal  language-terminal">sudo systemctl status saned.socket
                </code></pre>
                <p>If the error is this one:</p>
                <blockquote>
                <p>saned.socket: Too many incoming connections (1), dropping connection.</p>
                </blockquote>
                <p>then I have a tip
                
                <code class=" language-none">MaxConnections=1</code></p>
                <p>So it only accepts one connection, which you will run into pretty fast:
                Fix this by copying the file over to the etc/systemd file structure and edit it</p>
                
                <p>Change the MaxConnection to something higher like<br>
                <code class=" language-none">MaxConnections=50</code></p>
                <p>Then reload and restart:</p>
                
                <p>And you should be good</p>
            </article>
            </section>
            
        `
    }
}
