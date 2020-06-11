import Component from '../../views/component.js';

class Error404 extends Component {
    render() {
        return new Promise(resolve => {
            resolve(`
                <div class="not-found">   
                    <div class="container">                     
                        <h1 class="page-title">ГЫ  404</h1>  
                        <img src="./img/404.jpg">
                    <div>    
                </div>         
            `);
        });
    }
}

export default Error404;