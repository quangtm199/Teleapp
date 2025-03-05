import { useState, useEffect, useRef } from "react";
import FileUpload  from "./upload";
import axios from "axios";




export default function TelegramUI() {
  const [darkMode, setDarkMode] = useState(false);
 
  const [chats, setChats] = useState([
    { 
      
    },

  ]);
  const [chatsAll, setChatsAll] = useState({});
  const [selectedChatid, setSelectedChatid] = useState(0);
  const [selectedChat, setSelectedChat] = useState({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenLogin, setIsLogin] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    urltdata:"",
    Idaccount:"",
    status: "online",
    typelogin:"password"
  });
  const [accounts, setAccounts] = useState([
   
  ]);
  const [SearchValue, setSearchValue] = useState([
   
  ]);
  const [ContactAdd, setContactAdd] = useState({
    name: "",
    phone:"",
    iduser:""
  }
   
  );
  
  
  const [selectedaccount, setSelectedAccount] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    urltdata:"",
    status: "online",
    typelogin:"tdata"
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");
    setWs(socket);

    socket.onmessage = (event) => {
        

      const data = JSON.parse(event.data);

        setChatsAll((prevChats) => {
    const phoneNumber = data["session_name"]; 
    const updatedChats = { ...prevChats }; 

            if (updatedChats[phoneNumber]) {
        const chatIndex = updatedChats[phoneNumber].findIndex(
            (chat) => chat.iduser == data['chat_id']
            );
            
        if (chatIndex !== -1) {
           
            updatedChats[phoneNumber][chatIndex].messages.push({
                ContactTeleId: phoneNumber,
                Id: `${Date.now()}`, // ID tạm thời
                ContactTeleId:data["session_name"],
                          SenderId: data["sender"],
                          ReceiverId: data["chat_id"], // Dùng prevChat để đảm bảo đúng dữ liệu
                       Message: data["message"],
                         Status: 0,
                          read: true,
            });
            } 
            
            }

           
         

          
            return updatedChats; // Trả về state mới (dù không thay đổi gì)
          });


    //   setSelectedChat((prevChat) => {
        
    //     const updatedChat = {
    //       ...prevChat,
    //       messages: [
    //         ...(prevChat?.messages || []),
    //         {
    //             id: (prevChat?.messages?.length || 0) + 1,
    //           ContactTeleId:data["session_name"],
    //           SenderId: data["sender"],
    //           ReceiverId: data["chat_id"], // Dùng prevChat để đảm bảo đúng dữ liệu
    //           Message: data["message"],
    //           Status: 0,
    //           read: true,
    //         },
    //       ],
    //     };

    //     setChatsAll((prevChats) => {
    //       const index = prevChats[data["session_name"]]?.findIndex(
    //         (item) => item.iduser == data["chat_id"]
    //       );
    //       console.log(prevChats,"aaa",data["chat_id"])
    //      console.log("index",index)
    //       if (index >= 0) {
    //         prevChats[data["session_name"]][index] = updatedChat;
    //       }
    //       return { ...prevChats };
    //     });

        
    
    //     return updatedChat; // Trả về `updatedChat` để cập nhật state
    //   });
    

    };

    return () => socket.close();
  }, []);
 

  useEffect(() => {
    axios.get("http://127.0.0.1:5001/api/accounts")
      .then((response) => {
     
        setAccounts(response.data); 
       
        // Cập nhật state với dữ liệu từ API
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
    
      axios.get("http://127.0.0.1:5001/api/getlistchat")
      .then((response) => {
    
        if (Object.keys(response.data).length !== 0){
      
          setChatsAll(response.data); 
        }
        
       
        // Cập nhật state với dữ liệu từ API
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });




  }, [refreshTrigger]);


  useEffect(() => {


    if(accounts.length>0){
     
     

    if(selectedaccount.phone==undefined || selectedaccount.phone==""){
      console.log("bbbbbbbbbbbbbbbb")
      setSelectedAccount(accounts[0])
    
      setChats(chatsAll[accounts[0].phone])
    }else{
     console.log("aaaaaaaaaaaaaa")

      setSelectedAccount(selectedaccount)
      setChats(chatsAll[selectedaccount.phone])

      const index = chatsAll[selectedaccount.phone]?.findIndex(
        (item) => item.iduser === selectedChat.iduser
      );
      

      setSelectedChat(chatsAll[selectedaccount.phone][index])

    }
    }
   
  }, [accounts,chatsAll]); // Chạy khi accounts thay đổi

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
 
    if (type === "radio"){
  
      if(value=="password"){
        setIsLogin(false);
        setButtonText("Lấy mã đăng nhập")
      }
      if(value=="tdata"){
        setIsLogin(true);
        setButtonText("Thêm tài khoản")
        
      }

     
    }
    if(name=="Search"){
      
      setSearchValue(value)
    }
    if(name=="Namecontact"){
      ContactAdd.name=e.target.value 
    }
    if(name=="Phonecontact"){
      ContactAdd.phone=e.target.value 
    }
  
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
  };

  


  const clickaccount = (e) => {
    
   setSelectedAccount(e)
   setIsOpen(!isOpen)
  
  if(chatsAll[e.phone]!=undefined){
  
    setChats(chatsAll[e.phone])
    setSelectedChat(chatsAll[e.phone][0])
  }else{

    setChats([])
    setSelectedChat( { 
      id: 2, 

      messages: [
      
      ] 
    })
  }
  
   
  // setSelectedChat(chats)
  };

  const clickchat = (e) => {
    // setChats(chatsAll[accounts[0].phone])

    
   setSelectedChat(e)
  
   };

  const getapichat = (e) => {
    
  
   };
   const validatePhone = (input) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/; // Cho phép dấu + ở đầu, theo sau là 10-15 số
    return phoneRegex.test(input);
  };
  const addNewChat = (phoneNumber, newChat) => {
    
    setChatsAll((prevChats) => ({
      ...prevChats,
      [phoneNumber]: prevChats[phoneNumber] 
        ? [...prevChats[phoneNumber], newChat]  // Nếu đã có chat, thêm vào mảng
        : [newChat], // Nếu chưa có, tạo mảng mới
    }));
  };

  

  const  SyncTextChat = async (e) => {
  

    const result = window.confirm("Bạn có chắc đồng bộ không?");
    if (result) {
      const formData = new FormData();
      formData.append("session_name",selectedaccount.phone);
      formData.append("id_chat",selectedChat.iduser);
      const response = await axios.post("http://localhost:8000/syncchat/", formData, {
        headers: { "Content-Type": "multipart/form-data" },

        }
      );
     
      if (response.status === 200) {
      
        setTimeout(() => {
          
          setRefreshTrigger(prev => prev + 1);



        }, 100);
        
        

       
        
      }
      

    } else {
      
    }
  
   };


  const  Synccontact = async (e) => {
    
    const result = window.confirm("Bạn có chắc đồng bộ không?");
    if (result) {
      const formData = new FormData();
      formData.append("session_name",selectedaccount.phone);

      const response = await axios.post("http://localhost:8000/synccontact/", formData, {
        headers: { "Content-Type": "multipart/form-data" },

        }
      );
     
      if (response.status === 200) {
        setRefreshTrigger(prev => prev + 1)
      }

    } else {
      
    }
  
   };

   const  addContact = async (e) => {
    setIsAddingContact(!isAddingContact)
    if(isAddingContact==true){
       if(validatePhone(ContactAdd.phone)){
      const formData = new FormData();
      
      formData.append("target_phone", ContactAdd.phone);
      formData.append("contactName", ContactAdd.name);
      formData.append("session_name",selectedaccount.phone);

      const response = await axios.post("http://localhost:8000/addcontact/", formData, {
        headers: { "Content-Type": "multipart/form-data" },

        }
      );
     
      if (response.status === 200) {
      //  setContactAdd({name:"",phone:""})
  
      var iduser=response.data.iduser
     

        addNewChat(selectedaccount.phone,{ 
          id: Math.floor(Math.random() * 10000) + 1, 
          
          name: ContactAdd.name, 
          phonecontact: ContactAdd.phone,
          iduser: iduser,
          lastMessage: "", 
          unread: 0, 
          messages: [
            
          ] 
        })
      
        alert("Thêm thành công");
      } else {
       
      }
    }else{
     // setContactAdd({name:"",phone:""})
      alert("Sai định dạng");
    }

    }

   

  
   };


   const [isAddingContact, setIsAddingContact] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [hoveredChat, setHoveredChat] = useState(null);
