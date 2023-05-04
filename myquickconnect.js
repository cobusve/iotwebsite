const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: '/home/ec2-user/IoTServer/c5a4dcccdbc4a422bf8875df98b7cd796940cd5dc8c8fb698eb6aa9379e66f5e-private.pem.key',
  certPath: '/home/ec2-user/IoTServer/c5a4dcccdbc4a422bf8875df98b7cd796940cd5dc8c8fb698eb6aa9379e66f5e-certificate.pem.crt',
  caPath: '/home/ec2-user/IoTServer/AmazonRootCA1.pem',
  clientId: 'my-client-id',
  host: 'a1srwky7yo1zsv-ats.iot.us-west-1.amazonaws.com'
});

device.on('connect', function() {
  console.log('Connected to AWS IoT');
  device.subscribe('#');
});

device.on('message', function(topic, payload) {
  console.log('Received message:', payload.toString());
});




const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/events', function(req, res) {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });

  const sendEvent = function(payload) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  device.on('message', function(topic, payload) {
    sendEvent(JSON.parse(payload.toString()));
  });

  req.on('close', function() {
    console.log('Client disconnected');
  });
});

app.listen(80, function() {
  console.log('Web server listening on port 80');
});


