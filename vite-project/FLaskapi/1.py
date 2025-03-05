
import pika
import pika
import json
credentials = pika.PlainCredentials('rabbitmq', 'rabbitmq')
parameters = pika.ConnectionParameters('10.0.68.100',
                                            5672,
                                            '/',
                                            credentials)
connection = pika.BlockingConnection(parameters)
check=False
data = {
    "string_emb": "string_emb",
    "videoid": "videoid",
    "datecreate": "datecreate",
    "file_origin": "file_origin",
    "plate": "plate"
}
json_message = json.dumps(data)

channel = connection.channel()
channel.queue_declare(queue='sendnotice', durable=True)
channel.queue_declare(queue='sendnotice1', durable=True)
channel.queue_declare(queue='receivenotice', durable=True)
channel.basic_publish(
            exchange='',
            routing_key='updatecontact',
            body=json_message,
            properties=pika.BasicProperties(
                delivery_mode=pika.DeliveryMode.Persistent
            ))