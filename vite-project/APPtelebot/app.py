from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from telethon import TelegramClient
import asyncio
import json
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, BackgroundTasks
from telethon import TelegramClient, events
websocket_connections = set() 
from telethon.tl.functions.contacts import ImportContactsRequest
from telethon.tl.types import InputPhoneContact
from fastapi import FastAPI, Form, HTTPException
import pika
RABBITMQ_URL = "amqp://guest:guest@localhost/"
def get_rabbitmq_channel():
    credentials = pika.PlainCredentials('rabbitmq', 'rabbitmq')
    parameters = pika.ConnectionParameters('10.0.68.100',
                                                5672,
                                                '/',
                                                credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    channel.queue_declare(queue='message_queue', durable=True)
    return connection, channel


connection, channel = get_rabbitmq_channel()


check=False
data = {
    "string_emb": "string_emb",
    "videoid": "videoid",
    "datecreate": "datecreate",
    "file_origin": "file_origin",
    "plate": "plate"
}


async def send_to_rabbitmq(message_data):
    json_message = json.dumps(message_data)
    global connection, channel
    attem=0
    while True:
        if attem >3:
            break
        try:
            if channel.is_closed: 
                connection, channel = get_rabbitmq_channel()
            channel.basic_publish(
                exchange='',
                routing_key='message_queue',
                body=json_message,
                properties=pika.BasicProperties(
                    delivery_mode=pika.DeliveryMode.Persistent
                ))
            break
        except Exception as e:
            attem=attem+1
            
            print("❌ Lỗi gửi tin nhắn vào RabbitMQ:", e)
from starlette.websockets import WebSocketState

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Khởi động tất cả Telethon clients
    for session_name, client in clients.items():
        await client.connect()
        if not await client.is_user_authorized():
            print(f"Tài khoản {session_name} chưa đăng nhập!")
            clients[session_name] = client
        else:
            clientsstatus[session_name]="live"

            @client.on(events.NewMessage)
            async def handle_new_message(event,session_name=session_name):
                
                if event.is_private: 
                    message_data = {
                        "session_name":session_name,
                        "sender": event.sender_id,
                        "chat_id": event.chat_id,
                        "message": event.message.message,
                        "date": event.message.date.strftime("%Y-%m-%d %H:%M:%S")
                    }
                    print("clientssocket",clientssocket,",message_data",message_data)
                    await send_to_rabbitmq(message_data)
                    
                    await event.message.mark_read()
                    disconnected_clients=[]
                    for websocket in clientssocket:
                        try:
                            if websocket.client_state == WebSocketState.CONNECTED:  # Kiểm tra nếu kết nối còn mở
                                print("sendsocket",message_data)
                                await websocket.send_json(message_data)
                            else:
                                disconnected_clients.append(websocket)  # Đánh dấu client đã ngắt kết nối
                        except Exception as e:
                            print(f"Lỗi gửi tin nhắn: {e}")
                            disconnected_clients.append(websocket)

                    # Loại bỏ các WebSocket đã ngắt kết nối khỏi danh sách client
                    for websocket in disconnected_clients:
                        clientssocket.remove(websocket)

                    # for client in clientssocket:
                    #     try:
                    #         await client.send_text(json.dumps(message_data))
                    #     except Exception as ex:
                    #         print("ex",ex,clientssocket)
                    #         clientssocket.remove(client)
                    #         continue
                    #     print("sendclient")
                        
                
               # print(f"📩 Nhận tin nhắn: {message_data}")

                # Gửi tin nhắn đến tất cả client WebSocket
                # for websocket in websocket_connections:
                #     await websocket.send_text(json.dumps(message_data))
                
    yield  # Tiếp tục chạy ứng dụng

    # Khi ứng dụng shutdown, đóng kết nối Telethon
    for session_name, client in clients.items():
        await client.disconnect()
        print(f"Đã đóng session {session_name}")


app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
test=False
# Đọc API Config từ file JSON
server = r"DESKTOP-VGDRPBH\MSSQLSERVER1"# hoặc '.\SQLEXPRESS'
database = 'TeleManager'
trusted_connection = True  # Nếu không dùng tài khoản SQL, đặt thành False

if trusted_connection:
    namedatabase = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;"
        
import pyodbc

# conn1 = pyodbc.connect(namedatabase,
#                     autocommit=True)
# cursor = conn1.cursor()
from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mydatabase"]
collection = db["AccountTele"]
collection_ContactTele = db["ContactTele"]
# cursor.execute("SELECT  [Id],[Idaccount] ,[proxy] ,[phone] ,[username],[tdataPath],[sessionPath],[status],[idproxy]FROM [TeleManager].[dbo].[AccountTele]")

# # Lấy tất cả dữ liệu
# rows = cursor.fetchall()

# Hiển thị kết quả
clients=dict()
clientsstatus=dict()
for doc in collection.find():
 
    clients[doc['phone']] = TelegramClient(doc['phone'], 23636401, "aabd41defe96f44bd10c1fde21445ccf")
    clientsstatus[doc['phone']]="notstart"

# for row in rows:

#     clients[row.phone] = TelegramClient(row.phone, 23636401, "aabd41defe96f44bd10c1fde21445ccf")
#     clientsstatus[row.phone]="notstart"
from typing import List

clientssocket: List[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clientssocket.append(websocket)
    while True:
        try:
            data = await websocket.receive_text()
            await websocket.send_text(f"Server nhận: {data}")
        except:
            break


pending_logins = {} 
api_idDEFAULT = 23636401              # API ID của bạn
api_hashDEFAULT = 'aabd41defe96f44bd10c1fde21445ccf' 
@app.post("/login/verify_otp/")
async def verify_otp(
    phone_number: str = Form(...), 
    code: str = Form(...)
):
    
    if test==True:
        return {"status": "200", "message": f"Tài khoản {phone_number} đã đăng nhập thành công!"}
    else:
        
        # if phone_number not in pending_logins:
        #     raise HTTPException(status_code=400, detail="Không tìm thấy yêu cầu OTP!")

        session_name = phone_number
        client = clients[session_name]
        
        try:
            
            await client.sign_in(phone_number, code)
 
            @client.on(events.NewMessage)
            async def handle_new_message(event,session_name=session_name):
                
                if event.is_private: 
                    message_data = {
                        "session_name":session_name,
                        "sender": event.sender_id,
                        "chat_id": event.chat_id,
                        "message": event.message.message,
                        "date": event.message.date.strftime("%Y-%m-%d %H:%M:%S")
                    }
                    print("clientssocket",clientssocket,",message_data",message_data)
                    await send_to_rabbitmq(message_data)
                    
                    await event.message.mark_read()
                    disconnected_clients=[]
                    for websocket in clientssocket:
                        try:
                            if websocket.client_state == WebSocketState.CONNECTED:  # Kiểm tra nếu kết nối còn mở
                                await websocket.send_json(message_data)
                            else:
                                disconnected_clients.append(websocket)  # Đánh dấu client đã ngắt kết nối
                        except Exception as e:
                            print(f"Lỗi gửi tin nhắn: {e}")
                            disconnected_clients.append(websocket)

                    # Loại bỏ các WebSocket đã ngắt kết nối khỏi danh sách client
                    for websocket in disconnected_clients:
                        clientssocket.remove(websocket)
                        

            clientsstatus[session_name]="live"
            me = await client.get_me()
            filename = secure_filename(phone_number+".session")
            save_path = Path(UPLOAD_FOLDER) / filename
          

            return {"status": "200", "message": f"Tài khoản {session_name} đã đăng nhập thành công!","id":me.id,"path":save_path}
        except Exception as e:
            if "2FA" in str(e) or "password" in str(e):
            # session_name = pending_logins.pop(phone_number)
                pending_logins[phone_number] = session_name 
                        
                return JSONResponse(
        status_code=205,  # Mã trạng thái HTTP
        content={"status": 205, "message": f"Tài khoản {session_name} Nhập MK cấp 2"}
    )
            
            
            else:
                return JSONResponse(
        status_code=500,  # Mã trạng thái HTTP
        content={"status": "500", "message": f"{e}"}
    )
                return {"status": "500", "message": f"{e}"}
                print(f"Lỗi: {e}")
                
      

@app.get("/getclient/")
async def getclient(
):
    return clientsstatus
    
@app.post("/login/verify_password/")
async def verify_password(
    phone_number: str = Form(...), 
    password: str = Form(...)
):
    

    if True:
        
        # if phone_number not in pending_logins:
        #     raise HTTPException(status_code=400, detail="Không tìm thấy yêu cầu OTP!")

        session_name = phone_number
        client = clients[phone_number]


        try:
        # await client.sign_in(phone_number,password)
            await client.sign_in(password=password)
            me = await client.get_me()
             
            filename = secure_filename(phone_number+".session")
            save_path = Path(UPLOAD_FOLDER) / filename
                



            print(f"User: {me.username}")
            @client.on(events.NewMessage)
            async def handle_new_message(event,session_name=session_name):
                
                if event.is_private: 
                    message_data = {
                        "session_name":session_name,
                        "sender": event.sender_id,
                        "chat_id": event.chat_id,
                        "message": event.message.message,
                        "date": event.message.date.strftime("%Y-%m-%d %H:%M:%S")
                    }
                    print("clientssocket",clientssocket,",message_data",message_data)
                    await send_to_rabbitmq(message_data)
                    
                    await event.message.mark_read()
                    disconnected_clients=[]
                    for websocket in clientssocket:
                        try:
                            if websocket.client_state == WebSocketState.CONNECTED:  # Kiểm tra nếu kết nối còn mở
                                await websocket.send_json(message_data)
                            else:
                                disconnected_clients.append(websocket)  # Đánh dấu client đã ngắt kết nối
                        except Exception as e:
                            print(f"Lỗi gửi tin nhắn: {e}")
                            disconnected_clients.append(websocket)

                    # Loại bỏ các WebSocket đã ngắt kết nối khỏi danh sách client
                    for websocket in disconnected_clients:
                        clientssocket.remove(websocket)

            clientsstatus[session_name]="live"
            
            return {"status": "success", "message": f"Tài khoản {session_name} ,User: {me.username} đã đăng nhập thành công!","id":me.id,"path":save_path}
        except Exception as e:  
            
            pending_logins.pop(phone_number)   
            raise HTTPException(status_code=500, detail=str(e))
import os
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename: str) -> bool:
    ALLOWED_EXTENSIONS = {"session", "jpg", "jpeg", "gif", "txt", "pdf"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from werkzeug.utils import secure_filename
from fastapi.responses import JSONResponse
from pathlib import Path
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên")

    if file.filename == "":
        raise HTTPException(status_code=400, detail="Không có file nào được chọn")

    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = Path(UPLOAD_FOLDER) / filename
        
        with open(save_path, "wb") as buffer:
            buffer.write(await file.read())
        session_name=save_path
       
        client= TelegramClient(session_name,api_idDEFAULT, api_hashDEFAULT)
        await client.connect()  
        if  await client.is_user_authorized(): 
            me = await client.get_me()
            clients["+"+str(me.phone)] = client
            clientsstatus["+"+str(me.phone)]="live"
            @client.on(events.NewMessage)
            async def handle_new_message(event,session_name="+"+str(me.phone)):
                
                if event.is_private: 
                    message_data = {
                        "session_name":session_name,
                        "sender": event.sender_id,
                        "chat_id": event.chat_id,
                        "message": event.message.message,
                        "date": event.message.date.strftime("%Y-%m-%d %H:%M:%S")
                    }
                    print("clientssocket",clientssocket,",message_data",message_data)
                    await send_to_rabbitmq(message_data)
                    
                    await event.message.mark_read()
                    disconnected_clients=[]
                    for websocket in clientssocket:
                        try:
                            if websocket.client_state == WebSocketState.CONNECTED:  # Kiểm tra nếu kết nối còn mở
                                await websocket.send_json(message_data)
                            else:
                                disconnected_clients.append(websocket)  # Đánh dấu client đã ngắt kết nối
                        except Exception as e:
                            print(f"Lỗi gửi tin nhắn: {e}")
                            disconnected_clients.append(websocket)

                    # Loại bỏ các WebSocket đã ngắt kết nối khỏi danh sách client
                    for websocket in disconnected_clients:
                        clientssocket.remove(websocket)

      
            return {
                    "message": "200",
                    "username": me.username,
                    "iduser": me.id,
                    "phone":  "+"+str(me.phone),
                    "filePath":session_name
                }
        else:
            return {"status": "500", "message": f"fail"}
    else:
         return {"status": "500", "message": f"fail"}
@app.post("/insertaccount")
def insertaccount( session_name: str = Form(...), 
    phone_number: str = Form(...),
      contactName: str = Form(...),
        idaccount: str = Form(...),
          sessionPath: str = Form(...)  ):
    


    new_data = {
    "Idaccount": str(idaccount),
    "username": contactName,
    "proxy": "",
    "phone": str(phone_number),
    "sessionPath": sessionPath,
    "status": 0,
    "idproxy": 2
    }

    # Chèn vào MongoDB
    collection.insert_one(new_data)

    
    return {"status": "200", "message": f"done"}
   
       
          
@app.post("/login/request_otp/")
async def request_otp(
    session_name: str = Form(...), 
    phone_number: str = Form(...)
):
    session_filename = secure_filename(phone_number + ".session")
    save_path = Path(UPLOAD_FOLDER) / session_filename


    
    if test==True:
        clients[session_name]=session_name
        return {"status": "200", "message": f"Mã OTP đã gửi đến {phone_number}"}
    else:
        
        if session_name not in clients:

            clients[session_name]= TelegramClient(save_path,api_idDEFAULT, api_hashDEFAULT)
        else:
            None
        client = clients[session_name]
        await client.connect() 
        try:
            await client.send_code_request(phone_number)
            pending_logins[phone_number] = session_name  # Lưu session đang đăng nhập
            return {"status": "200", "message": f"Mã OTP đã gửi đến {phone_number}"}
        except Exception as e:
            return {"status": "500", "message": f"{e}"}
       # raise HTTPException(status_code=500, detail=str(e))



@app.post("/send_message/")

async def send_message(phone: str = Form(...),  message: str = Form(...), session_name: str = Form(...)):
    
    try:
        client = clients.get(session_name)
        chat_id = await client.get_entity(phone)
    
        # Gửi tin nhắn
       
        
        if not client:
            return {"status": "error", "message": "Session không hợp lệ!"}

        await client.send_message(chat_id, message)
        return {"status": "success", "message": f"({session_name}) Sent to {chat_id}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
from datetime import datetime
@app.post("/send_message_chatid/")
async def send_message(
    chat_id: str = Form(...), 
    sender_id: str = Form(...), 
    message: str = Form(...),
    session_name: str = Form(...)
):
    try:
        print(clients)
        client = clients.get(session_name)
       
        message_data={'session_name': session_name, 'sender': sender_id, 'chat_id': chat_id, 'message': message, 'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
   
        await send_to_rabbitmq(message_data)
        print("chat_id",chat_id)
        # Gửi tin nhắn
        try:

            await client.send_message(int(chat_id), message)
        except Exception as e:
            print("bug",e)
        if not client:
            return {"status": "500", "message": "Session không hợp lệ!"}

        return {"status": "200", "message": f"({session_name}) Sent to {chat_id}"}
    except Exception as e:
        return {"status": "500", "message": str(e)}
from telethon.tl.types import InputPhoneContact, PeerUser
from telethon.tl.functions.contacts import GetContactsRequest
collection_ChatHistory= db["ChatHistory"]
@app.post("/synccontact/")
async def synccontact(
    session_name: str = Form(...)
):
    client = clients.get(session_name)
    await client.connect()  
    if  await client.is_user_authorized(): 
        contacts = await client(GetContactsRequest(hash=0))
      #  contacts = await client(GetContactsRequest(hash=-12398745604826))

        result = collection.find_one({"phone": session_name})
     
        list_user_ids = [contact["iduser"] for contact in collection_ContactTele.find({"phonecontact": session_name}, {"iduser": 1, "_id": 0})]

        if result:
            Idaccount = result['Idaccount']
            
            for contact in contacts.users:
                if contact.id in list_user_ids:
                    continue
              
                print(f"Name: {contact.first_name} {contact.last_name}, Username: {contact.username}, Phone: {contact.phone}")
                
                last_name=""
                if contact.last_name is not None:
                    last_name = contact.last_name
                first_name=""
                if contact.last_name is not None:
                    first_name = contact.first_name
                if last_name =="" and first_name=="":
                    continue

                new_data = {
                    "phonecontact": session_name,
                    "username": first_name+last_name,
                    "chatid": str(contact.id),
                    "iduser": str(contact.id),
                    "ghichu": "",
                    "idacount": Idaccount
                }

                # Thêm vào MongoDB
                collection_ContactTele.insert_one(new_data)
           
            channel.basic_publish(
                exchange='',
                routing_key='updatecontact',
                body={},
                properties=pika.BasicProperties(
                    delivery_mode=pika.DeliveryMode.Persistent
                ))
import pytz
local_tz = pytz.timezone("Asia/Ho_Chi_Minh")  
@app.post("/syncchat/")
async def synccontact(
    session_name: str = Form(...),
    id_chat: str = Form(...)
):
    query = {"chat_id": id_chat, "session_name": session_name}
    results = list(collection_ChatHistory.find(query).sort("date", -1).limit(1))
    if len(results)>0:
        inorge=False
        datecurrent=results[0]["date"]
        chat_idcurent=results[0]["chat_id"]
        messagecurent=results[0]["message"]
      
        date_obj = datetime.strptime(datecurrent, "%Y-%m-%d %H:%M:%S")
    else:
        
        inorge=True
    client = clients.get(session_name)
    await client.connect()  
    totalList=[]
    if  await client.is_user_authorized(): 
        me = await client.get_me()
        messages = await client.get_messages(int(id_chat), limit=30)
        for message in messages:
           

            date=message.date
            local_time = date.astimezone(local_tz)
            local_time = local_time.replace(tzinfo=None)
            if inorge==False :
                if   local_time > date_obj:
                    if message.message==messagecurent:
                        break
                    if message.message!=messagecurent:
                        if message.out==False:
                            sender=id_chat
                        else:
                            sender=int(me.id)
                        
                        collection_ChatHistory.insert_one({'session_name': session_name, 'sender': sender, 'chat_id': id_chat, 'message':message.message, 'date': local_time.strftime("%Y-%m-%d %H:%M:%S")} )
            else:
                if message.out==False:
                    sender=id_chat
                else:
                    sender=int(me.id)
                
                collection_ChatHistory.insert_one({'session_name': session_name, 'sender': sender, 'chat_id': id_chat, 'message':message.message, 'date': local_time.strftime("%Y-%m-%d %H:%M:%S")} )
    
    return  totalList


    
@app.post("/addcontact/")
async def addcontact(
    target_phone: str = Form(...), 
    contactName: str = Form(...),
    session_name: str = Form(...)
):
    result = collection.find_one({"phone": session_name})
    if result:
        print("Dữ liệu tìm thấy:", result)
    else:
        print("Không tìm thấy dữ liệu!")

    if result:
        # Lấy từng giá trị theo index
        Idaccount = result['Idaccount']
       
        print("account",Idaccount)
        client = clients.get(session_name)
        await client.connect()  
        if  await client.is_user_authorized(): 

            contact = InputPhoneContact(client_id=0, phone=target_phone, first_name=contactName, last_name=contactName)
            result = await client(ImportContactsRequest([contact]))
            new_data = {
                "phonecontact": session_name,
                "username": contactName,
                "chatid": str(result.users[0].id),
                "iduser": str(result.users[0].id),
                "ghichu": "",
                "idacount": Idaccount
            }

            # Thêm vào MongoDB
            collection_ContactTele.insert_one(new_data)
            data = {
    "string_emb": "string_emb",
    "videoid": "videoid",
    "datecreate": "datecreate",
    "file_origin": "file_origin",
    "plate": "plate"
}
            json_message = json.dumps(data)
            channel.basic_publish(
            exchange='',
            routing_key='updatecontact',
            body=json_message,
            properties=pika.BasicProperties(
                delivery_mode=pika.DeliveryMode.Persistent
            ))
            
            try:
                return {"status":200,"iduser":str(result.users[0].id)}
            except:
                return {"status":500,"iduser":str(-1)}
        else:
            return {"status":500,"iduser":str(-1)}
   
        
# @app.post("/addcontact/")
# async def addcontact(
#     target_phone: str = Form(...), 
#     contact: str = Form(...),
#     session_name: str = Form(...)
# ):
   
#     client = clients.get(session_name)

#     message = "Chào bạn! Đây là một tin nhắn tự động." 
    
#     try:
#         contact = await client.get_entity(target_phone)
#         await client.send_message(target_phone, message)
#     except:
        
#         contact = InputPhoneContact(client_id=0, phone=target_phone, first_name=contact, last_name=contact)
#         result = await client(ImportContactsRequest([contact]))
#         print( result.users)
#         for user in result.users:
#             await client.send_message(user.id, message)
#         print( result.users)
        
#     print("Tin nhắn đã được gửi thành công!")
    
if __name__ == "__main__":
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
