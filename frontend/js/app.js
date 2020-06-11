import {parseRequestURL} from './helpers/utils.js';

import Header from './views/partials/header.js';
import Footer from './views/partials/footer.js';

import AddAndList from './views/pages/category/category.js';

import Diagram from './views/pages/diagram/diagram.js';
import Targets from './views/pages/targets/targets.js';
import Error404 from './views/pages/error404.js';

const Routes = {
    '/': AddAndList,
    '/diagram': Diagram,
    '/targets': Targets,
};

function router() {
    const headerContainer = document.getElementById('header'),
          contentContainer = document.getElementById('main'),
          footerContainer = document.getElementById('footer'),
          header = new Header(),
          footer = new Footer();

    header.render().then(html => headerContainer.innerHTML = html);

    const request = parseRequestURL();
    const parsedURL = `/${request.resource || ''}`;
    const page = Routes[parsedURL] ? new Routes[parsedURL]() : new Error404();

    page.getData().then(data => {
        page.render(data).then(html => {
            contentContainer.innerHTML = html;
            page.afterRender();
        });
    });

    footer.render().then(html => footerContainer.innerHTML = html);
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);