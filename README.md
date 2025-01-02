# Web Voice Meter
Control your audio outputs directly from a web browser, using your smartphone or PC.
## How to run
### Requirements 
* nodejs [installed](https://nodejs.org/en/download) 
* Access to the pc with Voice Meter and Firewall access
## Startup
``npm install``

``node index.js``

__Note: Voice Meter have to run on the same system__
*If the windows firewall ask for access, allow for private and public networks if you are unsure*
### Local Access
Open your browser [http://localhost:3002/](http://localhost:3002/)

### Remote Access
1. Open the Command Prompt (CMD) and run: ``ipconfig``
2. Locate your IP address (e.g., 192.168.178.10 or similar).
3. On a second device, open the browser and visit: http://yourip:3002/
