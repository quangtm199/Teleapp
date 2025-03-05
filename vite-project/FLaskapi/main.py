from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)  # Cho phép API nhận request từ frontend

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Tạo thư mục nếu chưa có
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "pdf", "txt"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
import pyodbc
# namedatabase = 'Driver={SQL Server};Server=(local);Database=TeleManager;UID=sa;Trusted_Connection=yes;'
# conn1 = pyodbc.connect(namedatabase, autocommit=True)
# cursor = conn1.cursor()
import pyodbc

# Thay đổi thông tin kết nối tùy vào cấu hình của bạn

from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mydatabase"]
collection_AccountTele = db["AccountTele"]
collection_ContactTele= db["ContactTele"]
collection_ChatHistory= db["ChatHistory"]


@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    # server = r"DESKTOP-VGDRPBH\MSSQLSERVER1"# hoặc '.\SQLEXPRESS'
    # database = 'TeleManager'
    # trusted_connection = True  # Nếu không dùng tài khoản SQL, đặt thành False

    # if trusted_connection:
    #     connection_string = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;"
    # else:
    #     user = 'sa'
    #     password = 'your_password_here'
    #     connection_string = f"DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={user};PWD={password};"

    # try:
    #     conn1 = pyodbc.connect(connection_string)
    #     cursor = conn1.cursor()
    #     print("Kết nối thành công!")
    # except pyodbc.Error as e:
    #     print("Lỗi kết nối:", e)
    
    docs= collection_AccountTele.find()
   
    
    # cursor.execute("SELECT [Id], [Idaccount], [proxy], [phone], [username], [tdataPath], [sessionPath], [status], [idproxy] FROM [TeleManager].[dbo].[AccountTele] WITH (NOLOCK)")
    # rows = cursor.fetchall()

    # Chuyển đổi dữ liệu thành danh sách dictionary
    accounts = [
        {
           
            "Idaccount": row['Idaccount'],
            "proxy": row['proxy'],
            "phone": row['phone'],
            "username": row['username'],
            "tdataPath": row['sessionPath'],
            "sessionPath": row['sessionPath'],
            "status": row['status'],
            "idproxy": row['idproxy']
        }
        for row in docs
    ]
   
    return jsonify(accounts)

dictPhonechat = {
    
}

@app.route('/api/getlistchat', methods=['GET'])
def getlistchat():
    rows= collection_ContactTele.find()
 
    dictPhonechat=dict()
    import requests

    response = requests.get("http://127.0.0.1:8000/getclient/")
    resultGEtlive=response.json()  # In ra dữ liệu nhận được


    for row in rows:
        
        if row['phonecontact'] not in dictPhonechat.keys(): 
            dictPhonechat[row['phonecontact']]=[]
        

        query = {"chat_id": row['chatid'], "session_name": row['phonecontact']}
        results = list(collection_ChatHistory.find(query).sort("date", -1).limit(10))
        results.reverse()
    
        accounts=[]
        for item in results:
            if item['session_name'] not in resultGEtlive.keys():
                status=0
            else:
                if resultGEtlive[item['session_name']]=="live":
                    status=1
                else:
                    status=0
            
            accounts.append({
            "Id": str(item['_id']),
            "ContactTeleId": item['session_name'],
            "SenderId": str(item['sender']),
            "ReceiverId": str(item['chat_id']),
            "Message": item['message'],
            "Timestamp": item['date'],
            "Status": status,
            "MessageType": 0,
        }
        )
            
        dictPhonechat[row['phonecontact']].append(  { 
            "id": str(row['_id']), 
            "name": row['username'], 
            "phonecontact": row['phonecontact'],
            "iduser": row['iduser'],
            "lastMessage": "", 
            "unread":0, 
            "messages": accounts
        })   
           
   
   # rows = cursor.fetchall()
    return jsonify(dictPhonechat), 200

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "Không có file nào được tải lên"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Không có file nào được chọn"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(save_path)
        return jsonify({"message": "thanh cong","username": "quang","phone": f"+840946947143" ,"filePath": f"/uploads/{filename}"}), 200
       # return jsonify({"fileName": filename, "filePath": f"/uploads/{filename}"}), 200

    return jsonify({"error": "File không hợp lệ"}), 400
@app.route("/login/request_otp/", methods=["POST"])
def request_otp():
    
 
    phone_number=request.form.get("phone_number")
 
    return jsonify({"status": "200", "message": f"Mã OTP đã gửi đến {str(phone_number)}"})
@app.route("/login/verify_password/", methods=["POST"])
def verify_password():
    
 
    phone_number=request.form.get("phone_number")
    password=request.form.get("password")
    print(phone_number,password)
    return jsonify( {"status": "success", "message": f"Tài khoản {phone_number} ,User: {phone_number} đã đăng nhập thành công!"})

@app.route("/login/verify_otp/", methods=["POST"])
def verify_otp():
    
 
    phone_number=request.form.get("phone_number")
    code=request.form.get("code")

 
    return jsonify({"status": "200", "message": f"Tài khoản {phone_number} đã đăng nhập thành công!","id":0})
    return jsonify({"status": "205", "message": f"Tài khoản {session_name} Nhap MK cap 2"})
@app.route("/addcontact/", methods=["POST"])
def addcontact():
    target_phone=request.form.get("target_phone")
    contactName=request.form.get("contactName")
    session_name=request.form.get("session_name")
   
    # client = clients.get(session_name)
    # contact = InputPhoneContact(client_id=0, phone=target_phone, first_name=contactName, last_name=contactName)
    # result = await client(ImportContactsRequest([contact]))
    try:
        return jsonify({"status":200,"iduser":str(100)})
    except:
        return jsonify({"status":500,"iduser":str(-1)})

if __name__ == "__main__":
    app.run(debug=True, port=5001)
