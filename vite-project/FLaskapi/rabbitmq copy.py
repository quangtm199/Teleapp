
import json
import pika

credentials = pika.PlainCredentials('rabbitmq', 'rabbitmq')
parameters = pika.ConnectionParameters('10.0.68.100',
                                            5672,
                                            '/',
                                            credentials)
connection = pika.BlockingConnection(parameters)
from pymongo import MongoClient
client = MongoClient("mongodb://10.0.68.100:27017/")
db = client["mydatabase"]
collection_ContactTele= db["ContactTele"]
collection_ChatHistory= db["ChatHistory"]
listcontact=[]
rows= collection_ContactTele.find()
for item in rows:
    listcontact.append(item['chatid'])
    listcontact.append(item['idacount'])

clients = set()
import asyncio
import websockets

async def send_to_clients(message):
    if clients:
        await asyncio.wait([client.send(json.dumps(message)) for client in clients])

def callbackupdate(ch, method, properties, body):
    message = json.loads(body)  # Chuyển từ JSON về dict
    rows= collection_ContactTele.find()
    for item in rows:
        listcontact.append(item['chatid'])
        listcontact.append(item['idacount'])

    

def callback(ch, method, properties, body):
    message = json.loads(body)  
 
    if str(message['chat_id']) in listcontact:
        collection_ChatHistory.insert_one(message)
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(send_to_clients(message))


 

channel = connection.channel()
channel.queue_declare(queue='updatecontact', durable=True)
# Lắng nghe tin nhắn từ RabbitMQ
channel.basic_consume(queue='message_queue', on_message_callback=callback, auto_ack=True)
channel.basic_consume(queue='updatecontact', on_message_callback=callbackupdate, auto_ack=True)
async def websocket_handler(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Received from client: {message}")
    finally:
        clients.remove(websocket)

async def start_server():
    async with websockets.serve(websocket_handler, "0.0.0.0", 8765):
        print("WebSocket Server running on ws://0.0.0.0:8765")
        channel.start_consuming()


loop = asyncio.get_event_loop()
loop.run_until_complete(start_server())
loop.run_forever()