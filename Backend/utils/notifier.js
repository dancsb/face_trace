const mqtt = require('mqtt');

module.exports = async function notifySubscribers(description, detectedPeopleCount) {
  try {
    const mqtt_options = {
      clientId: 'FaceTrace_backend',
      username: 'FaceTrace_backend',
      password: 'Rjnyv8l0aI347VNn',
      port: 8883,
      protocolVersion: 5
    };

    const client = mqtt.connect('mqtts://mqtt.dancs.org', mqtt_options);

    client.on('connect', () => {
      const message = JSON.stringify({
        description,
        detectedPeopleCount
      });

      client.publish('FaceTrace/notification', message, (err) => {
        if (err) {
          console.error('Failed to send notification:', err.message);
        } else {
          //console.log('Notification sent successfully:', message);
        }
        client.end();
      });
    });

    client.on('error', (err) => {
      console.error('MQTT connection error:', err.message);
    });
  } catch (err) {
    console.error('Failed to notify subscribers:', err.message);
  }
}
