import Component from '../../../views/component.js';

import Targets from '../../../models/targets.js';

class AddAndListTargets extends Component {
    constructor() {
		super();
		
		this.model = new Targets();
    }

    getData() {
		return new Promise(resolve => this.model.getTargetsList().then(targets => {
            this.targets = targets;
            resolve(targets);
        }));
	}

    render(targets) {
        return new Promise(resolve => {
            resolve(`
                <div class="container">
                    <div class="create-target">
                    <div>
                        <p>
                            <b>Описание:</b>
                            <input class="description" type="text">
                        </p>
                        <p>
                            <b>Необходимая сумма:</b>
                            <input class="sum41" type="text">
                        </p>
                    </div>
                        <div class="new-target">
                            <button class="create-targets" disabled>Добавить цель</button>
                        </div>
                    <div class="targets-container">
                        ${targets.map(targets => this.getTargetHTML(targets)).join('\n ')}
                        </div>
                </div>
            `);
        });
    }

    afterRender() {
        this.setActions();
    }

    setActions() {
        const addSum = document.getElementsByClassName('sum41')[0];
        const addDescription = document.getElementsByClassName('description')[0];
        const addTargetButton = document.getElementsByClassName('create-targets')[0];
        const targetsContainer = document.getElementsByClassName('targets-container')[0];
        const targetPageContainer = document.getElementsByClassName('create-target')[0];

        addSum.onkeyup = disableBtn;
        addDescription.onkeyup = disableBtn;

        function disableBtn() {
            addTargetButton.disabled = !(addSum.value.trim() && addDescription.value.trim());
        }

        targetPageContainer.addEventListener('click', event => {
            const target = event.target;
            const targetClassList = target.classList;

            switch (true) {
                case targetClassList.contains('create-targets'):
                    this.addTarget(addSum, addDescription, targetsContainer, addTargetButton);
                    break;

                case targetClassList.contains('remove-target'):
                    this.removeTarget(target.parentNode);
                    break;
            }

        });

    }

    addTarget(addSum, addDescription, targetsContainer, addTargetButton) {
        const newTarget = {
            description: addDescription.value.trim(),
            sum: addSum.value.trim(),
        };
        this.model.addTarget(newTarget).then(target => {
            this.clearAddTarget(addSum, addDescription, addTargetButton, addTargetButton);
            targetsContainer.insertAdjacentHTML('beforeEnd', this.getTargetHTML(target));
        });
    }

    getTargetHTML(target) {
        return `
        <div class="target-main" data-id="${target.id}">
            <span class="descriptions" data-id="${target.id}">${target.description}</span>
            <span class="sum" data-id="${target.id}">${target.sum}</span>
            <button class="remove-target"></button>
        </div>
    `;
    }

    clearAddTarget(addSum, addDescription, addTargetButton) {
        addSum.value = '';
        addDescription.value = '';
        addTargetButton.disabled = true;
    }

    removeTarget(targetContainer) {
        if (confirm('Вы уверены?')) {
            this.model.removeTarget(targetContainer.dataset.id).then(() => {
                targetContainer.remove();
            });
        }
    }
}

export default AddAndListTargets;