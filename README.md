<h1>EduBAI</h1>

<p>EduBAI is an interactive educational platform implementing a basketball game between two 3-player teams. 
The overall goal of the platform is to enable users model the intelligence of their team using formal languages, 
such as the Event Calculus and ASP, in the context of a dynamic, non-deterministic domain.
The platform is free-to-use and can be deployed following the instruction bellow.</p>

<p>A running version of EduBAI can be found at: http://139.91.183.97:8181/edubai/ </p>

<h2>How to run EduBAI</h2>

<p>Edubai consists of multiple nodeJS web services and a java webapp serving the User Interface and the main game logic. </p>

<h3>Prerequisites</h3>
<ul>
<li>NodeJS 9.x.x or later</li>
<li>MongoDB</li>
<li>JDK 8.x.x</li>
</ul>

<h3>Instructions</h3>

<p>All the nodeJS services required for EduBAI can be found in the services folder. <br>Run npm install for each service a</p>
<p>For each service, any configuration required regarding the database, ports or IPs is a 
<b>config.js file located in the config folder</b> of each service.</p>

<p>To run the webapp contaning the User Interface and game logic, you have to build the java project in order to generate the .war file</p>

<p>Inside the webpage folder, you can find all the corresponding js files, responsible for communicating with the different services mentioned above.
<br>You can find the variables containg the IP of the services on top of each file in order to change the IP to the correct one.</p>

<p>Having configured the IP in each file, EduBAI should be ready to run</p>

<h2>License & Authors</h2>

**Author:** Dimitrios Arampatzis (arabatzis@ics.forth.gr) **Author:** Maria Doulgeraki (mdoulger@ics.forth.gr) 
**Author:** Michail Giannoulis (giannoulis@csd.uoc.gr) **Author:** Evropi Stefanidi (evropi@ics.forth.gr) 
**Author:** Theodore Patkos (patkos@ics.forth.gr)

<p>This project was developed in the context of the course CS-567 “Knowledge Representation and Reasoning”, of the Computer Science Department, at the University of Crete, Greece </p>
<p>© 2019, Institute of Computer Science (ICS) of the Foundation for Research and Technology - Hellas (FORTH)</p>

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
