from telethon.sync import TelegramClient

# Thay thế bằng thông tin API của bạn
api_id = 23636401  # Thay bằng API ID của bạn
api_hash = "aabd41defe96f44bd10c1fde21445ccf"

# Tên session file (lưu đăng nhập)
session_name = "my_session"

# Tạo client và đăng nhập
client = TelegramClient(r"F:\ProjectteleAppFrontend\testapp\vite-project\APPtelebot\+84946947143.session", api_id, api_hash)

client.start()
saved_session = client.session.save()
print("Đăng nhập thành công!")
