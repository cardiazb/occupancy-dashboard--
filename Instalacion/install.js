var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Occupancy Dashboard',
  description: 'API for Occupancy Dashboard',
  script: 'C:\\occupancy_dashboard\\index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();