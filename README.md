
### Steps:
* npm install nodejs
* npm install mongodb
* npm install meime
* cd
* mongod --port 27019 --dbpath workspace/web/taskerNodeJS/web/data/db/

### Config robo 3T:
* create database on port 27019
* db name Tasker
* collection name Tasks


### How to add Task

* Post request to: http://localhost:8888/task

* With query:

{
	"task" : "test task"
}