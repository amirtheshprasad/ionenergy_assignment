# ionenergy-assignment
This repository contains the ion energy assignment.

A full stack application has been created using the MERN stack.

It contains the following:

 On the front end, the user will click on a "Browse" button, selects the THERM001 file, and presses the "Send" button. The batch will be uploaded to the backend, parsed  and the records will be saved inside MongoDB.
Displays the thermometer temperature history in a chart for a 1-year timespan. Data will be fetched in an efficient way. 

Steps for execution


Step 1 - Create a .env file in the root directory and add the following:
```
SERVER_PORT = 5000
MONGO_URI = your mongodb uri in ""
```
Step 2 - Execute the following commands in root directory

```
npm install
cd client
npm install
  ```
Step 3 - To run the project execute the following command
```
npm run dev
 ```