const [hoveredAccount, setHoveredccount] = useState(null);
const [Accountcurrent, setAccount] = useState(null);
const [ws, setWs] = useState(null);

const [buttonText, setButtonText] = useState("Lấy mã đăng nhập");
  const handleAddAccount = async () => {

    if (newAccount.phone.trim() !== "") {
 
      if(buttonText=="Lấy mã đăng nhập"){
        const formData = new FormData();
        formData.append("phone_number", newAccount.phone);
        formData.append("session_name", newAccount.phone);
        const response = await axios.post("http://localhost:8000/login/request_otp/", formData, {
          headers: { "Content-Type": "multipart/form-data" },

          }
        );

        if (response.status === 200) {
          setButtonText("Nhập mã code về số điện thoại")
        } else {
         
        }
      }

      if(buttonText=="Nhập mã code về số điện thoại"){
        const formData = new FormData();
        formData.append("phone_number", newAccount.phone);
        formData.append("code", newAccount.password);
        const response = await axios.post("http://localhost:8000/login/verify_otp/.", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.status === 200) {
     
          setNewAccount({
            ...newAccount,
            Idaccount: response.data.id,
            urltdata:response.data.path,
          });
          setButtonText("Đăng nhập thành công thêm tài khoản vào hệ thống")



          
          // setAccounts([...accounts, { phone: newAccount.phone, status: 0 }]);
          // setNewAccountName("");
          // setIsAdding(false);
        } 
         if (response.status === 205) {

            setNewAccount({
                ...newAccount,
                password:""
              
              });
          setButtonText("Nhập mk cấp 2")
        }
      }
      if(buttonText=="Nhập mk cấp 2"){
        const formData = new FormData();
        formData.append("phone_number", newAccount.phone);
        formData.append("password", newAccount.password);
       
        const response = await axios.post("http://localhost:8000/login/verify_password/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.status === 200) {
       
         
             
              setNewAccount({
                ...newAccount,
                password:"",
                Idaccount: response.data.id,
                urltdata:response.data.path,
              });
          
          setButtonText("Đăng nhập thành công thêm tài khoản vào hệ thống")
          
         
        } 
         
       
      } 

      if(buttonText=="Đăng nhập thành công thêm tài khoản vào hệ thống" || buttonText=="Thêm tài khoản"){

        

        const formData = new FormData();
        formData.append("phone_number", newAccount.phone);
        formData.append("session_name", newAccount.phone);
        formData.append("contactName", newAccount.name);
        formData.append("idaccount", newAccount.Idaccount);
        formData.append("sessionPath", newAccount.urltdata);


        const response = await axios.post("http://localhost:8000/insertaccount", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setAccounts([...accounts,{
            "username":newAccount.name,
            "Idaccount":newAccount.Idaccount,
            "tdataPath":newAccount.urltdata,
            "sessionPath":newAccount.urltdata,
            "phone":newAccount.phone

        }]);
        
        //addAccount();
        newAccount.phone=""
        newAccount.password=""
    
        setIsAdding(false);
        setButtonText("Lấy mã đăng nhập")
        alert("Thêm Thành công");
        setNewAccount({
            name: "",
            email: "",
            phone: "",
            password: "",
            urltdata:"",
            status: "1",
            typelogin:"tdata"
          });

      }

      


     
     
    }
  };

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatsAll,selectedChat]);

  const addAccount = () => {
    const newAccount = { name: `User ${accounts.length + 1}`, status: "online" };
    setAccounts([...accounts, newAccount]);
  };

  const sendMessage = async (chatId, message, sessionName,sender_id) => {
    try {
      let formData = new FormData();
      
      formData.append("message", message);
      formData.append("chat_id",chatId);
      formData.append("session_name",sessionName);
      formData.append("sender_id",sender_id);
 
      const response = await axios.post('http://localhost:8000/send_message_chatid',formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
     
    } catch (error) {
      alert("Lỗi khi gửi tin nhắn:", error.message)
      console.error("Lỗi khi gửi tin nhắn:", error.message);
    }
  };

  const handleSendMessage = (e) => {
 
    
    if (input.trim()) {
     try{

    
      setSelectedChat((prevChat) => {
        const updatedChat = {
          ...prevChat,
          messages: [
            ...(prevChat?.messages || []),
            {
                id: (prevChat?.messages?.length || 0) + 1,
              ContactTeleId:selectedaccount.phone,
              SenderId: selectedaccount.Idaccount,
              ReceiverId: prevChat.iduser,// Dùng prevChat để đảm bảo đúng dữ liệu
              Message: input,
              Status: 0,
              read: true,
            },
          ],
        };

        
    
        // Cập nhật `chatsAll` ngay trong setState để đảm bảo không dùng dữ liệu cũ
        setChatsAll((prevChats) => {
          const index = prevChats[selectedaccount.phone]?.findIndex(
            (item) => item.id === prevChat.id
          );
    
          if (index >= 0) {
            prevChats[selectedaccount.phone][index] = updatedChat;
          }
          return { ...prevChats };
        });

        
    
        return updatedChat; // Trả về `updatedChat` để cập nhật state
      });
    }catch{

    }
 

    //   setSelectedChat((prevChat) => ({
    //     ...prevChat,
    //     messages: [...prevChat.messages, { id: prevChat.messages.length + 1,SenderId:selectedaccount.id,ReceiverId:selectedChat.iduser, text: input, sender: "me", read: false }],
    //   }
    
    
    
    // ));



      // const index = chatsAll[selectedaccount.phone].findIndex(item => item.id === selectedChat.id);


      //     if(index>=0){
          
      //   chatsAll[selectedaccount.phone][index]=selectedChat
      //     }
      //   else{
        
      //   }
      //   console.log(chatsAll)

   // setChats(chatsAll[selectedaccount.phone])


  

       sendMessage(selectedChat.iduser, input, selectedaccount.phone,selectedaccount.Idaccount);
      
      setInput("");
    }
  
    
  
  
  };
    const [data, setData] = useState({
    message: "",
    username: "",
    phone: "",
    pathfile: "",
  });
  const handleFileSelect = (message, username, phone, pathfile,iduser) => {
    
    setNewAccount({
      ...newAccount,
      name: username,
      phone: phone,
      urltdata: pathfile,
      Idaccount:iduser
    });
    
  };
  return (
    
    <div style={{ display: "flex",width: "100vw", height: "100vh", backgroundColor: darkMode ? "#1a1a1a" : "#f0f0f0", color: darkMode ? "white" : "black" }}>
      <div style={{ width: "15%", backgroundColor: "#333", padding: "10px", color: "white", display: "flex", flexDirection: "column",  maxHeight: "100vh" }}>
      <div style={{ }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <button onClick={() => setIsOpen(!isOpen)} style={{ color: "white", background: "none", border: "none" }}>☰</button>
           {/* Danh sách tài khoản */}
    {/* Overlay (Bóng mờ) */}
    {

}
    {isOpen && isAdding==false && (
        <div
          onClick={() => setIsOpen(false)} // Bấm vào overlay để đóng menu
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)", // Màu đen, opacity 50%
            zIndex: 5, // Đảm bảo nằm phía sau menu
          }}

          
        />

        
      )}
         {isOpen && isAdding &&  (
        <div
         // Bấm vào overlay để đóng menu
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)", // Màu đen, opacity 50%
            zIndex: 5, // Đảm bảo nằm phía sau menu
          }}

          
        >
      <div style={{
          marginTop: "10%",
          
          padding: "15px",
          background: "rgba(21, 67, 167, 0.5)",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "550px",
          position: "absolute",
          top: "20%",
          height: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}>
          
          <h3 style={{ color: "red", textAlign: "center" }}>Thêm tài khoản</h3>


          {/* Các ô nhập thông tin */}
          <input type="text" name="name" value={newAccount.name} onChange={handleChange} placeholder="Tên tài khoản..." style={inputStyle} />

        

          <div>
            <label>
              <input type="radio" name="typelogin" value="tdata" checked={newAccount.typelogin == "tdata"} onChange={handleChange} />
              Tdata
            </label>
            <label>
              <input type="radio" name="typelogin" value="password" checked={newAccount.typelogin == "password"} onChange={handleChange} />
              Code
            </label>
           
          </div>

          <input type="tel" name="phone" value={newAccount.phone} onChange={handleChange} placeholder="Số điện thoại..." style={inputStyle} />
          
          {isOpenLogin==true ? (
        <div>
      <input type="urltdata" name="urltdata" value={newAccount.urltdata} onChange={handleChange} placeholder="Tdata..." style={inputStyle} />
                <FileUpload onFileSelect={handleFileSelect}></FileUpload>

        </div>
      ) : (
      <input type="password" name="password" value={newAccount.password} onChange={handleChange} placeholder="Mã Code..." style={inputStyle} />
      )}



      
          {/* Chọn trạng thái */}
          <select name="status" value={newAccount.status} onChange={handleChange} style={inputStyle}>
            <option value="1">🟢 Online</option>
            <option value="0">⚪ Offline</option>
          </select>

          {/* Nút xác nhận & hủy */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleAddAccount} style={buttonStyle("green")}>{buttonText}</button>
            <button onClick={() => setIsAdding(false)} style={buttonStyle("red")}>❌ Hủy</button>
          </div>
        </div>
        </div>

        
      )}

      {/* Danh sách tài khoản */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            width: "15%",
            height: "100%",
            left: "0",
          
            background: "#333",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            animation: "slideIn 0.3s ease-in-out",
            zIndex: 10, // Đảm bảo nằm trên overlay
          }}
        >

      <h2>List Danh Sách</h2>
      {

}
           <button
        onClick={() => setIsAdding(true)}
        style={{ background: "blue", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
      >
        ➕ Add tài khoản
      </button>
           <div style={{ width: "100%", height: "80%"}}> 

          {
          
          accounts.map((account, index) => (
            <div
              key={index}
              onClick={() => clickaccount(account)} 
              onMouseEnter={() =>  setHoveredccount(account.phone)}
              onMouseLeave={() =>  setHoveredccount(null)}
              style={{ width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 5px",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                fontSize: "18px",
              color: hoveredAccount === account.phone ? "red" : "white", 
              backgroundColor: selectedaccount.phone === account.phone ? "rgba(255, 217, 48, 0.5)" : "rgba(255,255,255,0.2)"

              }
            }
            >
              <span>{account.phone}</span>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: account.status === 0 ? "green" : "gray",
                }}
              ></span>
            </div>
          ))}


            </div>
           
          

            
        </div>
      )}

      {/* Hiệu ứng animation */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
          <h2>{selectedaccount.phone}</h2>
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: "none", border: "none", color: "white" }}>
            {darkMode ? "☀" : "🌙"}
          </button>
        </div>
        </div>
       

        <input type="text" placeholder="Search" value = {SearchValue}    name="Search" onChange={handleChange} style={{ width: "100%", padding: "5px", marginBottom: "10px", borderRadius: "5px", border: "none" }} />
        {

}
<button
        onClick={() => Synccontact()}
        style={{ background: "Red", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
      >
    { "➕Đồng bộ contact" }


      </button>
<button
        onClick={() => addContact()}
        style={{ background: "blue", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
      >
    { "➕ Add Contact" }


      </button>



{isAddingContact && <input type="text" placeholder="Namecontact" value = {ContactAdd.name}    name="Namecontact" onChange={handleChange} style={{ width: "100%", padding: "5px", marginBottom: "10px", borderRadius: "5px", border: "none" }} />
    }
 {isAddingContact &&  <input type="text" placeholder="Phonecontact" value = {ContactAdd.phone}    name="Phonecontact" onChange={handleChange} style={{ width: "100%", padding: "5px", marginBottom: "10px", borderRadius: "5px", border: "none" }} />
    
   
   }
    

        <div style={{  overflowY: "auto" }}>
             {chats!=undefined && chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => clickchat(chat)} 
            onMouseEnter={() => setHoveredChat(chat.id)}
            onMouseLeave={() => setHoveredChat(null)}

            style={{ padding: "10px", font:"18px","fontWeight":"bold",display: "flex", justifyContent: "space-between", cursor: "pointer", backgroundColor: "#444",
               marginBottom: "5px",
               borderRadius: "5px" ,
               
              color: hoveredChat === chat.id ? "red" : "#444", 
              backgroundColor: selectedChat.id === chat.id ? "rgba(48, 255, 117, 0.5)" : "rgba(20, 255, 255)"
            
            }}>
            <span>{chat.name}</span>
            {chat.unread > 0 && <span style={{ backgroundColor: "red", padding: "2px 6px", borderRadius: "50%", fontSize: "12px" }}>{chat.unread}</span>}
          </div>
        ))}



        </div>

      </div>


{  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "10px", backgroundColor: "#555", color: "white" }}>
        <button
        onClick={() => SyncTextChat()}
        style={{ background: "blue", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
      >
    { "Đồng bộ text" }


      </button>


          <h2>{selectedChat.name}</h2>
        </div>
        <div style={{ flex: 1, padding: "10px", overflowY: "auto", backgroundColor: darkMode ? "#222" : "#ddd" }}>
          {Object.keys(selectedChat).length !== 0 && selectedChat.messages.map((msg) => (
            <div key={msg.id} style={{ textAlign: msg.SenderId !== msg.ReceiverId ? "right" : "left", marginBottom: "10px" }}>
              <p style={{ display: "inline-block", padding: "10px", borderRadius: "10px", backgroundColor: "#007bff", color: "white" }}>{msg.Message}</p>
              <span style={{ fontSize: "12px", marginLeft: "5px", color: msg.read ? "green" : "gray" }}>
                {msg.read ? "✓✓ Read" : "✓ Sent"}
              </span>
              
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{ padding: "10px", backgroundColor: "#ccc", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage(e); // Gọi hàm xử lý khi nhấn Enter
              }}}
            style={{ flex: 1, padding: "20px", borderRadius: "5px", border: "none" }}
            placeholder="Write a message..."
          />
          <button
            onClick={handleSendMessage}
            style={{ marginLeft: "10px", backgroundColor: "#007bff", color: "white", border: "none", padding: "15px 30px", borderRadius: "5px" }}
          >
            ➤
          </button>
        </div>
      </div>}
    
    </div>
  );
  
}
const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid gray",
};

const buttonStyle = (color) => ({
  padding: "8px 15px",
  background: color,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
});
