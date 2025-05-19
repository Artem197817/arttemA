import WOW from 'wow.js';
import 'animate.css';
import $ from 'jquery';
import './jquery.ripples.js';

export class Main {

    waterElement = $('#water')
    isWaterActive = false;
    buttonActivateWater = document.getElementById('water-button');

    constructor() {
        this.init();
        this.carouselInit();
        this.neuroInit();
    }

    init() {
        new WOW({
            animateClass: 'animate__animated',
            offset: 100, // optional, distance to trigger animation
            mobile: true, // optional, trigger animations on mobile devices
            live: true,
        }).init();


        if (this.buttonActivateWater) {
            this.buttonActivateWater.addEventListener('click', (e) => {
                if (!this.isWaterActive) {
                    e.preventDefault();
                    this.buttonActivateWater.innerText = 'Выключить'
                    this.isWaterActive = true
                    this.waterElement.ripples({
                        resolution: 500,
                        dropRadius: 20,
                        perturbance: 0.02
                    });
                } else {
                    e.preventDefault();
                    this.buttonActivateWater.innerText = 'Активировать эффект'
                    this.isWaterActive = false;
                    this.waterElement.ripples('destroy');
                }
            })
        }

    }

    carouselInit() {
        let startX = 0
        let active = 0
        let isDown = false
        const speedDrag = -0.1
        const getZindex = (array, index) => (array.map((_, i) => (index === i) ? array.length : array.length - Math.abs(index - i)))
        const carousel = document.querySelector('.carousel')
        const $items = document.querySelectorAll('.carousel-item')
        let progress = 10 * $items.length / 2
        const displayItems = (item, index, active) => {
            const zIndex = getZindex([...$items], active)[index]
            item.style.setProperty('--zIndex', zIndex)
            item.style.setProperty('--active', (index - active) / $items.length)
            item.style.setProperty('--items', $items.length)
        }
        const animate = () => {
            progress = Math.max(0, Math.min(progress, $items.length * 10))
            active = Math.floor(progress / ($items.length * 10) * ($items.length - 1))
            $items.forEach((item, index) => displayItems(item, index, active))
        }
        animate()
        $items.forEach((item, i) => {
            item.addEventListener('click', () => {
                progress = (i / $items.length) * $items.length * 10 + 10
                animate()
            })
        })
        const handleMouseMove = (e) => {
            if (!isDown) return
            const x = e.clientX || (e.touches && e.touches[0].clientX) || 0
            const mouseProgress = (x - startX) * speedDrag
            progress = progress + mouseProgress
            startX = x
            animate()
        }
        const handleMouseDown = e => {
            isDown = true
            startX = e.clientX || (e.touches && e.touches[0].clientX) || 0
        }
        const handleMouseUp = () => {
            isDown = false
        }
        carousel.addEventListener('mousedown', handleMouseDown)
        carousel.addEventListener('mousemove', handleMouseMove)
        carousel.addEventListener('mouseup', handleMouseUp)
        carousel.addEventListener('touchstart', handleMouseDown)
        carousel.addEventListener('touchmove', handleMouseMove)
        carousel.addEventListener('touchend', handleMouseUp)

        const portfolioPopUp = $('#portfolio-pop-up');

        $('.carousel-item').dblclick(function () {
            const imageSrc = $(this).find('img').attr('src');
            const newImage = `<img src="${imageSrc}"
     alt="Изображение" class="portfolio-pop-up-img"/>
      <div class="close-pop-up">Двойной клик чтобы закрыть</div>`;
            portfolioPopUp.html(newImage).css('display', 'flex');
        });

        // Лучше так:
        portfolioPopUp.on('dblclick', function (e) {
            if (
                $(e.target).is('.portfolio-pop-up-img') ||
                $(e.target).is('#portfolio-pop-up')
            ) {
                portfolioPopUp.css('display', 'none');
            }
        });
    }
    neuroInit(){

const shader = {
    vertex: `precision mediump float;
    varying vec2 vUv;
    attribute vec2 a_position;
    void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
    }`,
    fragment: `precision mediump float;
    varying vec2 vUv;
    uniform float u_time;
    uniform float u_ratio;
    uniform vec2 u_pointer_position;
    uniform float u_scroll_progress;
    vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }
    float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;
    for (int j = 0; j < 16; j++) {
    uv = rotate(uv, 1.);
    sine_acc = rotate(sine_acc, 1.);
    vec2 layer = uv * scale + float(j) + sine_acc - t;
    sine_acc += sin(layer);
    res += (.5 + .5 * cos(layer)) / scale;
    scale *= (1.2 - .07 * p);
    }
    return res.x + res.y;
    }
    void main() {
    vec2 uv = .5 * vUv;
    uv.x *= u_ratio;
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0., 1.);
    p = .5 * pow(1. - p, 2.);
    float t = .001 * u_time;
    vec3 color = vec3(0.);
    float noise = neuro_shape(uv, t, p);
    noise = 1.2 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);
    noise *= (1. - length(vUv - .5));
    color = normalize(vec3(.2, .5 + .4 * cos(3. * u_scroll_progress), .5 + .5 * sin(3. * u_scroll_progress)));
    color = color * noise;
    gl_FragColor = vec4(color, noise);
    }`
};        
const cont = document.getElementById('neuro');
const canvasEl = document.createElement("canvas");
const parentRect = cont.getBoundingClientRect();
cont.appendChild(canvasEl);
const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
const pointer = {
    x: 0,
    y: 0,
    tX: 0,
    tY: 0,
};
let uniforms;
const gl = initShader();
setupEvents();
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
render();
function initShader() {
    const vsSource = shader.vertex;
    const fsSource = shader.fragment;
    const gl = canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");
    if (!gl) {
        alert("WebGL is not supported by your browser.");
    }
    function createShader(gl, sourceCode, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, sourceCode);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    const vertexShader = createShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
    function createShaderProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }
    const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
    uniforms = getUniforms(shaderProgram);
    function getUniforms(program) {
        let uniforms = [];
        let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }
    const vertices = new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(shaderProgram);
    const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    return gl;
}
 
function render() {
    const currentTime = performance.now();
    pointer.x += (pointer.tX - pointer.x) * .5;
    pointer.y += (pointer.tY - pointer.y) * .5;
    gl.uniform1f(uniforms.u_time, currentTime);
    gl.uniform2f(uniforms.u_pointer_position, pointer.x / cont.offsetWidth, 1 - pointer.y / cont.offsetHeight);
    gl.uniform1f(uniforms.u_scroll_progress, window["pageYOffset"] / (2 * cont.offsetHeight));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
function resizeCanvas() {
    canvasEl.width =   parentRect.width//cont.offsetWidth * devicePixelRatio;
    canvasEl.height  =  parentRect.height//cont.offsetHeight * devicePixelRatio;
    gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
    gl.viewport(0, 0, canvasEl.width, canvasEl.height);
}
function setupEvents() {
    window.addEventListener("pointermove", e => {
        updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener("touchmove", e => {
        updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    });
    window.addEventListener("click", e => {
        updateMousePosition(e.pageX, e.pageY);
    });
    function updateMousePosition(eX, eY) {
        pointer.tX = eX - cont.offsetLeft;
        pointer.tY = eY - cont.offsetTop;
    }
}
    }
}