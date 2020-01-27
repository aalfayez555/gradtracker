/* global $ */

const express = require('express');
const app = express();
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const url = "mongodb://127.0.0.1/gradtracker";

app.listen(3000, () => console.log('Server Ready'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("gradtracker");
			var collection = dbo.collection('students');

			// retrieves data from the mongo database to be used in the datatable
			app.get('/api/datatable', function(request, response) {

				collection.find({}).toArray(function(err, results) {
					if (!err) {
						let dataSet = [];
						for (let i = 0; i < results.length; i++) {
							let fieldArr = [];
							fieldArr.push(results[i].name);
							fieldArr.push(results[i].position);
							fieldArr.push(results[i].location);
							fieldArr.push(results[i].lnumber);
							fieldArr.push(results[i].graddate);
							fieldArr.push(results[i].salary);
							dataSet.push(fieldArr);
						}
						//console.log(dataSet);
						response.end(JSON.stringify(dataSet));
					}
					else {
						response.send(err);
					}
										
					});
			});
			
			
			// inserts a document into the database
			app.post('/db/post', function(request, response) {
				//console.log(request);
				console.log(request);
			    collection.insertOne(
			    	{
			    		name:		request.body.name,
			    		position:	request.body.position,
			    		location:	request.body.location,
			    		lnumber:	request.body.lnumber,
			    		graddate:	request.body.graddate,
			    		salary:		'$' + request.body.salary
			    	}
			    );
			    
			    response.end();
			});

});
