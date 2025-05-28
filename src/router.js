import {
    Main
} from "./components/main";
import {
    Order
} from "./components/order";

export class Router {

    constructor() {
        this.pageTitleElement = document.getElementById("page-title");
        this.adminLteStyleElement = document.getElementById("adminlte_style");
        this.contentElement = document.getElementById('content');
        this.linkStyles = document.getElementById('styles');

        this.routes = [{
                route: '#/',
                title: 'Главная',
                template: '/templates/main.html',
                styles: ['style.less'],

                load: () => {
                    new Main();
                }

            },
            {
                route: '#/order',
                title: 'Заказ',
                template: '/templates/order.html',
                styles: ['order.less'],

                load: () => {
                    new Order();
                }
            }
        ];
    }
    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (!newRoute) {
            window.location.href = "#/";
            return;
        }

        try {
            await this.loadTemplate(newRoute);
            this.applyStyles(newRoute.styles);
            this.pageTitleElement.innerText = newRoute.title;

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } catch (error) {
            console.error('Error opening route:', error);
            location.href = '#/404';
        }
    }

    async loadTemplate(route) {
        let contentBlock = this.contentElement;

        if (route.useLayout) {
            try {
                const layoutResponse = await fetch(route.useLayout);
                if (!layoutResponse.ok) throw new Error('Failed to load layout');

                contentBlock.innerHTML = await layoutResponse.text();
                contentBlock = document.getElementById('content-layout');
                if (route.useSecondLayout) {
                    const layoutResponse = await fetch(route.useSecondLayout);
                    if (!layoutResponse.ok) throw new Error('Failed to load layout');

                    contentBlock.innerHTML = await layoutResponse.text();
                    contentBlock = document.getElementById('main-content');
                }
            } catch (error) {
                console.error('Error loading layout:', error);
                throw error; // Пробрасываем ошибку дальше
            }
        }

        try {
            const templateResponse = await fetch(route.template);
            if (!templateResponse.ok) throw new Error('Failed to load template');

            contentBlock.innerHTML = await templateResponse.text();
        } catch (error) {
            console.error('Error loading template:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }

    async activateRoute(e, oldRoute = null) {
        // Удаление стилей текущего маршрута, если он существует
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);

            if (currentRoute && currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    const styleLink = document.querySelector(`link[href='css/${style}']`);
                    if (styleLink) {
                        styleLink.remove(); // Удаляем стиль, если он существует
                    }
                });

                // Вызываем функцию unload, если она определена
                if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                    currentRoute.unload();
                }
            }
        }

        // Получаем новый маршрут из URL
        const urlRoute = window.location.hash.split('?')[0];
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            // Добавляем новые стили
            this.applyStyles(newRoute.styles);

            // Обновляем заголовок страницы
            if (newRoute.title) {
                this.pageTitleElement.innerText = newRoute.title;
            }

            // Загружаем шаблон
            await this.loadTemplate(newRoute);

            // Вызываем функцию load, если она определена
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            location.href = '#/404';
        }
    }

    applyStyles(styles) {
        if (styles && styles.length > 0) {
            styles.forEach(style => {
                const existingStyleLink = document.querySelector(`link[href='/css/${style}']`);

                if (!existingStyleLink) { // Проверяем, существует ли стиль
                    const link = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = 'css/' + style;

                    // Обработка ошибок при загрузке стиля
                    link.onerror = () => {
                        console.error(`Failed to load stylesheet: ${link.href}`);
                    };

                    document.head.insertBefore(link, this.linkStyles);
                }
            });
        }
    }


}