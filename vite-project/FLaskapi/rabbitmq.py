
import json
import pika

credentials = pika.PlainCredentials('rabbitmq', 'rabbitmq')
parameters = pika.ConnectionParameters('10.0.68.100',
                                            5672,
                                            '/',
                                            credentials)
connection = pika.BlockingConnection(parameters)
from pymongo import MongoClient
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mydatabase"]
collection_ContactTele= db["ContactTele"]
collection_ChatHistory= db["ChatHistory"]
listcontact = set()  
rows= collection_ContactTele.find()
for item in rows:
  
    listcontact.add(item['chatid'])  
    
def callbackupdate(ch, method, properties, body):
    # Chuyển từ JSON về dict
    rows= collection_ContactTele.find()
    for item in rows:
        print(item)
        listcontact.add(item['chatid'])  
      #  listcontact.append(item['idacount'])

    

def callback(ch, method, properties, body):
    message = json.loads(body)  
    print(message,listcontact)
    if str(message['chat_id']) in listcontact:
        message['sender']=str(message['sender'])
        message['chat_id']=str(message['chat_id'])
        collection_ChatHistory.insert_one(message)
 

channel = connection.channel()
channel.queue_declare(queue='updatecontact', durable=True)
# Lắng nghe tin nhắn từ RabbitMQ
channel.basic_consume(queue='message_queue', on_message_callback=callback, auto_ack=True)
channel.basic_consume(queue='updatecontact', on_message_callback=callbackupdate, auto_ack=True)
print(" [*] Waiting for messages...")
channel.start_consuming()