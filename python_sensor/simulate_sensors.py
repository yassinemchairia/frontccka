import paho.mqtt.client as mqtt
import time
import random
import json

# MQTT Broker settings
broker = "mosquitto"  # Change to "broker.hivemq.com" for cloud testing
port = 1883
client_id = "sensor-simulator"

# Simulated sensors (department, type, ip_address, last_value)
sensors = [
    {"departement": "MANOUBA", "type": "TEMPERATURE", "ip": "192.168.1.100", "last_value": 20.0},
    {"departement": "MANOUBA", "type": "HUMIDITE", "ip": "192.168.1.101", "last_value": 50.0},
    {"departement": "MANOUBA", "type": "ELECTRICITE", "ip": "192.168.1.102", "last_value": 1.0},
    {"departement": "MANAR", "type": "TEMPERATURE", "ip": "192.168.1.103", "last_value": 22.0},
    {"departement": "MANAR", "type": "HUMIDITE", "ip": "192.168.1.104", "last_value": 55.0},
    {"departement": "MANAR", "type": "ELECTRICITE", "ip": "192.168.1.105", "last_value": 1.0},
]

def connect_mqtt():
    client = mqtt.Client(client_id=client_id, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
    client.connect(broker, port)
    return client

def simulate_sensor_value(sensor):
    sensor_type = sensor["type"]
    last_value = sensor["last_value"]

    if sensor_type == "TEMPERATURE":
        # Vary temperature by ±2°C, keep within -10°C to 50°C
        variation = random.uniform(-2.0, 2.0)
        new_value = last_value + variation
        new_value = max(-10.0, min(50.0, new_value))  # Clamp within range
        sensor["last_value"] = round(new_value, 2)
        return sensor["last_value"]
    elif sensor_type == "HUMIDITE":
        # Vary humidity by ±5%, keep within 20% to 100%
        variation = random.uniform(-5.0, 5.0)
        new_value = last_value + variation
        new_value = max(20.0, min(100.0, new_value))  # Clamp within range
        sensor["last_value"] = round(new_value, 2)
        return sensor["last_value"]
    elif sensor_type == "ELECTRICITE":
        # 1% chance to toggle state (0.0 or 1.0)
        if random.random() < 0.01:
            new_value = 0.0 if last_value == 1.0 else 1.0
            sensor["last_value"] = new_value
        return sensor["last_value"]
    return 0.0

def publish_sensor_data(client):
    while True:
        for sensor in sensors:
            topic = f"sensors/{sensor['departement']}/{sensor['type']}/{sensor['ip']}"
            value = simulate_sensor_value(sensor)
            client.publish(topic, str(value))
            print(f"Published {value} to {topic}")
        time.sleep(60)  # Publish every 60 seconds

def main():
    client = connect_mqtt()
    client.loop_start()
    try:
        publish_sensor_data(client)
    except KeyboardInterrupt:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()
