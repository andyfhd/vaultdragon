# Vault Dragon Exercise
A simple version controlled key-value store with a HTTP API we can query that from.
It only handles GET and POST requests. 
POST is used to insert a new record to the store and GET is used to retrieve a value from the store.
## Infrastructure
* The application is hosted on a newly created CentOS server on Digital Ocean running NodeJS
* Data is stored in MongoDB hosted on MongoLab
## Assumptions
* Input for POST is in JSON format with only one key-value pair
* Both key and value can be empty string
* Value can also be valid JSON datat
* Input with more than one key-value pair will not be accepted
* For GET request only the value is returned, but not the key and timestamp
* For POST request all key, value and timestamp will be returned after successful insertion into DB
* When timestamp is provided as a query string in the GET request, the last record before but not equal to the timestamp will be returned
* Key cannot contain leading or trailing white spaces as it will be use as part of the URL
### Server URL
http://haidongfu.space:3000
### Get Request Handler
http://haidongfu.space:3000/object/<key>
http://haidongfu.space:3000/object/<key>?timestamp=unixutctimestamp
### Post Request Handler
http://haidongfu.space:3000/object