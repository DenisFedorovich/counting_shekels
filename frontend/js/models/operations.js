class Operations {
    getOperationsList() {
    	return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('GET', 'http://localhost:9001/api/operations');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send();
		});
    }

    addOperation(newOperation) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', 'http://localhost:9001/api/operation');
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve(JSON.parse(xhr.response));

			xhr.send(JSON.stringify(newOperation));
		});
	}

    removeOperation(id) {
		return new Promise(resolve => {
			const xhr = new XMLHttpRequest();

			xhr.open('DELETE', `http://localhost:9001/api/operation/${id}`);
			xhr.setRequestHeader('Content-Type', 'application/json');

			xhr.onload = () => resolve();

			xhr.send();
		});
	}
}

export default Operations;