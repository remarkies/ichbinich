# ichbinich
Digital Ideation - Mentoring Project

Goal of this project was to create a website, which displays paintings in an astethic way and offers the functionality to directly sell them. 
The website contains a CMS for dynamically maintaining the content.

## Infrastructure
I'm hosting my applications on a DigitalOcean droplet accessible with SSL on port 443. Signature made by "Let's encrypt". Front end is an AngularJS application because I wanted try out another front end framework than VueJS. In the back end I will stick with an express.js server behind a nginx reverse proxy for security reasons. As a database I use MariaDB. The reason I use MariaDB is explained below in the database section. Express server and the database are running in docker containers for improved maintainability.

### Infrastructure - Diagram
![infrastructure-diagram](doku/infrastructure-diagram.jpeg)

## Database
I chose to use MariaDB (a relational open-source database) because I want to have structured consistent data in the back end of my shop. Additionaly it's user-friendlier to inspect data in a relational database while the project is still in developement. I didn't chose MySQL or ORACLE because I already worked with both in the past but never with MariaDB.  

### ER - Diagram
![er-diagram](doku/er-diagram.png)
