const express = require('express'),
      bodyParser = require('body-parser'),
      morgan = require('morgan'),
	  fs = require('file-system'),
	  shortId = require('shortid'),
	  dbFilePathOperations = 'operations.json',
	  dbFilePathTargets = 'targets.json',
      app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

//operations

app.get('/api/operations', (req, res) => {
	res.send(getOperationsFromDB());
});	

app.post('/api/operation', (req, res) => {
	const operationsData = getOperationsFromDB(),
		operation = req.body;

	operation.id = shortId.generate();
	operation.date = operation.date;
	operation.count = operation.count;
	operation.description = operation.description;
	operation.operation = operation.operation;
	operation.category = operation.category;

    operationsData.push(operation);
    setOperationsToDB(operationsData);

	res.send(operation);
});

app.delete('/api/operation/:id', (req, res) => {
	const operationsData = getOperationsFromDB(),
		operations = operationsData.filter(operation => operation.id !== req.params.id);

	setOperationsToDB(operations);

	res.sendStatus(204);
});

//targets

app.get('/api/targets', (req, res) => {
	res.send(getTargetsFromDB());
});

app.post('/api/target', (req, res) => {
	const targetsData = getTargetsFromDB(),
		target = req.body;

	target.id = shortId.generate();
	target.sum = target.sum;
	target.description = target.description;

    targetsData.push(target);
    setTargetsToDB(targetsData);

	res.send(target);
});

app.delete('/api/target/:id', (req, res) => {
	const targetsData = getTargetsFromDB(),
		targets = targetsData.filter(target => target.id !== req.params.id);

	setTargetsToDB(targets);

	res.sendStatus(204);
});

function getOperationsFromDB() {
    return JSON.parse(fs.readFileSync(dbFilePathOperations, 'utf8'));
}

function setOperationsToDB(operationsData) {
    fs.writeFileSync(dbFilePathOperations, JSON.stringify(operationsData));
}

function getTargetsFromDB() {
    return JSON.parse(fs.readFileSync(dbFilePathTargets, 'utf8'));
}

function setTargetsToDB(targetsData) {
    fs.writeFileSync(dbFilePathTargets, JSON.stringify(targetsData));
} 

app.listen(9001, () => console.log('Server has been started...'));