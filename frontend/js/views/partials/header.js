import Component from '../../views/component.js';

class Header extends Component {
    render() {
        const resource = this.request.resource;

        return new Promise(resolve => {
            resolve(`
                <div class="container">                   
                    <nav class="menu-desktop" id="menu-desktop">
                        <ul>
                            <li><a href="/#/" class="menu-item ${!resource ? 'active' : ''}">Операции</a></li>
                            <li><a href="/#/diagram/" class="menu-item ${resource === 'diagram' ? 'active' : ''}">Диаграмма</a></li>
                            <li><a href="/#/targets/" class="menu-item ${resource === 'targets' ? 'active' : ''}">Цели</a></li>
                        </ul>
                    </nav>
                </div>
            `);
        });
    }
}

export default Header;
