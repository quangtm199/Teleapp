from pymongo import MongoClient

# Kết nối MongoDB trên localhost (mặc định port 27017)
client = MongoClient("mongodb://10.0.68.100:27017/")

# Chọn database (nếu chưa có, MongoDB sẽ tạo khi có dữ liệu)
db = client["mydatabase"]

# Chọn collection (bảng)
collection = db["mycollection"]

print("Kết nối thành công MongoDB!")
