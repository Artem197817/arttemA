import WOW from 'wow.js';
import 'animate.css';
import $ from 'jquery';
import './jquery.ripples.js';

export class Main {

    waterElement = $('#water')
    isWaterActive = false;
    buttonActivateWater = document.getElementById('water-button');

    constructor() {
        this.init()
        this.carouselInit()
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
}