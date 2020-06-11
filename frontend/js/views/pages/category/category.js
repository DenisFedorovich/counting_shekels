import Component from '../../../views/component.js';

import Operations from '../../../models/operations.js';

class AddAndList extends Component {
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
            <div class="container">
            <div class="main-block">
                <aside class="debit-and-credit">
                    <h2>ИНФОРМАЦИЯ</h2>
                    <div class="summary-consumptions">
                        <b>Общие расходы:</b>
                        <span class="total-consumptions"></span>
                    </div>
                    <div class="summary-income">
                        <b>Общие доходы:</b>
                        <span class="total-incomes"></span>
                    </div>
                    <div class="balance">
                        <b>Баланс:</b>
                        <span class="total-balance"></span>
                    </div>
                </aside>
                <div class="summary">
                    <h2>СВОДНАЯ ТАБЛИЦА</h2>
                    <p>
                        <b>Сумма:</b>
                        <input class="count" type="text">
                    </p>
                    <p>
                        <b>Описание:</b>
                        <input class="description" type="text">
                    </p>
                    <p>
                        <b>Категория:</b>
                        <select class="select-category" name="list">
                            <option value="Еда" selected="selected">Еда</option>
                            <option value="Жилье">Жилье</option>
                            <option value="Транспорт">Транспорт</option>
                            <option value="Счета">Счета</option>
                            <option value="Развлечения">Развлечения</option>
                            <option value="Одежда">Одежда</option>
                            <option value="Гигиена">Гигиена</option>
                            <option value="Здоровье">Здоровье</option>
                            <option value="Питомцы">Питомцы</option>
                        </select>
                    </p>
                    <div class="operations-buttons-block">
                        <button class="add-operation-btn cons-btn" id="cons-btn" disabled>Расход</button>
                        <button class="add-operation-btn income-btn" id="income-btn" disabled>Доход</button>
                    </div>
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
                    <div class="summary-table">
                        <div class="table-row-head">
                            <span class="table-date">Дата</span>
                            <span class="table-count">Сумма</span>
                            <span class="table-description">Описание</span>
                            <span class="table-category">Категория</span>
                        </div>
                        ${operations.map(operations => this.getOperationHTML(operations)).join('\n ')}
                    </div>
                </div>
            </div>
        </div>
			`);
        });
    }

    afterRender() {
        this.setActions();

        this.getTotalConsumptions();
        this.getTotalIncomes();
        this.getBalance();
    }

    setActions() {
        const addConsumptionBtn = document.getElementById('cons-btn');
        const addIncomeBtn = document.getElementById('income-btn');
        const addCount = document.getElementsByClassName('count')[0];
        const addDescription = document.getElementsByClassName('description')[0];
        const addCategory = document.getElementsByClassName('select-category')[0];
        const consumptionsContainer = document.getElementsByClassName('summary-table')[0];
        const operationsContainer = document.getElementsByClassName('summary')[0];
        const sumConsamtions = document.getElementsByClassName('total-consumptions')[0];
        const selectMonth = document.getElementsByClassName('select-month')[0];

        addCount.onkeyup = disableBtn;
        addDescription.onkeyup = disableBtn;

        function disableBtn() {
            addConsumptionBtn.disabled = !(addCount.value.trim() && addDescription.value.trim());
            addIncomeBtn.disabled = !(addCount.value.trim() && addDescription.value.trim());
        }

        operationsContainer.addEventListener('click', event => {
            const target = event.target;
            const targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('add-operation-btn'):
                    this.addOperation(addCount, addDescription, addCategory, addConsumptionBtn, addIncomeBtn, consumptionsContainer, targetClassList, sumConsamtions);
                    break;

                case targetClassList.contains('remove-consumption'):
                    this.removeOperation(target.parentNode);
                    break;

                case targetClassList.contains('filter-operations-button'):
                    this.filterMonth(selectMonth.value);
                    break;
            }
        });
    }

    addOperation(addCount, addDescription, addCategory, addConsumptionBtn, addIncomeBtn, consumptionsContainer, targetClassList, sumConsamtions) {
        if (!Number.isNaN(parseFloat(addCount.value)) && addCount.value > 0) {
            const newOperation = {
                date: this.getCurrentDate(),
                count: (+addCount.value.trim()).toFixed(2),
                description: addDescription.value.trim(),
                operation: `${targetClassList.contains('cons-btn') ? 'consumption' : 'income'}`,
                category: `${targetClassList.contains('cons-btn') ? addCategory.value : 'Шекели пришли'}`,
            };

            this.model.addOperation(newOperation).then(operation => {
                this.clearAddTask(addCount, addDescription, addConsumptionBtn, addIncomeBtn);
                consumptionsContainer.insertAdjacentHTML('beforeEnd', this.getOperationHTML(operation, targetClassList));
                this.getTotalConsumptions();
                this.getTotalIncomes();
                this.getBalance();
            });

        } else {
            alert('Значение должно быть числовое');
            addCount.value = '';
        }
    }

    getCurrentDate() {
        let currentDate = new Date;
        let dayOfMonth = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        year = year.toString().slice(-2);
        month = month < 10 ? `0${month}` : month;
        dayOfMonth = dayOfMonth < 10 ? `0${dayOfMonth}` : dayOfMonth;

        return `${dayOfMonth}.${month}.${year}`;
    }

    getOperationHTML(operation, targetClassList) {
        return `
            <div class="table-row" data-id="${operation.id}" datetime="${operation.date}">
                <span class="table-data ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"} data-id="${operation.id}" datetime="${operation.date}">${operation.date}</span>
                <span class="table-count ${operation.operation == 'consumption' ? "consumption-cell count-consumption" : "income-cell count-income"} data-id="${operation.id}" datetime="${operation.date}">${operation.count}</span>
                <span class="table-description ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"}" data-id="${operation.id}" datetime="${operation.date}">${operation.description}</span>
                <span class="table-category ${operation.operation == 'consumption' ? "consumption-cell" : "income-cell"}" data-id="${operation.id}" datetime="${operation.date}">${operation.category}</span>
                <button class="remove-consumption"></button>
            </div>
        `;
    }

    clearAddTask(addCount, addDescription, addConsumptionBtn, addIncomeBtn) {
        addCount.value = '';
        addDescription.value = '';
        addConsumptionBtn.disabled = true;
        addIncomeBtn.disabled = true;
    }

    removeOperation(operationContainer) {
        if (confirm('Вы уверены?')) {
            this.model.removeOperation(operationContainer.dataset.id).then(() => {
                operationContainer.remove();
                this.getTotalConsumptions();
                this.getTotalIncomes();
                this.getBalance();
            });
        }
    }

    filterMonth(month) {
        const valueMonth = +month;
        const rows = [];
        rows.push.apply(rows, document.getElementsByClassName('table-row'));

        rows.forEach(row => {
            const date = row.getElementsByClassName('table-count')[0].getAttribute('datetime').split('.')[1];

            (+date !== valueMonth) ? row.classList.add('hidden') : row.classList.remove('hidden');

            if (valueMonth == 13) {
                row.classList.remove('hidden');
            }
        });
    }

    getTotalConsumptions() {
        const sumConsamtions = document.getElementsByClassName('total-consumptions')[0];

        const consumptionsList = [];
        consumptionsList.push.apply(consumptionsList, document.getElementsByClassName('count-consumption'));

        const consumptionsData = [];
        consumptionsList.forEach(elem => consumptionsData.push(+elem.innerText));

        const sum41 = consumptionsData.reduce((sum, current) => sum + current, 0);

        sumConsamtions.innerText = sum41.toFixed(2);
    }

    getTotalIncomes() {
        const sumIncomes = document.getElementsByClassName('total-incomes')[0];

        const incomesList = [];
        incomesList.push.apply(incomesList, document.getElementsByClassName('count-income'));

        const incomesData = [];
        incomesList.forEach(elem => incomesData.push(+elem.innerText));

        const sum41 = incomesData.reduce((sum, current) => sum + current, 0);

        sumIncomes.innerText = sum41.toFixed(2);
    }

    getBalance() {
        const sumConsamtions = document.getElementsByClassName('total-consumptions')[0];
        const sumIncomes = document.getElementsByClassName('total-incomes')[0];
        const sumBalance = document.getElementsByClassName('total-balance')[0];

        sumBalance.innerText = (sumIncomes.innerText - sumConsamtions.innerText).toFixed(2);
    }
}

export default AddAndList;