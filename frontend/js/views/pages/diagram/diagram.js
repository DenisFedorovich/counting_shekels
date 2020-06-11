import Component from '../../component.js';

import Operations from '../../../models/operations.js';

class Diagram extends Component {
    constructor() {
        super();

        this.model = new Operations();
    }

    getData() {
        return new Promise(resolve => this.model.getOperationsList().then(operations => {
            this.operations = operations;
            resolve(operations);

        }));
    }

    render(operations) {
        return new Promise(resolve => {
            resolve(`
                <div class="diagram">
                    <h2>Общие расходы</h2>
                    <div class="container">
                    
                        <div class="operations-block">
                            <div class="filter">
                            <p>
                                <b>За какой месяц:</b>
                                <select class="select-month" name="filter-months">
                                    <option value='13' selected>За все время</option>
                                    <option value='1'>Январь</option>
                                    <option value='2'>Февраль</option>
                                    <option value='3'>Март</option>
                                    <option value='4'>Апрель</option>
                                    <option value='5'>Май</option>
                                    <option value='6'>Июнь</option>
                                    <option value='7'>Июль</option>
                                    <option value='8'>Август</option>
                                    <option value='9'>Сентябрь</option>
                                    <option value='10'>Октябрь</option>
                                    <option value='11'>Ноябрь</option>
                                    <option value='12'>Декабрь</option>
                                </select>
                            </p>
                            <button class="filter-operations-button">Показать</button>
                        </div>
                            <div class="table-row-head">
                                <span class="table-date">Дата</span>
                                <span class="table-count">Сумма</span>
                                <span class="table-description">Описание</span>
                                <span class="table-category">Категория</span>
                            </div>
                            ${operations.filter(operaion => operaion.operation != 'income').map(operations => this.getOperationHTML(operations)).join('\n ')}
                        </div>
                        <div class="diagram-block">
                            <canvas id="popChart" width="600" height="400"></canvas>
                        </div>                      
                    </div>
                </div>
            `);
        });
    }

    afterRender() {
        this.setActions();

        this.createDiagram();
    }

    setActions() {
        const filterOperationsBtn = document.getElementsByClassName('filter-operations-button')[0];
        const selectMonth = document.getElementsByClassName('select-month')[0];
        
        filterOperationsBtn.addEventListener('click', () => this.filterMonth(selectMonth.value));
    }

    filterMonth(month) {
        const valueMonth = +month;
        const rows = [];
        rows.push.apply(rows, document.getElementsByClassName('table-row'));

        rows.forEach(row => {
            const date = row.getElementsByClassName('table-data')[0].innerText.split('.')[1];

            if(+date !== valueMonth) {
                row.classList.add('hidden');
            } else {
                row.classList.remove('hidden');
            }
            if (valueMonth == 13) {
                row.classList.remove('hidden');
            }
        });
        
        this.createDiagram();
    }

    createDiagram() {
        const allRows = [];
        allRows.push.apply(allRows, document.getElementsByClassName('table-row'));

        const filteredRows = allRows.filter(elem => !elem.classList.contains('hidden'));

        const categoriesAndCount = filteredRows.map(row => {
            const category = row.getElementsByClassName('table-category')[0];
            const count = row.getElementsByClassName('table-count')[0];
            return ({
                category: category.innerText,
                count: count.innerText
            })
        });

        const sums = categoriesAndCount.reduce((prev, curr) => {
            const sum = prev.get(curr.category) || 0;
            prev.set(curr.category, +curr.count + sum);
            return prev;
        }, new Map());

        const reducedTotalConsamptions = [...sums].map(([category, count]) => {
            return {category, count}
        });
        
        const consumptionsCategoriesList = [];
        const consumptionsCountsList = [];

        reducedTotalConsamptions.forEach(operation => {
            consumptionsCategoriesList.push(operation.category);
        });

        reducedTotalConsamptions.forEach(operation => {
            consumptionsCountsList.push(+operation.count);
        });

        const consumptionsDiagram = document.getElementById("popChart").getContext("2d");

        const consumptionsData = {
            labels: consumptionsCategoriesList,
            datasets: [
                {
                    data: consumptionsCountsList,
                    backgroundColor: [
                        "#b61f1f",
                        "#1f93b6",
                        "#291fb6",
                        "#1fb65e",
                        "#3acbbf",
                        "#8b1fb6",
                        "#b65b1f",
                        "#1fb690",
                        "#b61f59"
                    ]
                }]
        };

        const doughnutChart = new Chart(consumptionsDiagram, {
            type: 'doughnut',
            data: consumptionsData,
        });
    }

    getOperationHTML(operation) {
        return `
            <div class="table-row" data-id="${operation.id}" datetime="${operation.date}">
                <span class="table-data ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"} data-id="${operation.id}">${operation.date}</span>
                <span class="table-count ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"} data-id="${operation.id}">${operation.count}</span>
                <span class="table-description ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"}" data-id="${operation.id}">${operation.description}</span>
                <span class="table-category ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"}" data-id="${operation.id}">${operation.category}</span>
            </div>
        `;
    }
}

export default Diagram;