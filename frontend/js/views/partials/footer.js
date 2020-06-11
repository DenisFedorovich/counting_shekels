import Component from '../../views/component.js';

class Footer extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <div class="container">
                    <div class="footer-information">
                        <p>
                            Created with love, pain and tears by Fedorovich<br>
                        </p>
                        <p>
                            Все права защищены 2020
                        </p>
                    </div>
                </div>
            `);
        });
    }
}

export default Footer;