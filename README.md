
### Steps:
* npm install nodejs
* npm install mongodb
* npm install meime
* cd
* mongod --port 27019 --dbpath workspace/web/taskerNodeJS/serverNodeJS/data/db/

### Config robo 3T:
* create database on port 27019
* db name Tasker
* collection name Tasks

### How to get Tasks

* Get request http://localhost:8888/tasks

### How to add Task

* Post request to: http://localhost:8888/addTask

* With query:

{
	"task" : "test task"
}