import { useState, useEffect, useRef } from "react";

import axios from "axios";
const FileUpload = ({onFileSelect}) => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [username, setUser] = useState("");
    const [phone, setPhone] = useState("");
    const [pathfile, setPath] = useState("");
    const [iduser, setiduser] = useState("");
    // Khi chọn file
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
     

    };
  
    // Khi gửi file
    const handleUpload = async () => {
      if (!file) {
        setMessage("❌ Vui lòng chọn file!");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await axios.post("http://localhost:8000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);


          },
        });
  console.log("Tải lên thành công")
  console.log(response.data)
  
  setUser(`${response.data.username}`);
  setPhone(`${response.data.phone}`);
  setPath(`${response.data.filePath}`);
  setMessage(`${response.data.message}`);
  setiduser(`${response.data.iduser}`);
    onFileSelect(response.data.message, response.data.username, response.data.phone, response.data.filePath,response.data.iduser);
  
   

      } catch (error) {
        console.error("Lỗi", error);
        setMessage("❌ Lỗi tải lên!");
        console.log("❌ Lỗi tải lê")
      }
    };
  
    return (
      <div style={{ padding: "20px" }}>
        
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: "10px", padding: "5px", cursor: "pointer" }}>
          📤 Upload Tdata
        </button>
  
        {/* Hiển thị tiến trình */}
        {uploadProgress > 0 && <p>📊 Tiến trình: {uploadProgress}%</p>}
  
        {/* Thông báo */}
        {message && <p>{message}</p>}
      </div>
    );
  };
  
  export default FileUpload;