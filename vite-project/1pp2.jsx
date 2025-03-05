import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/src/App.jsx");
if (!window.$RefreshReg$)
    throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import*as RefreshRuntime from "/@react-refresh";

import __vite__cjsImport1_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=424fb9b7";
const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport2_react from "/node_modules/.vite/deps/react.js?v=424fb9b7";
const useState = __vite__cjsImport2_react["useState"];
const useEffect = __vite__cjsImport2_react["useEffect"];
const useRef = __vite__cjsImport2_react["useRef"];
import FileUpload from "/src/upload.jsx";
import axios from "/node_modules/.vite/deps/axios.js?v=424fb9b7";
export default function TelegramUI() {
    _s();
    const [darkMode,setDarkMode] = useState(false);
    const [chats,setChats] = useState([{
        id: 2,
        name: "#Memhash",
        lastMessage: "GIF 🖼️",
        unread: 2,
        messages: [{
            id: 1,
            text: "This is Memhash chat",
            sender: "them",
            read: true
        }, {
            id: 2,
            text: "This is Memhash chat",
            sender: "them",
            read: true
        }]
    }]);
    useEffect( () => {
        const socket = new WebSocket("ws://localhost:8000/ws");
        setWs(socket);
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            try {
                console.log(SelectedChat);
                setSelectedChat( (prevChat) => {
                    const updatedChat = {
                        ...prevChat,
                        messages: [...prevChat.messages, {
                            id: prevChat.messages.length + 1,
                            ContactTeleId: data["session_name"],
                            SenderId: data["sender"],
                            ReceiverId: data["chat_id"],
                            Message: data["message"],
                            Status: 0,
                            read: true
                        }]
                    };
                    setChatsAll( (prevChats) => {
                        const index = prevChats[data["session_name"]]?.findIndex( (item) => item.iduser == data["chat_id"]);
                        console.log(prevChats, "aaa", data["chat_id"]);
                        console.log("index", index);
                        if (index >= 0) {
                            prevChats[data["session_name"]][index] = updatedChat;
                        }
                        return {
                            ...prevChats
                        };
                    }
                    );
                    return updatedChat;
                    // Trả về `updatedChat` để cập nhật state
                }
                );
            } catch {}
        }
        ;
        return () => socket.close();
    }
    , []);
    const [chatsAll,setChatsAll] = useState({});
    const [selectedChatid,setSelectedChatid] = useState(0);
    const [selectedChat,setSelectedChat] = useState({});
    const [input,setInput] = useState("");
    const messagesEndRef = useRef(null);
    const [isOpen,setIsOpen] = useState(false);
    const [isOpenLogin,setIsLogin] = useState(false);
    const [newAccount,setNewAccount] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        urltdata: "",
        Idaccount: "",
        status: "online",
        typelogin: "password"
    });
    const [accounts,setAccounts] = useState([]);
    const [SearchValue,setSearchValue] = useState([]);
    const [ContactAdd,setContactAdd] = useState({
        name: "",
        phone: "",
        iduser: ""
    });
    const [selectedaccount,setSelectedAccount] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        urltdata: "",
        status: "online",
        typelogin: "tdata"
    });
    useEffect( () => {
        axios.get("http://127.0.0.1:5001/api/accounts").then( (response) => {
            setAccounts(response.data);
            // Cập nhật state với dữ liệu từ API
        }
        ).catch( (error) => {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
        );
        console.log("aaaaaaaaaaaaa");
        axios.get("http://127.0.0.1:5001/api/getlistchat").then( (response) => {
            if (Object.keys(response.data).length !== 0) {
                console.log("response", response.data);
                setChatsAll(response.data);
            }
            // Cập nhật state với dữ liệu từ API
        }
        ).catch( (error) => {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
        );
    }
    , []);
    useEffect( () => {
        if (accounts.length > 0) {
            if (selectedaccount.phone == undefined || selectedaccount.phone == "") {
                setSelectedAccount(accounts[0]);
                setChats(chatsAll[accounts[0].phone]);
            } else {
                setSelectedAccount(selectedaccount);
                setChats(chatsAll[selectedaccount.phone]);
            }
        }
    }
    , [accounts, chatsAll]);
    // Chạy khi accounts thay đổi
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        console.log(value);
        if (type === "radio") {
            if (value == "password") {
                setIsLogin(false);
                setButtonText("Lấy mã đăng nhập");
            }
            if (value == "tdata") {
                setIsLogin(true);
                setButtonText("Thêm tài khoản");
            }
        }
        if (name == "Search") {
            setSearchValue(value);
        }
        if (name == "Namecontact") {
            ContactAdd.name = e.target.value;
        }
        if (name == "Phonecontact") {
            ContactAdd.phone = e.target.value;
        }
        console.log(name);
        setNewAccount({
            ...newAccount,
            [e.target.name]: e.target.value
        });
    }
    ;
    const clickaccount = (e) => {
        setSelectedAccount(e);
        setIsOpen(!isOpen);
        if (chatsAll[e.phone] != undefined) {
            setChats(chatsAll[e.phone]);
            setSelectedChat(chatsAll[e.phone][0]);
        } else {
            setChats([]);
            setSelectedChat({
                id: 2,
                messages: []
            });
        }
        // setSelectedChat(chats)
    }
    ;
    const clickchat = (e) => {
        // setChats(chatsAll[accounts[0].phone])
        setSelectedChat(e);
    }
    ;
    const getapichat = (e) => {}
    ;
    const validatePhone = (input) => {
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        // Cho phép dấu + ở đầu, theo sau là 10-15 số
        return phoneRegex.test(input);
    }
    ;
    const addNewChat = (phoneNumber, newChat) => {
        console.log("newChat", newChat);
        setChatsAll( (prevChats) => ({
            ...prevChats,
            [phoneNumber]: prevChats[phoneNumber] ? [...prevChats[phoneNumber], newChat]// Nếu đã có chat, thêm vào mảng
            : [newChat]
        }));
    }
    ;
    const addContact = async (e) => {
        setIsAddingContact(!isAddingContact);
        if (isAddingContact == true) {
            if (validatePhone(ContactAdd.phone)) {
                const formData = new FormData();
                console.log(selectedaccount.phone);
                formData.append("target_phone", ContactAdd.phone);
                formData.append("contactName", ContactAdd.name);
                formData.append("session_name", selectedaccount.phone);
                const response = await axios.post("http://localhost:8000/addcontact/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    //  setContactAdd({name:"",phone:""})
                    console.log("response", response.data);
                    var iduser = response.data.iduser;
                    addNewChat(selectedaccount.phone, {
                        id: Math.floor(Math.random() * 10000) + 1,
                        name: ContactAdd.name,
                        phonecontact: ContactAdd.phone,
                        iduser: iduser,
                        lastMessage: "",
                        unread: 0,
                        messages: []
                    });
                    alert("Thêm thành công");
                } else {}
            } else {
                // setContactAdd({name:"",phone:""})
                alert("Sai định dạng");
            }
        }
    }
    ;
    const [isAddingContact,setIsAddingContact] = useState(false);
    const [isAdding,setIsAdding] = useState(false);
    const [newAccountName,setNewAccountName] = useState("");
    const [hoveredChat,setHoveredChat] = useState(null);
    const [hoveredAccount,setHoveredccount] = useState(null);
    const [Accountcurrent,setAccount] = useState(null);
    const [ws,setWs] = useState(null);
    const [buttonText,setButtonText] = useState("Lấy mã đăng nhập");
    const handleAddAccount = async () => {
        if (newAccount.phone.trim() !== "") {
            if (buttonText == "Lấy mã đăng nhập") {
                const formData = new FormData();
                formData.append("phone_number", newAccount.phone);
                formData.append("session_name", newAccount.phone);
                const response = await axios.post("http://localhost:8000/login/request_otp/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    setButtonText("Nhập mã code về số điện thoại");
                } else {}
            }
            if (buttonText == "Nhập mã code về số điện thoại") {
                const formData = new FormData();
                formData.append("phone_number", newAccount.phone);
                formData.append("code", newAccount.password);
                const response = await axios.post("http://localhost:8000/login/verify_otp/.", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    console.log("response.data.me", response.data.me);
                    console.log(response);
                    setNewAccount({
                        ...newAccount,
                        Idaccount: response.data.me
                    });
                    setNewAccount({
                        ...newAccount,
                        sessionPath: response.data.path
                    });
                    setButtonText("Đăng nhập thành công thêm tài khoản vào hệ thống");
                    // setAccounts([...accounts, { phone: newAccount.phone, status: 0 }]);
                    // setNewAccountName("");
                    // setIsAdding(false);
                }
                if (response.status === 205) {
                    setButtonText("Nhập mk cấp 2");
                }
            }
            if (buttonText == "Nhập mk cấp 2") {
                const formData = new FormData();
                formData.append("phone_number", newAccount.phone);
                formData.append("password", newAccount.password);
                const response = await axios.post("http://localhost:8000/login/verify_password/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                if (response.status === 200) {
                    console.log("response.data.me", response.data.me);
                    console.log(response);
                    setNewAccount( (prev) => ({
                        ...prev,
                        Idaccount: response.data.me,
                        sessionPath: response.data.path
                    }));
                    setButtonText("Đăng nhập thành công thêm tài khoản vào hệ thống");
                }
            }
            if (buttonText == "Đăng nhập thành công thêm tài khoản vào hệ thống" || buttonText == "Thêm tài khoản") {
                const formData = new FormData();
                formData.append("phone_number", newAccount.phone);
                formData.append("session_name", newAccount.phone);
                formData.append("contactName", newAccount.name);
                formData.append("idaccount", newAccount.Idaccount);
                formData.append("sessionPath", newAccount.urltdata);
                console.log(newAccount.phone);
                console.log(newAccount.name);
                console.log(newAccount.name);
                console.log(newAccount.Idaccount);
                console.log(newAccount.urltdata);
                const response = await axios.post("http://localhost:8000/insertaccount", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                setAccounts([...accounts, newAccount]);
                newAccount.phone = "";
                newAccount.password = "";
                setNewAccount({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    urltdata: "",
                    status: "online",
                    typelogin: "tdata"
                });
                setIsAdding(false);
                setButtonText("Lấy mã đăng nhập");
                alert("Thêm Thành công");
            }
        }
    }
    ;
    useEffect( () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }
    , [selectedChat.messages]);
    const addAccount = () => {
        const newAccount = {
            name: `User ${accounts.length + 1}`,
            status: "online"
        };
        setAccounts([...accounts, newAccount]);
    }
    ;
    const sendMessage = async (chatId, message, sessionName, sender_id) => {
        try {
            let formData = new FormData();
            formData.append("message", message);
            formData.append("chat_id", chatId);
            formData.append("session_name", sessionName);
            formData.append("sender_id", sender_id);
            console.log(chatId, message, sessionName, sender_id);
            const response = await axios.post('http://localhost:8000/send_message_chatid', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response);
            console.log(response.data);
        } catch (error) {
            alert("Lỗi khi gửi tin nhắn:", error.message);
            console.error("Lỗi khi gửi tin nhắn:", error.message);
        }
    }
    ;
    const handleSendMessage = (e) => {
        if (input.trim()) {
            try {
                setSelectedChat( (prevChat) => {
                    const updatedChat = {
                        ...prevChat,
                        messages: [...prevChat.messages, {
                            id: prevChat.messages.length + 1,
                            SenderId: selectedaccount.Idaccount,
                            ReceiverId: prevChat.iduser,
                            Message: input,
                            read: false
                        }]
                    };
                    // Cập nhật `chatsAll` ngay trong setState để đảm bảo không dùng dữ liệu cũ
                    setChatsAll( (prevChats) => {
                        const index = prevChats[selectedaccount.phone]?.findIndex( (item) => item.id === prevChat.id);
                        if (index >= 0) {
                            prevChats[selectedaccount.phone][index] = updatedChat;
                        }
                        return {
                            ...prevChats
                        };
                    }
                    );
                    return updatedChat;
                    // Trả về `updatedChat` để cập nhật state
                }
                );
            } catch {}
            console.log("aa123", chatsAll);
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
            console.log("aa", selectedaccount, selectedChat);
            sendMessage(selectedChat.iduser, input, selectedaccount.phone, selectedaccount.Idaccount);
            setInput("");
        }
    }
    ;
    const [data,setData] = useState({
        message: "",
        username: "",
        phone: "",
        pathfile: ""
    });
    const handleFileSelect = (message, username, phone, pathfile, iduser) => {
        setNewAccount({
            ...newAccount,
            name: username,
            phone: phone,
            urltdata: pathfile,
            Idaccount: iduser
        });
    }
    ;
    return /*#__PURE__*/
    _jsxDEV("div", {
        style: {
            display: "flex",
            width: "100vw",
            height: "100vh",
            backgroundColor: darkMode ? "#1a1a1a" : "#f0f0f0",
            color: darkMode ? "white" : "black"
        },
        children: [/*#__PURE__*/
        _jsxDEV("div", {
            style: {
                width: "15%",
                backgroundColor: "#333",
                padding: "10px",
                color: "white",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100vh"
            },
            children: [/*#__PURE__*/
            _jsxDEV("div", {
                style: {},
                children: /*#__PURE__*/
                _jsxDEV("div", {
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px"
                    },
                    children: [/*#__PURE__*/
                    _jsxDEV("button", {
                        onClick: () => setIsOpen(!isOpen),
                        style: {
                            color: "white",
                            background: "none",
                            border: "none"
                        },
                        children: "☰"
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 583,
                        columnNumber: 11
                    }, this), isOpen && isAdding == false && /*#__PURE__*/
                    _jsxDEV("div", {
                        onClick: () => setIsOpen(false),
                        style: {
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 5
                        }
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 590,
                        columnNumber: 9
                    }, this), isOpen && isAdding && /*#__PURE__*/
                    _jsxDEV("div", {
                        // Bấm vào overlay để đóng menu
                        style: {
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            background: "rgba(0, 0, 0, 0.5)",
                            zIndex: 5
                        },
                        children: /*#__PURE__*/
                        _jsxDEV("div", {
                            style: {
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
                                transform: "translate(-50%, -50%)"
                            },
                            children: [/*#__PURE__*/
                            _jsxDEV("h3", {
                                style: {
                                    color: "red",
                                    textAlign: "center"
                                },
                                children: "Thêm tài khoản"
                            }, void 0, false, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 640,
                                columnNumber: 11
                            }, this), /*#__PURE__*/
                            _jsxDEV("input", {
                                type: "text",
                                name: "name",
                                value: newAccount.name,
                                onChange: handleChange,
                                placeholder: "Tên tài khoản...",
                                style: inputStyle
                            }, void 0, false, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 644,
                                columnNumber: 11
                            }, this), /*#__PURE__*/
                            _jsxDEV("div", {
                                children: [/*#__PURE__*/
                                _jsxDEV("label", {
                                    children: [/*#__PURE__*/
                                    _jsxDEV("input", {
                                        type: "radio",
                                        name: "typelogin",
                                        value: "tdata",
                                        checked: newAccount.typelogin == "tdata",
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                        lineNumber: 650,
                                        columnNumber: 15
                                    }, this), "Tdata"]
                                }, void 0, true, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 649,
                                    columnNumber: 13
                                }, this), /*#__PURE__*/
                                _jsxDEV("label", {
                                    children: [/*#__PURE__*/
                                    _jsxDEV("input", {
                                        type: "radio",
                                        name: "typelogin",
                                        value: "password",
                                        checked: newAccount.typelogin == "password",
                                        onChange: handleChange
                                    }, void 0, false, {
                                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                        lineNumber: 654,
                                        columnNumber: 15
                                    }, this), "Code"]
                                }, void 0, true, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 653,
                                    columnNumber: 13
                                }, this)]
                            }, void 0, true, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 648,
                                columnNumber: 11
                            }, this), /*#__PURE__*/
                            _jsxDEV("input", {
                                type: "tel",
                                name: "phone",
                                value: newAccount.phone,
                                onChange: handleChange,
                                placeholder: "Số điện thoại...",
                                style: inputStyle
                            }, void 0, false, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 660,
                                columnNumber: 11
                            }, this), isOpenLogin == true ? /*#__PURE__*/
                            _jsxDEV("div", {
                                children: [/*#__PURE__*/
                                _jsxDEV("input", {
                                    type: "urltdata",
                                    name: "urltdata",
                                    value: newAccount.urltdata,
                                    onChange: handleChange,
                                    placeholder: "Tdata...",
                                    style: inputStyle
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 664,
                                    columnNumber: 7
                                }, this), /*#__PURE__*/
                                _jsxDEV(FileUpload, {
                                    onFileSelect: handleFileSelect
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 665,
                                    columnNumber: 17
                                }, this)]
                            }, void 0, true, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 663,
                                columnNumber: 9
                            }, this) : /*#__PURE__*/
                            _jsxDEV("input", {
                                type: "password",
                                name: "password",
                                value: newAccount.password,
                                onChange: handleChange,
                                placeholder: "Mã Code...",
                                style: inputStyle
                            }, void 0, false, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 669,
                                columnNumber: 7
                            }, this), /*#__PURE__*/
                            _jsxDEV("select", {
                                name: "status",
                                value: newAccount.status,
                                onChange: handleChange,
                                style: inputStyle,
                                children: [/*#__PURE__*/
                                _jsxDEV("option", {
                                    value: "online",
                                    children: "🟢 Online"
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 677,
                                    columnNumber: 13
                                }, this), /*#__PURE__*/
                                _jsxDEV("option", {
                                    value: "offline",
                                    children: "⚪ Offline"
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 678,
                                    columnNumber: 13
                                }, this)]
                            }, void 0, true, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 676,
                                columnNumber: 11
                            }, this), /*#__PURE__*/
                            _jsxDEV("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between"
                                },
                                children: [/*#__PURE__*/
                                _jsxDEV("button", {
                                    onClick: handleAddAccount,
                                    style: buttonStyle("green"),
                                    children: buttonText
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 683,
                                    columnNumber: 13
                                }, this), /*#__PURE__*/
                                _jsxDEV("button", {
                                    onClick: () => setIsAdding(false),
                                    style: buttonStyle("red"),
                                    children: "❌ Hủy"
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 684,
                                    columnNumber: 13
                                }, this)]
                            }, void 0, true, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 682,
                                columnNumber: 11
                            }, this)]
                        }, void 0, true, {
                            fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                            lineNumber: 622,
                            columnNumber: 7
                        }, this)
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 608,
                        columnNumber: 9
                    }, this), isOpen && /*#__PURE__*/
                    _jsxDEV("div", {
                        style: {
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
                            zIndex: 10
                        },
                        children: [/*#__PURE__*/
                        _jsxDEV("h2", {
                            children: "List Danh Sách"
                        }, void 0, false, {
                            fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                            lineNumber: 712,
                            columnNumber: 7
                        }, this), /*#__PURE__*/
                        _jsxDEV("button", {
                            onClick: () => setIsAdding(true),
                            style: {
                                background: "blue",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "5px"
                            },
                            children: "➕ Add tài khoản"
                        }, void 0, false, {
                            fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                            lineNumber: 716,
                            columnNumber: 12
                        }, this), /*#__PURE__*/
                        _jsxDEV("div", {
                            style: {
                                width: "100%",
                                height: "80%"
                            },
                            children: accounts.map( (account, index) => /*#__PURE__*/
                            _jsxDEV("div", {
                                onClick: () => clickaccount(account),
                                onMouseEnter: () => setHoveredccount(account.phone),
                                onMouseLeave: () => setHoveredccount(null),
                                style: {
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px 5px",
                                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                                    fontSize: "18px",
                                    color: hoveredAccount === account.phone ? "red" : "white",
                                    backgroundColor: selectedaccount.phone === account.phone ? "rgba(255, 217, 48, 0.5)" : "rgba(255,255,255,0.2)"
                                },
                                children: [/*#__PURE__*/
                                _jsxDEV("span", {
                                    children: account.phone
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 745,
                                    columnNumber: 15
                                }, this), /*#__PURE__*/
                                _jsxDEV("span", {
                                    style: {
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        background: account.status === 0 ? "green" : "gray"
                                    }
                                }, void 0, false, {
                                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                    lineNumber: 746,
                                    columnNumber: 15
                                }, this)]
                            }, index, true, {
                                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                                lineNumber: 727,
                                columnNumber: 13
                            }, this))
                        }, void 0, false, {
                            fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                            lineNumber: 722,
                            columnNumber: 12
                        }, this)]
                    }, void 0, true, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 694,
                        columnNumber: 9
                    }, this), /*#__PURE__*/
                    _jsxDEV("style", {
                        children: `
          @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 767,
                        columnNumber: 7
                    }, this), /*#__PURE__*/
                    _jsxDEV("h2", {
                        children: selectedaccount.phone
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 775,
                        columnNumber: 11
                    }, this), /*#__PURE__*/
                    _jsxDEV("button", {
                        onClick: () => setDarkMode(!darkMode),
                        style: {
                            background: "none",
                            border: "none",
                            color: "white"
                        },
                        children: darkMode ? "☀" : "🌙"
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 776,
                        columnNumber: 11
                    }, this)]
                }, void 0, true, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 582,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 581,
                columnNumber: 7
            }, this), /*#__PURE__*/
            _jsxDEV("input", {
                type: "text",
                placeholder: "Search",
                value: SearchValue,
                name: "Search",
                onChange: handleChange,
                style: {
                    width: "100%",
                    padding: "5px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "none"
                }
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 783,
                columnNumber: 9
            }, this), /*#__PURE__*/
            _jsxDEV("button", {
                onClick: () => addContact(),
                style: {
                    background: "blue",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "5px"
                },
                children: "➕ Add Contact"
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 787,
                columnNumber: 1
            }, this), console.log("chats", chats), isAddingContact && /*#__PURE__*/
            _jsxDEV("input", {
                type: "text",
                placeholder: "Namecontact",
                value: ContactAdd.name,
                name: "Namecontact",
                onChange: handleChange,
                style: {
                    width: "100%",
                    padding: "5px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "none"
                }
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 797,
                columnNumber: 21
            }, this), isAddingContact && /*#__PURE__*/
            _jsxDEV("input", {
                type: "text",
                placeholder: "Phonecontact",
                value: ContactAdd.phone,
                name: "Phonecontact",
                onChange: handleChange,
                style: {
                    width: "100%",
                    padding: "5px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    border: "none"
                }
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 799,
                columnNumber: 23
            }, this), /*#__PURE__*/
            _jsxDEV("div", {
                style: {
                    overflowY: "auto"
                },
                children: chats != undefined && chats.map( (chat) => /*#__PURE__*/
                _jsxDEV("div", {
                    onClick: () => clickchat(chat),
                    onMouseEnter: () => setHoveredChat(chat.id),
                    onMouseLeave: () => setHoveredChat(null),
                    style: {
                        padding: "10px",
                        font: "18px",
                        "fontWeight": "bold",
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        backgroundColor: "#444",
                        marginBottom: "5px",
                        borderRadius: "5px",
                        color: hoveredChat === chat.id ? "red" : "#444",
                        backgroundColor: selectedChat.id === chat.id ? "rgba(48, 255, 117, 0.5)" : "rgba(20, 255, 255)"
                    },
                    children: [/*#__PURE__*/
                    _jsxDEV("span", {
                        children: chat.name
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 821,
                        columnNumber: 13
                    }, this), chat.unread > 0 && /*#__PURE__*/
                    _jsxDEV("span", {
                        style: {
                            backgroundColor: "red",
                            padding: "2px 6px",
                            borderRadius: "50%",
                            fontSize: "12px"
                        },
                        children: chat.unread
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 822,
                        columnNumber: 33
                    }, this)]
                }, chat.id, true, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 807,
                    columnNumber: 11
                }, this))
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 805,
                columnNumber: 9
            }, this)]
        }, void 0, true, {
            fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
            lineNumber: 580,
            columnNumber: 7
        }, this), console.log("selectedChat", selectedChat), /*#__PURE__*/
        _jsxDEV("div", {
            style: {
                flex: 1,
                display: "flex",
                flexDirection: "column"
            },
            children: [/*#__PURE__*/
            _jsxDEV("div", {
                style: {
                    padding: "10px",
                    backgroundColor: "#555",
                    color: "white"
                },
                children: /*#__PURE__*/
                _jsxDEV("h2", {
                    children: selectedChat.name
                }, void 0, false, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 835,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 834,
                columnNumber: 9
            }, this), /*#__PURE__*/
            _jsxDEV("div", {
                style: {
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    backgroundColor: darkMode ? "#222" : "#ddd"
                },
                children: [Object.keys(selectedChat).length !== 0 && selectedChat.messages.map( (msg) => /*#__PURE__*/
                _jsxDEV("div", {
                    style: {
                        textAlign: msg.SenderId !== msg.ReceiverId ? "right" : "left",
                        marginBottom: "10px"
                    },
                    children: [/*#__PURE__*/
                    _jsxDEV("p", {
                        style: {
                            display: "inline-block",
                            padding: "10px",
                            borderRadius: "10px",
                            backgroundColor: "#007bff",
                            color: "white"
                        },
                        children: msg.Message
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 840,
                        columnNumber: 15
                    }, this), /*#__PURE__*/
                    _jsxDEV("span", {
                        style: {
                            fontSize: "12px",
                            marginLeft: "5px",
                            color: msg.read ? "green" : "gray"
                        },
                        children: msg.read ? "✓✓ Read" : "✓ Sent"
                    }, void 0, false, {
                        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                        lineNumber: 841,
                        columnNumber: 15
                    }, this)]
                }, msg.id, true, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 839,
                    columnNumber: 13
                }, this)), /*#__PURE__*/
                _jsxDEV("div", {
                    ref: messagesEndRef
                }, void 0, false, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 847,
                    columnNumber: 11
                }, this)]
            }, void 0, true, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 837,
                columnNumber: 9
            }, this), /*#__PURE__*/
            _jsxDEV("div", {
                style: {
                    padding: "10px",
                    backgroundColor: "#ccc",
                    display: "flex",
                    alignItems: "center"
                },
                children: [/*#__PURE__*/
                _jsxDEV("input", {
                    type: "text",
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    onKeyDown: (e) => {
                        if (e.key === "Enter") {
                            handleSendMessage(e);
                            // Gọi hàm xử lý khi nhấn Enter
                        }
                    }
                    ,
                    style: {
                        flex: 1,
                        padding: "20px",
                        borderRadius: "5px",
                        border: "none"
                    },
                    placeholder: "Write a message..."
                }, void 0, false, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 850,
                    columnNumber: 11
                }, this), /*#__PURE__*/
                _jsxDEV("button", {
                    onClick: handleSendMessage,
                    style: {
                        marginLeft: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "15px 30px",
                        borderRadius: "5px"
                    },
                    children: "➤"
                }, void 0, false, {
                    fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                    lineNumber: 861,
                    columnNumber: 11
                }, this)]
            }, void 0, true, {
                fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
                lineNumber: 849,
                columnNumber: 9
            }, this)]
        }, void 0, true, {
            fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
            lineNumber: 833,
            columnNumber: 4
        }, this)]
    }, void 0, true, {
        fileName: "F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx",
        lineNumber: 579,
        columnNumber: 5
    }, this);
}
_s(TelegramUI, "lqs1XVk5bBnVlYDcXGkZJ2x3UKM=");
_c = TelegramUI;
const inputStyle = {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid gray"
};
const buttonStyle = (color) => ({
    padding: "8px 15px",
    background: color,
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
});
var _c;
$RefreshReg$(_c, "TelegramUI");

window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

RefreshRuntime.__hmr_import(import.meta.url).then( (currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx", currentExports);
    import.meta.hot.accept( (nextExports) => {
        if (!nextExports)
            return;
        const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("F:/ProjectteleAppFrontend/testapp/vite-project/src/App.jsx", currentExports, nextExports);
        if (invalidateMessage)
            import.meta.hot.invalidate(invalidateMessage);
    }
    );
}
);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFwcC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgRmlsZVVwbG9hZCAgZnJvbSBcIi4vdXBsb2FkXCI7XG5pbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XG5cblxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFRlbGVncmFtVUkoKSB7XG4gIGNvbnN0IFtkYXJrTW9kZSwgc2V0RGFya01vZGVdID0gdXNlU3RhdGUoZmFsc2UpO1xuIFxuICBjb25zdCBbY2hhdHMsIHNldENoYXRzXSA9IHVzZVN0YXRlKFtcbiAgICB7IFxuICAgICAgaWQ6IDIsIFxuICAgICAgbmFtZTogXCIjTWVtaGFzaFwiLCBcbiAgICAgIGxhc3RNZXNzYWdlOiBcIkdJRiDwn5a877iPXCIsIFxuICAgICAgdW5yZWFkOiAyLCBcbiAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgIHsgaWQ6IDEsIHRleHQ6IFwiVGhpcyBpcyBNZW1oYXNoIGNoYXRcIiwgc2VuZGVyOiBcInRoZW1cIiwgcmVhZDogdHJ1ZSB9LFxuICAgICAgICB7IGlkOiAyLCB0ZXh0OiBcIlRoaXMgaXMgTWVtaGFzaCBjaGF0XCIsIHNlbmRlcjogXCJ0aGVtXCIsIHJlYWQ6IHRydWUgfVxuICAgICAgXSBcbiAgICB9LFxuXG4gIF0pO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL2xvY2FsaG9zdDo4MDAwL3dzXCIpO1xuICAgIHNldFdzKHNvY2tldCk7XG5cbiAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgIFxudHJ5e1xuXG5jb25zb2xlLmxvZyhTZWxlY3RlZENoYXQpXG4gICAgICBzZXRTZWxlY3RlZENoYXQoKHByZXZDaGF0KSA9PiB7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB1cGRhdGVkQ2hhdCA9IHtcbiAgICAgICAgICAuLi5wcmV2Q2hhdCxcbiAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgLi4ucHJldkNoYXQubWVzc2FnZXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlkOiBwcmV2Q2hhdC5tZXNzYWdlcy5sZW5ndGggKyAxLFxuICAgICAgICAgICAgICBDb250YWN0VGVsZUlkOmRhdGFbXCJzZXNzaW9uX25hbWVcIl0sXG4gICAgICAgICAgICAgIFNlbmRlcklkOiBkYXRhW1wic2VuZGVyXCJdLFxuICAgICAgICAgICAgICBSZWNlaXZlcklkOiBkYXRhW1wiY2hhdF9pZFwiXSwgLy8gRMO5bmcgcHJldkNoYXQgxJHhu4MgxJHhuqNtIGLhuqNvIMSRw7puZyBk4buvIGxp4buHdVxuICAgICAgICAgICAgICBNZXNzYWdlOiBkYXRhW1wibWVzc2FnZVwiXSxcbiAgICAgICAgICAgICAgU3RhdHVzOiAwLFxuICAgICAgICAgICAgICByZWFkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgICBcbiAgICAgICAgXG4gICAgICAgIHNldENoYXRzQWxsKChwcmV2Q2hhdHMpID0+IHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHByZXZDaGF0c1tkYXRhW1wic2Vzc2lvbl9uYW1lXCJdXT8uZmluZEluZGV4KFxuICAgICAgICAgICAgKGl0ZW0pID0+IGl0ZW0uaWR1c2VyID09IGRhdGFbXCJjaGF0X2lkXCJdXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGNvbnNvbGUubG9nKHByZXZDaGF0cyxcImFhYVwiLGRhdGFbXCJjaGF0X2lkXCJdKVxuICAgICAgICAgY29uc29sZS5sb2coXCJpbmRleFwiLGluZGV4KVxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICBwcmV2Q2hhdHNbZGF0YVtcInNlc3Npb25fbmFtZVwiXV1baW5kZXhdID0gdXBkYXRlZENoYXQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7IC4uLnByZXZDaGF0cyB9O1xuICAgICAgICB9KTtcblxuICAgICAgICBcbiAgICBcbiAgICAgICAgcmV0dXJuIHVwZGF0ZWRDaGF0OyAvLyBUcuG6oyB24buBIGB1cGRhdGVkQ2hhdGAgxJHhu4MgY+G6rXAgbmjhuq10IHN0YXRlXG4gICAgICB9KTtcbiAgICB9Y2F0Y2h7XG5cbiAgICB9IFxuXG4gICAgfTtcblxuICAgIHJldHVybiAoKSA9PiBzb2NrZXQuY2xvc2UoKTtcbiAgfSwgW10pO1xuICBjb25zdCBbY2hhdHNBbGwsIHNldENoYXRzQWxsXSA9IHVzZVN0YXRlKHt9KTtcbiAgY29uc3QgW3NlbGVjdGVkQ2hhdGlkLCBzZXRTZWxlY3RlZENoYXRpZF0gPSB1c2VTdGF0ZSgwKTtcbiAgY29uc3QgW3NlbGVjdGVkQ2hhdCwgc2V0U2VsZWN0ZWRDaGF0XSA9IHVzZVN0YXRlKHt9KTtcbiAgY29uc3QgW2lucHV0LCBzZXRJbnB1dF0gPSB1c2VTdGF0ZShcIlwiKTtcbiAgY29uc3QgbWVzc2FnZXNFbmRSZWYgPSB1c2VSZWYobnVsbCk7XG4gIGNvbnN0IFtpc09wZW4sIHNldElzT3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc09wZW5Mb2dpbiwgc2V0SXNMb2dpbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtuZXdBY2NvdW50LCBzZXROZXdBY2NvdW50XSA9IHVzZVN0YXRlKHtcbiAgICBuYW1lOiBcIlwiLFxuICAgIGVtYWlsOiBcIlwiLFxuICAgIHBob25lOiBcIlwiLFxuICAgIHBhc3N3b3JkOiBcIlwiLFxuICAgIHVybHRkYXRhOlwiXCIsXG4gICAgSWRhY2NvdW50OlwiXCIsXG4gICAgc3RhdHVzOiBcIm9ubGluZVwiLFxuICAgIHR5cGVsb2dpbjpcInBhc3N3b3JkXCJcbiAgfSk7XG5cbiAgY29uc3QgW2FjY291bnRzLCBzZXRBY2NvdW50c10gPSB1c2VTdGF0ZShbXG4gICBcbiAgXSk7XG4gIGNvbnN0IFtTZWFyY2hWYWx1ZSwgc2V0U2VhcmNoVmFsdWVdID0gdXNlU3RhdGUoW1xuICAgXG4gIF0pO1xuICBjb25zdCBbQ29udGFjdEFkZCwgc2V0Q29udGFjdEFkZF0gPSB1c2VTdGF0ZSh7XG4gICAgbmFtZTogXCJcIixcbiAgICBwaG9uZTpcIlwiLFxuICAgIGlkdXNlcjpcIlwiXG4gIH1cbiAgIFxuICApO1xuICBcbiAgXG4gIGNvbnN0IFtzZWxlY3RlZGFjY291bnQsIHNldFNlbGVjdGVkQWNjb3VudF0gPSB1c2VTdGF0ZSh7XG4gICAgbmFtZTogXCJcIixcbiAgICBlbWFpbDogXCJcIixcbiAgICBwaG9uZTogXCJcIixcbiAgICBwYXNzd29yZDogXCJcIixcbiAgICB1cmx0ZGF0YTpcIlwiLFxuICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICB0eXBlbG9naW46XCJ0ZGF0YVwiXG4gIH0pO1xuXG4gXG5cblxuXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBheGlvcy5nZXQoXCJodHRwOi8vMTI3LjAuMC4xOjUwMDEvYXBpL2FjY291bnRzXCIpXG4gICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgXG4gICAgICAgIHNldEFjY291bnRzKHJlc3BvbnNlLmRhdGEpOyBcbiAgICAgICBcbiAgICAgICAgLy8gQ+G6rXAgbmjhuq10IHN0YXRlIHbhu5tpIGThu68gbGnhu4d1IHThu6sgQVBJXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiTOG7l2kga2hpIGzhuqV5IGThu68gbGnhu4d1OlwiLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYWFhYWFhYWFhYWFhYVwiKVxuICAgICAgYXhpb3MuZ2V0KFwiaHR0cDovLzEyNy4wLjAuMTo1MDAxL2FwaS9nZXRsaXN0Y2hhdFwiKVxuICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXNwb25zZS5kYXRhKS5sZW5ndGggIT09IDApe1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2VcIixyZXNwb25zZS5kYXRhKVxuICAgICAgICAgIHNldENoYXRzQWxsKHJlc3BvbnNlLmRhdGEpOyBcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICBcbiAgICAgICAgLy8gQ+G6rXAgbmjhuq10IHN0YXRlIHbhu5tpIGThu68gbGnhu4d1IHThu6sgQVBJXG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiTOG7l2kga2hpIGzhuqV5IGThu68gbGnhu4d1OlwiLCBlcnJvcik7XG4gICAgICB9KTtcblxuXG5cbiAgfSwgW10pO1xuXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcblxuICAgIGlmKGFjY291bnRzLmxlbmd0aD4wKXtcbiAgICAgXG4gICAgIFxuXG4gICAgaWYoc2VsZWN0ZWRhY2NvdW50LnBob25lPT11bmRlZmluZWQgfHwgc2VsZWN0ZWRhY2NvdW50LnBob25lPT1cIlwiKXtcbiAgICAgXG4gICAgICBzZXRTZWxlY3RlZEFjY291bnQoYWNjb3VudHNbMF0pXG4gICAgXG4gICAgICBzZXRDaGF0cyhjaGF0c0FsbFthY2NvdW50c1swXS5waG9uZV0pXG4gICAgfWVsc2V7XG4gICAgIFxuICAgICAgc2V0U2VsZWN0ZWRBY2NvdW50KHNlbGVjdGVkYWNjb3VudClcbiAgICAgIHNldENoYXRzKGNoYXRzQWxsW3NlbGVjdGVkYWNjb3VudC5waG9uZV0pXG4gICAgfVxuICAgIH1cbiAgIFxuICB9LCBbYWNjb3VudHMsY2hhdHNBbGxdKTsgLy8gQ2jhuqF5IGtoaSBhY2NvdW50cyB0aGF5IMSR4buVaVxuXG4gIGNvbnN0IGhhbmRsZUNoYW5nZSA9IChlKSA9PiB7XG4gICAgY29uc3QgeyBuYW1lLCB2YWx1ZSwgdHlwZSwgY2hlY2tlZCB9ID0gZS50YXJnZXQ7XG4gICAgY29uc29sZS5sb2codmFsdWUpXG4gICAgaWYgKHR5cGUgPT09IFwicmFkaW9cIil7XG4gIFxuICAgICAgaWYodmFsdWU9PVwicGFzc3dvcmRcIil7XG4gICAgICAgIHNldElzTG9naW4oZmFsc2UpO1xuICAgICAgICBzZXRCdXR0b25UZXh0KFwiTOG6pXkgbcOjIMSRxINuZyBuaOG6rXBcIilcbiAgICAgIH1cbiAgICAgIGlmKHZhbHVlPT1cInRkYXRhXCIpe1xuICAgICAgICBzZXRJc0xvZ2luKHRydWUpO1xuICAgICAgICBzZXRCdXR0b25UZXh0KFwiVGjDqm0gdMOgaSBraG/huqNuXCIpXG4gICAgICAgIFxuICAgICAgfVxuXG4gICAgIFxuICAgIH1cbiAgICBpZihuYW1lPT1cIlNlYXJjaFwiKXtcbiAgICAgIFxuICAgICAgc2V0U2VhcmNoVmFsdWUodmFsdWUpXG4gICAgfVxuICAgIGlmKG5hbWU9PVwiTmFtZWNvbnRhY3RcIil7XG4gICAgICBDb250YWN0QWRkLm5hbWU9ZS50YXJnZXQudmFsdWUgXG4gICAgfVxuICAgIGlmKG5hbWU9PVwiUGhvbmVjb250YWN0XCIpe1xuICAgICAgQ29udGFjdEFkZC5waG9uZT1lLnRhcmdldC52YWx1ZSBcbiAgICB9XG4gICAgY29uc29sZS5sb2cobmFtZSlcbiAgICBzZXROZXdBY2NvdW50KHsgLi4ubmV3QWNjb3VudCwgW2UudGFyZ2V0Lm5hbWVdOiBlLnRhcmdldC52YWx1ZSB9KTtcbiAgfTtcblxuICBcblxuXG4gIGNvbnN0IGNsaWNrYWNjb3VudCA9IChlKSA9PiB7XG4gICAgXG4gICBzZXRTZWxlY3RlZEFjY291bnQoZSlcbiAgIHNldElzT3BlbighaXNPcGVuKVxuICBcbiAgaWYoY2hhdHNBbGxbZS5waG9uZV0hPXVuZGVmaW5lZCl7XG4gIFxuICAgIHNldENoYXRzKGNoYXRzQWxsW2UucGhvbmVdKVxuICAgIHNldFNlbGVjdGVkQ2hhdChjaGF0c0FsbFtlLnBob25lXVswXSlcbiAgfWVsc2V7XG5cbiAgICBzZXRDaGF0cyhbXSlcbiAgICBzZXRTZWxlY3RlZENoYXQoIHsgXG4gICAgICBpZDogMiwgXG5cbiAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICBcbiAgICAgIF0gXG4gICAgfSlcbiAgfVxuICBcbiAgIFxuICAvLyBzZXRTZWxlY3RlZENoYXQoY2hhdHMpXG4gIH07XG5cbiAgY29uc3QgY2xpY2tjaGF0ID0gKGUpID0+IHtcbiAgICAvLyBzZXRDaGF0cyhjaGF0c0FsbFthY2NvdW50c1swXS5waG9uZV0pXG5cbiAgICBcbiAgIHNldFNlbGVjdGVkQ2hhdChlKVxuICBcbiAgIH07XG5cbiAgY29uc3QgZ2V0YXBpY2hhdCA9IChlKSA9PiB7XG4gICAgXG4gIFxuICAgfTtcbiAgIGNvbnN0IHZhbGlkYXRlUGhvbmUgPSAoaW5wdXQpID0+IHtcbiAgICBjb25zdCBwaG9uZVJlZ2V4ID0gL15cXCs/WzAtOV17MTAsMTV9JC87IC8vIENobyBwaMOpcCBk4bqldSArIOG7nyDEkeG6p3UsIHRoZW8gc2F1IGzDoCAxMC0xNSBz4buRXG4gICAgcmV0dXJuIHBob25lUmVnZXgudGVzdChpbnB1dCk7XG4gIH07XG4gIGNvbnN0IGFkZE5ld0NoYXQgPSAocGhvbmVOdW1iZXIsIG5ld0NoYXQpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIm5ld0NoYXRcIixuZXdDaGF0KVxuICAgIHNldENoYXRzQWxsKChwcmV2Q2hhdHMpID0+ICh7XG4gICAgICAuLi5wcmV2Q2hhdHMsXG4gICAgICBbcGhvbmVOdW1iZXJdOiBwcmV2Q2hhdHNbcGhvbmVOdW1iZXJdIFxuICAgICAgICA/IFsuLi5wcmV2Q2hhdHNbcGhvbmVOdW1iZXJdLCBuZXdDaGF0XSAgLy8gTuG6v3UgxJHDoyBjw7MgY2hhdCwgdGjDqm0gdsOgbyBt4bqjbmdcbiAgICAgICAgOiBbbmV3Q2hhdF0sIC8vIE7hur91IGNoxrBhIGPDsywgdOG6oW8gbeG6o25nIG3hu5tpXG4gICAgfSkpO1xuICB9O1xuXG4gICBjb25zdCAgYWRkQ29udGFjdCA9IGFzeW5jIChlKSA9PiB7XG4gICAgc2V0SXNBZGRpbmdDb250YWN0KCFpc0FkZGluZ0NvbnRhY3QpXG4gICAgaWYoaXNBZGRpbmdDb250YWN0PT10cnVlKXtcbiAgICAgICBpZih2YWxpZGF0ZVBob25lKENvbnRhY3RBZGQucGhvbmUpKXtcbiAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICBjb25zb2xlLmxvZyhzZWxlY3RlZGFjY291bnQucGhvbmUpXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJ0YXJnZXRfcGhvbmVcIiwgQ29udGFjdEFkZC5waG9uZSk7XG4gICAgICBmb3JtRGF0YS5hcHBlbmQoXCJjb250YWN0TmFtZVwiLCBDb250YWN0QWRkLm5hbWUpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKFwic2Vzc2lvbl9uYW1lXCIsc2VsZWN0ZWRhY2NvdW50LnBob25lKTtcblxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2FkZGNvbnRhY3QvXCIsIGZvcm1EYXRhLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgfSxcblxuICAgICAgICB9XG4gICAgICApO1xuICAgICBcbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgLy8gIHNldENvbnRhY3RBZGQoe25hbWU6XCJcIixwaG9uZTpcIlwifSlcbiAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2VcIixyZXNwb25zZS5kYXRhKVxuICAgICAgdmFyIGlkdXNlcj1yZXNwb25zZS5kYXRhLmlkdXNlclxuICAgICBcblxuICAgICAgICBhZGROZXdDaGF0KHNlbGVjdGVkYWNjb3VudC5waG9uZSx7IFxuICAgICAgICAgIGlkOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxLCBcbiAgICAgICAgICBcbiAgICAgICAgICBuYW1lOiBDb250YWN0QWRkLm5hbWUsIFxuICAgICAgICAgIHBob25lY29udGFjdDogQ29udGFjdEFkZC5waG9uZSxcbiAgICAgICAgICBpZHVzZXI6IGlkdXNlcixcbiAgICAgICAgICBsYXN0TWVzc2FnZTogXCJcIiwgXG4gICAgICAgICAgdW5yZWFkOiAwLCBcbiAgICAgICAgICBtZXNzYWdlczogW1xuICAgICAgICAgICAgXG4gICAgICAgICAgXSBcbiAgICAgICAgfSlcbiAgICAgIFxuICAgICAgICBhbGVydChcIlRow6ptIHRow6BuaCBjw7RuZ1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgXG4gICAgICB9XG4gICAgfWVsc2V7XG4gICAgIC8vIHNldENvbnRhY3RBZGQoe25hbWU6XCJcIixwaG9uZTpcIlwifSlcbiAgICAgIGFsZXJ0KFwiU2FpIMSR4buLbmggZOG6oW5nXCIpO1xuICAgIH1cblxuICAgIH1cblxuICAgXG5cbiAgXG4gICB9O1xuXG5cbiAgIGNvbnN0IFtpc0FkZGluZ0NvbnRhY3QsIHNldElzQWRkaW5nQ29udGFjdF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgW2lzQWRkaW5nLCBzZXRJc0FkZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtuZXdBY2NvdW50TmFtZSwgc2V0TmV3QWNjb3VudE5hbWVdID0gdXNlU3RhdGUoXCJcIik7XG4gIGNvbnN0IFtob3ZlcmVkQ2hhdCwgc2V0SG92ZXJlZENoYXRdID0gdXNlU3RhdGUobnVsbCk7XG5jb25zdCBbaG92ZXJlZEFjY291bnQsIHNldEhvdmVyZWRjY291bnRdID0gdXNlU3RhdGUobnVsbCk7XG5jb25zdCBbQWNjb3VudGN1cnJlbnQsIHNldEFjY291bnRdID0gdXNlU3RhdGUobnVsbCk7XG5jb25zdCBbd3MsIHNldFdzXSA9IHVzZVN0YXRlKG51bGwpO1xuXG5jb25zdCBbYnV0dG9uVGV4dCwgc2V0QnV0dG9uVGV4dF0gPSB1c2VTdGF0ZShcIkzhuqV5IG3DoyDEkcSDbmcgbmjhuq1wXCIpO1xuICBjb25zdCBoYW5kbGVBZGRBY2NvdW50ID0gYXN5bmMgKCkgPT4ge1xuXG4gICAgaWYgKG5ld0FjY291bnQucGhvbmUudHJpbSgpICE9PSBcIlwiKSB7XG4gXG4gICAgICBpZihidXR0b25UZXh0PT1cIkzhuqV5IG3DoyDEkcSDbmcgbmjhuq1wXCIpe1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwaG9uZV9udW1iZXJcIiwgbmV3QWNjb3VudC5waG9uZSk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInNlc3Npb25fbmFtZVwiLCBuZXdBY2NvdW50LnBob25lKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xvZ2luL3JlcXVlc3Rfb3RwL1wiLCBmb3JtRGF0YSwge1xuICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgfSxcblxuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBzZXRCdXR0b25UZXh0KFwiTmjhuq1wIG3DoyBjb2RlIHbhu4Egc+G7kSDEkWnhu4duIHRob+G6oWlcIilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgIFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKGJ1dHRvblRleHQ9PVwiTmjhuq1wIG3DoyBjb2RlIHbhu4Egc+G7kSDEkWnhu4duIHRob+G6oWlcIil7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInBob25lX251bWJlclwiLCBuZXdBY2NvdW50LnBob25lKTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiY29kZVwiLCBuZXdBY2NvdW50LnBhc3N3b3JkKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xvZ2luL3ZlcmlmeV9vdHAvLlwiLCBmb3JtRGF0YSwge1xuICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgfSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2UuZGF0YS5tZVwiLHJlc3BvbnNlLmRhdGEubWUpXG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgc2V0TmV3QWNjb3VudCh7IC4uLm5ld0FjY291bnQsIElkYWNjb3VudDogcmVzcG9uc2UuZGF0YS5tZSB9KTtcbiAgICAgICAgICBzZXROZXdBY2NvdW50KHsgLi4ubmV3QWNjb3VudCwgc2Vzc2lvblBhdGg6IHJlc3BvbnNlLmRhdGEucGF0aCB9KTtcbiAgICAgICAgICBzZXRCdXR0b25UZXh0KFwixJDEg25nIG5o4bqtcCB0aMOgbmggY8O0bmcgdGjDqm0gdMOgaSBraG/huqNuIHbDoG8gaOG7hyB0aOG7kW5nXCIpXG5cblxuXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gc2V0QWNjb3VudHMoWy4uLmFjY291bnRzLCB7IHBob25lOiBuZXdBY2NvdW50LnBob25lLCBzdGF0dXM6IDAgfV0pO1xuICAgICAgICAgIC8vIHNldE5ld0FjY291bnROYW1lKFwiXCIpO1xuICAgICAgICAgIC8vIHNldElzQWRkaW5nKGZhbHNlKTtcbiAgICAgICAgfSBcbiAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwNSkge1xuXG5cbiAgICAgICAgICBzZXRCdXR0b25UZXh0KFwiTmjhuq1wIG1rIGPhuqVwIDJcIilcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoYnV0dG9uVGV4dD09XCJOaOG6rXAgbWsgY+G6pXAgMlwiKXtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwicGhvbmVfbnVtYmVyXCIsIG5ld0FjY291bnQucGhvbmUpO1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJwYXNzd29yZFwiLCBuZXdBY2NvdW50LnBhc3N3b3JkKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2xvZ2luL3ZlcmlmeV9wYXNzd29yZC9cIiwgZm9ybURhdGEsIHtcbiAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIH0sXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlLmRhdGEubWVcIixyZXNwb25zZS5kYXRhLm1lKVxuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgIHNldE5ld0FjY291bnQocHJldiA9PiAoe1xuICAgICAgICAgICAgLi4ucHJldixcbiAgICAgICAgICAgIElkYWNjb3VudDogcmVzcG9uc2UuZGF0YS5tZSxcbiAgICAgICAgICAgIHNlc3Npb25QYXRoOiByZXNwb25zZS5kYXRhLnBhdGhcbiAgICAgICAgICB9KSk7XG4gICAgICAgICAgXG4gICAgICAgICAgc2V0QnV0dG9uVGV4dChcIsSQxINuZyBuaOG6rXAgdGjDoG5oIGPDtG5nIHRow6ptIHTDoGkga2hv4bqjbiB2w6BvIGjhu4cgdGjhu5FuZ1wiKVxuICAgICAgICAgIFxuICAgICAgICAgXG4gICAgICAgIH0gXG4gICAgICAgICBcbiAgICAgICBcbiAgICAgIH0gXG5cbiAgICAgIGlmKGJ1dHRvblRleHQ9PVwixJDEg25nIG5o4bqtcCB0aMOgbmggY8O0bmcgdGjDqm0gdMOgaSBraG/huqNuIHbDoG8gaOG7hyB0aOG7kW5nXCIgfHwgYnV0dG9uVGV4dD09XCJUaMOqbSB0w6BpIGtob+G6o25cIil7XG5cbiAgICAgICAgXG5cbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwicGhvbmVfbnVtYmVyXCIsIG5ld0FjY291bnQucGhvbmUpO1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJzZXNzaW9uX25hbWVcIiwgbmV3QWNjb3VudC5waG9uZSk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImNvbnRhY3ROYW1lXCIsIG5ld0FjY291bnQubmFtZSk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcImlkYWNjb3VudFwiLCBuZXdBY2NvdW50LklkYWNjb3VudCk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZChcInNlc3Npb25QYXRoXCIsIG5ld0FjY291bnQudXJsdGRhdGEpO1xuXG4gICAgICAgY29uc29sZS5sb2cobmV3QWNjb3VudC5waG9uZSlcbiAgICAgICBjb25zb2xlLmxvZyhuZXdBY2NvdW50Lm5hbWUpXG4gICAgICAgY29uc29sZS5sb2cobmV3QWNjb3VudC5uYW1lKVxuICAgICAgIGNvbnNvbGUubG9nKG5ld0FjY291bnQuSWRhY2NvdW50KVxuICAgICAgIGNvbnNvbGUubG9nKG5ld0FjY291bnQudXJsdGRhdGEpXG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFwiaHR0cDovL2xvY2FsaG9zdDo4MDAwL2luc2VydGFjY291bnRcIiwgZm9ybURhdGEsIHtcbiAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIH0sXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBzZXRBY2NvdW50cyhbLi4uYWNjb3VudHMsbmV3QWNjb3VudF0pO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIG5ld0FjY291bnQucGhvbmU9XCJcIlxuICAgICAgICBuZXdBY2NvdW50LnBhc3N3b3JkPVwiXCJcbiAgICAgICAgc2V0TmV3QWNjb3VudCh7XG4gICAgICAgICAgbmFtZTogXCJcIixcbiAgICAgICAgICBlbWFpbDogXCJcIixcbiAgICAgICAgICBwaG9uZTogXCJcIixcbiAgICAgICAgICBwYXNzd29yZDogXCJcIixcbiAgICAgICAgICB1cmx0ZGF0YTpcIlwiLFxuICAgICAgICAgIHN0YXR1czogXCJvbmxpbmVcIixcbiAgICAgICAgICB0eXBlbG9naW46XCJ0ZGF0YVwiXG4gICAgICAgIH0pO1xuICAgICAgICBzZXRJc0FkZGluZyhmYWxzZSk7XG4gICAgICAgIHNldEJ1dHRvblRleHQoXCJM4bqleSBtw6MgxJHEg25nIG5o4bqtcFwiKVxuICAgICAgICBhbGVydChcIlRow6ptIFRow6BuaCBjw7RuZ1wiKTtcblxuICAgICAgfVxuXG4gICAgICBcblxuXG4gICAgIFxuICAgICBcbiAgICB9XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcblxuICAgIG1lc3NhZ2VzRW5kUmVmLmN1cnJlbnQ/LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIgfSk7XG4gIH0sIFtzZWxlY3RlZENoYXQubWVzc2FnZXNdKTtcblxuICBjb25zdCBhZGRBY2NvdW50ID0gKCkgPT4ge1xuICAgIGNvbnN0IG5ld0FjY291bnQgPSB7IG5hbWU6IGBVc2VyICR7YWNjb3VudHMubGVuZ3RoICsgMX1gLCBzdGF0dXM6IFwib25saW5lXCIgfTtcbiAgICBzZXRBY2NvdW50cyhbLi4uYWNjb3VudHMsIG5ld0FjY291bnRdKTtcbiAgfTtcblxuICBjb25zdCBzZW5kTWVzc2FnZSA9IGFzeW5jIChjaGF0SWQsIG1lc3NhZ2UsIHNlc3Npb25OYW1lLHNlbmRlcl9pZCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBsZXQgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgIFxuICAgICAgZm9ybURhdGEuYXBwZW5kKFwibWVzc2FnZVwiLCBtZXNzYWdlKTtcbiAgICAgIGZvcm1EYXRhLmFwcGVuZChcImNoYXRfaWRcIixjaGF0SWQpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKFwic2Vzc2lvbl9uYW1lXCIsc2Vzc2lvbk5hbWUpO1xuICAgICAgZm9ybURhdGEuYXBwZW5kKFwic2VuZGVyX2lkXCIsc2VuZGVyX2lkKTtcbiAgICAgIGNvbnNvbGUubG9nKGNoYXRJZCwgbWVzc2FnZSwgc2Vzc2lvbk5hbWUsc2VuZGVyX2lkKVxuICAgICBcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MucG9zdCgnaHR0cDovL2xvY2FsaG9zdDo4MDAwL3NlbmRfbWVzc2FnZV9jaGF0aWQnLGZvcm1EYXRhLCB7XG4gICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgfVxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBhbGVydChcIkzhu5dpIGtoaSBn4butaSB0aW4gbmjhuq9uOlwiLCBlcnJvci5tZXNzYWdlKVxuICAgICAgY29uc29sZS5lcnJvcihcIkzhu5dpIGtoaSBn4butaSB0aW4gbmjhuq9uOlwiLCBlcnJvci5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlU2VuZE1lc3NhZ2UgPSAoZSkgPT4ge1xuIFxuICAgIFxuICAgIGlmIChpbnB1dC50cmltKCkpIHtcbiAgICAgdHJ5e1xuXG4gICAgXG4gICAgICBzZXRTZWxlY3RlZENoYXQoKHByZXZDaGF0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWRDaGF0ID0ge1xuICAgICAgICAgIC4uLnByZXZDaGF0LFxuICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAuLi5wcmV2Q2hhdC5tZXNzYWdlcyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWQ6IHByZXZDaGF0Lm1lc3NhZ2VzLmxlbmd0aCArIDEsXG4gICAgICAgICAgICAgIFNlbmRlcklkOiBzZWxlY3RlZGFjY291bnQuSWRhY2NvdW50LFxuICAgICAgICAgICAgICBSZWNlaXZlcklkOiBwcmV2Q2hhdC5pZHVzZXIsIC8vIETDuW5nIHByZXZDaGF0IMSR4buDIMSR4bqjbSBi4bqjbyDEkcO6bmcgZOG7ryBsaeG7h3VcbiAgICAgICAgICAgICAgTWVzc2FnZTogaW5wdXQsXG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHJlYWQ6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9O1xuICAgIFxuICAgICAgICAvLyBD4bqtcCBuaOG6rXQgYGNoYXRzQWxsYCBuZ2F5IHRyb25nIHNldFN0YXRlIMSR4buDIMSR4bqjbSBi4bqjbyBraMO0bmcgZMO5bmcgZOG7ryBsaeG7h3UgY8WpXG4gICAgICAgIHNldENoYXRzQWxsKChwcmV2Q2hhdHMpID0+IHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHByZXZDaGF0c1tzZWxlY3RlZGFjY291bnQucGhvbmVdPy5maW5kSW5kZXgoXG4gICAgICAgICAgICAoaXRlbSkgPT4gaXRlbS5pZCA9PT0gcHJldkNoYXQuaWRcbiAgICAgICAgICApO1xuICAgIFxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICBwcmV2Q2hhdHNbc2VsZWN0ZWRhY2NvdW50LnBob25lXVtpbmRleF0gPSB1cGRhdGVkQ2hhdDtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgLi4ucHJldkNoYXRzIH07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFxuICAgIFxuICAgICAgICByZXR1cm4gdXBkYXRlZENoYXQ7IC8vIFRy4bqjIHbhu4EgYHVwZGF0ZWRDaGF0YCDEkeG7gyBj4bqtcCBuaOG6rXQgc3RhdGVcbiAgICAgIH0pO1xuICAgIH1jYXRjaHtcblxuICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiYWExMjNcIixjaGF0c0FsbClcblxuICAgIC8vICAgc2V0U2VsZWN0ZWRDaGF0KChwcmV2Q2hhdCkgPT4gKHtcbiAgICAvLyAgICAgLi4ucHJldkNoYXQsXG4gICAgLy8gICAgIG1lc3NhZ2VzOiBbLi4ucHJldkNoYXQubWVzc2FnZXMsIHsgaWQ6IHByZXZDaGF0Lm1lc3NhZ2VzLmxlbmd0aCArIDEsU2VuZGVySWQ6c2VsZWN0ZWRhY2NvdW50LmlkLFJlY2VpdmVySWQ6c2VsZWN0ZWRDaGF0LmlkdXNlciwgdGV4dDogaW5wdXQsIHNlbmRlcjogXCJtZVwiLCByZWFkOiBmYWxzZSB9XSxcbiAgICAvLyAgIH1cbiAgICBcbiAgICBcbiAgICBcbiAgICAvLyApKTtcblxuXG5cbiAgICAgIC8vIGNvbnN0IGluZGV4ID0gY2hhdHNBbGxbc2VsZWN0ZWRhY2NvdW50LnBob25lXS5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBzZWxlY3RlZENoYXQuaWQpO1xuXG5cbiAgICAgIC8vICAgICBpZihpbmRleD49MCl7XG4gICAgICAgICAgXG4gICAgICAvLyAgIGNoYXRzQWxsW3NlbGVjdGVkYWNjb3VudC5waG9uZV1baW5kZXhdPXNlbGVjdGVkQ2hhdFxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgZWxzZXtcbiAgICAgICAgXG4gICAgICAvLyAgIH1cbiAgICAgIC8vICAgY29uc29sZS5sb2coY2hhdHNBbGwpXG5cbiAgIC8vIHNldENoYXRzKGNoYXRzQWxsW3NlbGVjdGVkYWNjb3VudC5waG9uZV0pXG5cblxuICAgIGNvbnNvbGUubG9nKFwiYWFcIixzZWxlY3RlZGFjY291bnQsc2VsZWN0ZWRDaGF0KVxuXG4gICAgICAgc2VuZE1lc3NhZ2Uoc2VsZWN0ZWRDaGF0LmlkdXNlciwgaW5wdXQsIHNlbGVjdGVkYWNjb3VudC5waG9uZSxzZWxlY3RlZGFjY291bnQuSWRhY2NvdW50KTtcbiAgICAgIFxuICAgICAgc2V0SW5wdXQoXCJcIik7XG4gICAgfVxuICBcbiAgICBcbiAgXG4gIFxuICB9O1xuICAgIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKHtcbiAgICBtZXNzYWdlOiBcIlwiLFxuICAgIHVzZXJuYW1lOiBcIlwiLFxuICAgIHBob25lOiBcIlwiLFxuICAgIHBhdGhmaWxlOiBcIlwiLFxuICB9KTtcbiAgY29uc3QgaGFuZGxlRmlsZVNlbGVjdCA9IChtZXNzYWdlLCB1c2VybmFtZSwgcGhvbmUsIHBhdGhmaWxlLGlkdXNlcikgPT4ge1xuICAgIFxuICAgIHNldE5ld0FjY291bnQoe1xuICAgICAgLi4ubmV3QWNjb3VudCxcbiAgICAgIG5hbWU6IHVzZXJuYW1lLFxuICAgICAgcGhvbmU6IHBob25lLFxuICAgICAgdXJsdGRhdGE6IHBhdGhmaWxlLFxuICAgICAgSWRhY2NvdW50OmlkdXNlclxuICAgIH0pO1xuICAgIFxuICB9O1xuICByZXR1cm4gKFxuICAgIFxuICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsd2lkdGg6IFwiMTAwdndcIiwgaGVpZ2h0OiBcIjEwMHZoXCIsIGJhY2tncm91bmRDb2xvcjogZGFya01vZGUgPyBcIiMxYTFhMWFcIiA6IFwiI2YwZjBmMFwiLCBjb2xvcjogZGFya01vZGUgPyBcIndoaXRlXCIgOiBcImJsYWNrXCIgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBcIjE1JVwiLCBiYWNrZ3JvdW5kQ29sb3I6IFwiIzMzM1wiLCBwYWRkaW5nOiBcIjEwcHhcIiwgY29sb3I6IFwid2hpdGVcIiwgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsICBtYXhIZWlnaHQ6IFwiMTAwdmhcIiB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIG1hcmdpbkJvdHRvbTogXCIxMHB4XCIgfX0+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRJc09wZW4oIWlzT3Blbil9IHN0eWxlPXt7IGNvbG9yOiBcIndoaXRlXCIsIGJhY2tncm91bmQ6IFwibm9uZVwiLCBib3JkZXI6IFwibm9uZVwiIH19PuKYsDwvYnV0dG9uPlxuICAgICAgICAgICB7LyogRGFuaCBzw6FjaCB0w6BpIGtob+G6o24gKi99XG4gICAgey8qIE92ZXJsYXkgKELDs25nIG3hu50pICovfVxuICAgIHtcblxufVxuICAgIHtpc09wZW4gJiYgaXNBZGRpbmc9PWZhbHNlICYmIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzT3BlbihmYWxzZSl9IC8vIELhuqVtIHbDoG8gb3ZlcmxheSDEkeG7gyDEkcOzbmcgbWVudVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMHZ3XCIsXG4gICAgICAgICAgICBoZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwicmdiYSgwLCAwLCAwLCAwLjUpXCIsIC8vIE3DoHUgxJFlbiwgb3BhY2l0eSA1MCVcbiAgICAgICAgICAgIHpJbmRleDogNSwgLy8gxJDhuqNtIGLhuqNvIG7hurFtIHBow61hIHNhdSBtZW51XG4gICAgICAgICAgfX1cblxuICAgICAgICAgIFxuICAgICAgICAvPlxuXG4gICAgICAgIFxuICAgICAgKX1cbiAgICAgICAgIHtpc09wZW4gJiYgaXNBZGRpbmcgJiYgIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgLy8gQuG6pW0gdsOgbyBvdmVybGF5IMSR4buDIMSRw7NuZyBtZW51XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgd2lkdGg6IFwiMTAwdndcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJyZ2JhKDAsIDAsIDAsIDAuNSlcIiwgLy8gTcOgdSDEkWVuLCBvcGFjaXR5IDUwJVxuICAgICAgICAgICAgekluZGV4OiA1LCAvLyDEkOG6o20gYuG6o28gbuG6sW0gcGjDrWEgc2F1IG1lbnVcbiAgICAgICAgICB9fVxuXG4gICAgICAgICAgXG4gICAgICAgID5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBtYXJnaW5Ub3A6IFwiMTAlXCIsXG4gICAgICAgICAgXG4gICAgICAgICAgcGFkZGluZzogXCIxNXB4XCIsXG4gICAgICAgICAgYmFja2dyb3VuZDogXCJyZ2JhKDIxLCA2NywgMTY3LCAwLjUpXCIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjhweFwiLFxuICAgICAgICAgIGJveFNoYWRvdzogXCIwcHggNHB4IDEwcHggcmdiYSgwLCAwLCAwLCAwLjIpXCIsXG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsXG4gICAgICAgICAgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgICAgICBnYXA6IFwiMTBweFwiLFxuICAgICAgICAgIHdpZHRoOiBcIjU1MHB4XCIsXG4gICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICB0b3A6IFwiMjAlXCIsXG4gICAgICAgICAgaGVpZ2h0OiBcIjUwJVwiLFxuICAgICAgICAgIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgICAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZSgtNTAlLCAtNTAlKVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICBcbiAgICAgICAgICA8aDMgc3R5bGU9e3sgY29sb3I6IFwicmVkXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9fT5UaMOqbSB0w6BpIGtob+G6o248L2gzPlxuXG5cbiAgICAgICAgICB7LyogQ8OhYyDDtCBuaOG6rXAgdGjDtG5nIHRpbiAqL31cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwibmFtZVwiIHZhbHVlPXtuZXdBY2NvdW50Lm5hbWV9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHBsYWNlaG9sZGVyPVwiVMOqbiB0w6BpIGtob+G6o24uLi5cIiBzdHlsZT17aW5wdXRTdHlsZX0gLz5cblxuICAgICAgICBcblxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHlwZWxvZ2luXCIgdmFsdWU9XCJ0ZGF0YVwiIGNoZWNrZWQ9e25ld0FjY291bnQudHlwZWxvZ2luID09IFwidGRhdGFcIn0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gLz5cbiAgICAgICAgICAgICAgVGRhdGFcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwidHlwZWxvZ2luXCIgdmFsdWU9XCJwYXNzd29yZFwiIGNoZWNrZWQ9e25ld0FjY291bnQudHlwZWxvZ2luID09IFwicGFzc3dvcmRcIn0gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gLz5cbiAgICAgICAgICAgICAgQ29kZVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgXG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8aW5wdXQgdHlwZT1cInRlbFwiIG5hbWU9XCJwaG9uZVwiIHZhbHVlPXtuZXdBY2NvdW50LnBob25lfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBwbGFjZWhvbGRlcj1cIlPhu5EgxJFp4buHbiB0aG/huqFpLi4uXCIgc3R5bGU9e2lucHV0U3R5bGV9IC8+XG4gICAgICAgICAgXG4gICAgICAgICAge2lzT3BlbkxvZ2luPT10cnVlID8gKFxuICAgICAgICA8ZGl2PlxuICAgICAgPGlucHV0IHR5cGU9XCJ1cmx0ZGF0YVwiIG5hbWU9XCJ1cmx0ZGF0YVwiIHZhbHVlPXtuZXdBY2NvdW50LnVybHRkYXRhfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBwbGFjZWhvbGRlcj1cIlRkYXRhLi4uXCIgc3R5bGU9e2lucHV0U3R5bGV9IC8+XG4gICAgICAgICAgICAgICAgPEZpbGVVcGxvYWQgb25GaWxlU2VsZWN0PXtoYW5kbGVGaWxlU2VsZWN0fT48L0ZpbGVVcGxvYWQ+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICApIDogKFxuICAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIG5hbWU9XCJwYXNzd29yZFwiIHZhbHVlPXtuZXdBY2NvdW50LnBhc3N3b3JkfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBwbGFjZWhvbGRlcj1cIk3DoyBDb2RlLi4uXCIgc3R5bGU9e2lucHV0U3R5bGV9IC8+XG4gICAgICApfVxuXG5cblxuICAgICAgXG4gICAgICAgICAgey8qIENo4buNbiB0cuG6oW5nIHRow6FpICovfVxuICAgICAgICAgIDxzZWxlY3QgbmFtZT1cInN0YXR1c1wiIHZhbHVlPXtuZXdBY2NvdW50LnN0YXR1c30gb25DaGFuZ2U9e2hhbmRsZUNoYW5nZX0gc3R5bGU9e2lucHV0U3R5bGV9PlxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIm9ubGluZVwiPvCfn6IgT25saW5lPC9vcHRpb24+XG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwib2ZmbGluZVwiPuKaqiBPZmZsaW5lPC9vcHRpb24+XG4gICAgICAgICAgPC9zZWxlY3Q+XG5cbiAgICAgICAgICB7LyogTsO6dCB4w6FjIG5o4bqtbiAmIGjhu6d5ICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlQWRkQWNjb3VudH0gc3R5bGU9e2J1dHRvblN0eWxlKFwiZ3JlZW5cIil9PntidXR0b25UZXh0fTwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRJc0FkZGluZyhmYWxzZSl9IHN0eWxlPXtidXR0b25TdHlsZShcInJlZFwiKX0+4p2MIEjhu6d5PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICBcbiAgICAgICl9XG5cbiAgICAgIHsvKiBEYW5oIHPDoWNoIHTDoGkga2hv4bqjbiAqL31cbiAgICAgIHtpc09wZW4gJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICB0b3A6IFwiMHB4XCIsXG4gICAgICAgICAgICB3aWR0aDogXCIxNSVcIixcbiAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXG4gICAgICAgICAgICBsZWZ0OiBcIjBcIixcbiAgICAgICAgICBcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiIzMzM1wiLFxuICAgICAgICAgICAgY29sb3I6IFwid2hpdGVcIixcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweFwiLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjVweFwiLFxuICAgICAgICAgICAgYm94U2hhZG93OiBcIjJweCAycHggMTBweCByZ2JhKDAsMCwwLDAuMilcIixcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZUluIDAuM3MgZWFzZS1pbi1vdXRcIixcbiAgICAgICAgICAgIHpJbmRleDogMTAsIC8vIMSQ4bqjbSBi4bqjbyBu4bqxbSB0csOqbiBvdmVybGF5XG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuXG4gICAgICA8aDI+TGlzdCBEYW5oIFPDoWNoPC9oMj5cbiAgICAgIHtcblxufVxuICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNldElzQWRkaW5nKHRydWUpfVxuICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcImJsdWVcIiwgY29sb3I6IFwid2hpdGVcIiwgYm9yZGVyOiBcIm5vbmVcIiwgcGFkZGluZzogXCI1cHggMTBweFwiLCBib3JkZXJSYWRpdXM6IFwiNXB4XCIgfX1cbiAgICAgID5cbiAgICAgICAg4p6VIEFkZCB0w6BpIGtob+G6o25cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjgwJVwifX0+IFxuXG4gICAgICAgICAge1xuICAgICAgICAgIFxuICAgICAgICAgIGFjY291bnRzLm1hcCgoYWNjb3VudCwgaW5kZXgpID0+IChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gY2xpY2thY2NvdW50KGFjY291bnQpfSBcbiAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiAgc2V0SG92ZXJlZGNjb3VudChhY2NvdW50LnBob25lKX1cbiAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiAgc2V0SG92ZXJlZGNjb3VudChudWxsKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiOHB4IDVweFwiLFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjIpXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMThweFwiLFxuICAgICAgICAgICAgICBjb2xvcjogaG92ZXJlZEFjY291bnQgPT09IGFjY291bnQucGhvbmUgPyBcInJlZFwiIDogXCJ3aGl0ZVwiLCBcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzZWxlY3RlZGFjY291bnQucGhvbmUgPT09IGFjY291bnQucGhvbmUgPyBcInJnYmEoMjU1LCAyMTcsIDQ4LCAwLjUpXCIgOiBcInJnYmEoMjU1LDI1NSwyNTUsMC4yKVwiXG5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3Bhbj57YWNjb3VudC5waG9uZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwcHhcIixcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMHB4XCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBhY2NvdW50LnN0YXR1cyA9PT0gMCA/IFwiZ3JlZW5cIiA6IFwiZ3JheVwiLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cblxuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgXG4gICAgICAgICAgXG5cbiAgICAgICAgICAgIFxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBIaeG7h3Ug4bupbmcgYW5pbWF0aW9uICovfVxuICAgICAgPHN0eWxlPlxuICAgICAgICB7YFxuICAgICAgICAgIEBrZXlmcmFtZXMgc2xpZGVJbiB7XG4gICAgICAgICAgICBmcm9tIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0yMHB4KTsgb3BhY2l0eTogMDsgfVxuICAgICAgICAgICAgdG8geyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7IG9wYWNpdHk6IDE7IH1cbiAgICAgICAgICB9XG4gICAgICAgIGB9XG4gICAgICA8L3N0eWxlPlxuICAgICAgICAgIDxoMj57c2VsZWN0ZWRhY2NvdW50LnBob25lfTwvaDI+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXREYXJrTW9kZSghZGFya01vZGUpfSBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcIm5vbmVcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY29sb3I6IFwid2hpdGVcIiB9fT5cbiAgICAgICAgICAgIHtkYXJrTW9kZSA/IFwi4piAXCIgOiBcIvCfjJlcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgIFxuXG4gICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCIgdmFsdWUgPSB7U2VhcmNoVmFsdWV9ICAgIG5hbWU9XCJTZWFyY2hcIiBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfSBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIHBhZGRpbmc6IFwiNXB4XCIsIG1hcmdpbkJvdHRvbTogXCIxMHB4XCIsIGJvcmRlclJhZGl1czogXCI1cHhcIiwgYm9yZGVyOiBcIm5vbmVcIiB9fSAvPlxuICAgICAgICB7XG5cbn1cbjxidXR0b25cbiAgICAgICAgb25DbGljaz17KCkgPT4gYWRkQ29udGFjdCgpfVxuICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcImJsdWVcIiwgY29sb3I6IFwid2hpdGVcIiwgYm9yZGVyOiBcIm5vbmVcIiwgcGFkZGluZzogXCI1cHggMTBweFwiLCBib3JkZXJSYWRpdXM6IFwiNXB4XCIgfX1cbiAgICAgID5cbiAgICB7IFwi4p6VIEFkZCBDb250YWN0XCIgfVxuXG5cbiAgICAgIDwvYnV0dG9uPlxue2NvbnNvbGUubG9nKFwiY2hhdHNcIixjaGF0cyl9IFxuXG57aXNBZGRpbmdDb250YWN0ICYmIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiTmFtZWNvbnRhY3RcIiB2YWx1ZSA9IHtDb250YWN0QWRkLm5hbWV9ICAgIG5hbWU9XCJOYW1lY29udGFjdFwiIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgcGFkZGluZzogXCI1cHhcIiwgbWFyZ2luQm90dG9tOiBcIjEwcHhcIiwgYm9yZGVyUmFkaXVzOiBcIjVweFwiLCBib3JkZXI6IFwibm9uZVwiIH19IC8+XG4gICAgfVxuIHtpc0FkZGluZ0NvbnRhY3QgJiYgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiUGhvbmVjb250YWN0XCIgdmFsdWUgPSB7Q29udGFjdEFkZC5waG9uZX0gICAgbmFtZT1cIlBob25lY29udGFjdFwiIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgcGFkZGluZzogXCI1cHhcIiwgbWFyZ2luQm90dG9tOiBcIjEwcHhcIiwgYm9yZGVyUmFkaXVzOiBcIjVweFwiLCBib3JkZXI6IFwibm9uZVwiIH19IC8+XG4gICAgXG4gICBcbiAgIH1cbiAgICBcblxuICAgICAgICA8ZGl2IHN0eWxlPXt7ICBvdmVyZmxvd1k6IFwiYXV0b1wiIH19PlxuICAgICAgICAgICAgIHtjaGF0cyE9dW5kZWZpbmVkICYmIGNoYXRzLm1hcCgoY2hhdCkgPT4gKFxuICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICBrZXk9e2NoYXQuaWR9IFxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gY2xpY2tjaGF0KGNoYXQpfSBcbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gc2V0SG92ZXJlZENoYXQoY2hhdC5pZCl9XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHNldEhvdmVyZWRDaGF0KG51bGwpfVxuXG4gICAgICAgICAgICBzdHlsZT17eyBwYWRkaW5nOiBcIjEwcHhcIiwgZm9udDpcIjE4cHhcIixcImZvbnRXZWlnaHRcIjpcImJvbGRcIixkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBjdXJzb3I6IFwicG9pbnRlclwiLCBiYWNrZ3JvdW5kQ29sb3I6IFwiIzQ0NFwiLFxuICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiBcIjVweFwiLFxuICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjVweFwiICxcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBjb2xvcjogaG92ZXJlZENoYXQgPT09IGNoYXQuaWQgPyBcInJlZFwiIDogXCIjNDQ0XCIsIFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHNlbGVjdGVkQ2hhdC5pZCA9PT0gY2hhdC5pZCA/IFwicmdiYSg0OCwgMjU1LCAxMTcsIDAuNSlcIiA6IFwicmdiYSgyMCwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3Bhbj57Y2hhdC5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgIHtjaGF0LnVucmVhZCA+IDAgJiYgPHNwYW4gc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBcInJlZFwiLCBwYWRkaW5nOiBcIjJweCA2cHhcIiwgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLCBmb250U2l6ZTogXCIxMnB4XCIgfX0+e2NoYXQudW5yZWFkfTwvc3Bhbj59XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuXG5cblxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9kaXY+XG5cbntjb25zb2xlLmxvZyhcInNlbGVjdGVkQ2hhdFwiLHNlbGVjdGVkQ2hhdCl9XG57ICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMTBweFwiLCBiYWNrZ3JvdW5kQ29sb3I6IFwiIzU1NVwiLCBjb2xvcjogXCJ3aGl0ZVwiIH19PlxuICAgICAgICAgIDxoMj57c2VsZWN0ZWRDaGF0Lm5hbWV9PC9oMj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgcGFkZGluZzogXCIxMHB4XCIsIG92ZXJmbG93WTogXCJhdXRvXCIsIGJhY2tncm91bmRDb2xvcjogZGFya01vZGUgPyBcIiMyMjJcIiA6IFwiI2RkZFwiIH19PlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhzZWxlY3RlZENoYXQpLmxlbmd0aCAhPT0gMCAmJiBzZWxlY3RlZENoYXQubWVzc2FnZXMubWFwKChtc2cpID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXttc2cuaWR9IHN0eWxlPXt7IHRleHRBbGlnbjogbXNnLlNlbmRlcklkICE9PSBtc2cuUmVjZWl2ZXJJZCA/IFwicmlnaHRcIiA6IFwibGVmdFwiLCBtYXJnaW5Cb3R0b206IFwiMTBweFwiIH19PlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLCBwYWRkaW5nOiBcIjEwcHhcIiwgYm9yZGVyUmFkaXVzOiBcIjEwcHhcIiwgYmFja2dyb3VuZENvbG9yOiBcIiMwMDdiZmZcIiwgY29sb3I6IFwid2hpdGVcIiB9fT57bXNnLk1lc3NhZ2V9PC9wPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogXCIxMnB4XCIsIG1hcmdpbkxlZnQ6IFwiNXB4XCIsIGNvbG9yOiBtc2cucmVhZCA/IFwiZ3JlZW5cIiA6IFwiZ3JheVwiIH19PlxuICAgICAgICAgICAgICAgIHttc2cucmVhZCA/IFwi4pyT4pyTIFJlYWRcIiA6IFwi4pyTIFNlbnRcIn1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICAgIDxkaXYgcmVmPXttZXNzYWdlc0VuZFJlZn0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIxMHB4XCIsIGJhY2tncm91bmRDb2xvcjogXCIjY2NjXCIsIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiIH19PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgdmFsdWU9e2lucHV0fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRJbnB1dChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSB7XG4gICAgICAgICAgICAgICAgaGFuZGxlU2VuZE1lc3NhZ2UoZSk7IC8vIEfhu41pIGjDoG0geOG7rSBsw70ga2hpIG5o4bqlbiBFbnRlclxuICAgICAgICAgICAgICB9fX1cbiAgICAgICAgICAgIHN0eWxlPXt7IGZsZXg6IDEsIHBhZGRpbmc6IFwiMjBweFwiLCBib3JkZXJSYWRpdXM6IFwiNXB4XCIsIGJvcmRlcjogXCJub25lXCIgfX1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiV3JpdGUgYSBtZXNzYWdlLi4uXCJcbiAgICAgICAgICAvPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVNlbmRNZXNzYWdlfVxuICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luTGVmdDogXCIxMHB4XCIsIGJhY2tncm91bmRDb2xvcjogXCIjMDA3YmZmXCIsIGNvbG9yOiBcIndoaXRlXCIsIGJvcmRlcjogXCJub25lXCIsIHBhZGRpbmc6IFwiMTVweCAzMHB4XCIsIGJvcmRlclJhZGl1czogXCI1cHhcIiB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIOKepFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2Pn1cbiAgICBcbiAgICA8L2Rpdj5cbiAgKTtcbiAgXG59XG5jb25zdCBpbnB1dFN0eWxlID0ge1xuICBwYWRkaW5nOiBcIjhweFwiLFxuICBib3JkZXJSYWRpdXM6IFwiNXB4XCIsXG4gIGJvcmRlcjogXCIxcHggc29saWQgZ3JheVwiLFxufTtcblxuY29uc3QgYnV0dG9uU3R5bGUgPSAoY29sb3IpID0+ICh7XG4gIHBhZGRpbmc6IFwiOHB4IDE1cHhcIixcbiAgYmFja2dyb3VuZDogY29sb3IsXG4gIGNvbG9yOiBcIndoaXRlXCIsXG4gIGJvcmRlcjogXCJub25lXCIsXG4gIGJvcmRlclJhZGl1czogXCI1cHhcIixcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcbn0pO1xuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUmVmIiwiRmlsZVVwbG9hZCIsImF4aW9zIiwiVGVsZWdyYW1VSSIsImRhcmtNb2RlIiwic2V0RGFya01vZGUiLCJjaGF0cyIsInNldENoYXRzIiwiaWQiLCJuYW1lIiwibGFzdE1lc3NhZ2UiLCJ1bnJlYWQiLCJtZXNzYWdlcyIsInRleHQiLCJzZW5kZXIiLCJyZWFkIiwic29ja2V0IiwiV2ViU29ja2V0Iiwic2V0V3MiLCJvbm1lc3NhZ2UiLCJldmVudCIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJjb25zb2xlIiwibG9nIiwiU2VsZWN0ZWRDaGF0Iiwic2V0U2VsZWN0ZWRDaGF0IiwicHJldkNoYXQiLCJ1cGRhdGVkQ2hhdCIsImxlbmd0aCIsIkNvbnRhY3RUZWxlSWQiLCJTZW5kZXJJZCIsIlJlY2VpdmVySWQiLCJNZXNzYWdlIiwiU3RhdHVzIiwic2V0Q2hhdHNBbGwiLCJwcmV2Q2hhdHMiLCJpbmRleCIsImZpbmRJbmRleCIsIml0ZW0iLCJpZHVzZXIiLCJjbG9zZSIsImNoYXRzQWxsIiwic2VsZWN0ZWRDaGF0aWQiLCJzZXRTZWxlY3RlZENoYXRpZCIsInNlbGVjdGVkQ2hhdCIsImlucHV0Iiwic2V0SW5wdXQiLCJtZXNzYWdlc0VuZFJlZiIsImlzT3BlbiIsInNldElzT3BlbiIsImlzT3BlbkxvZ2luIiwic2V0SXNMb2dpbiIsIm5ld0FjY291bnQiLCJzZXROZXdBY2NvdW50IiwiZW1haWwiLCJwaG9uZSIsInBhc3N3b3JkIiwidXJsdGRhdGEiLCJJZGFjY291bnQiLCJzdGF0dXMiLCJ0eXBlbG9naW4iLCJhY2NvdW50cyIsInNldEFjY291bnRzIiwiU2VhcmNoVmFsdWUiLCJzZXRTZWFyY2hWYWx1ZSIsIkNvbnRhY3RBZGQiLCJzZXRDb250YWN0QWRkIiwic2VsZWN0ZWRhY2NvdW50Iiwic2V0U2VsZWN0ZWRBY2NvdW50IiwiZ2V0IiwidGhlbiIsInJlc3BvbnNlIiwiY2F0Y2giLCJlcnJvciIsIk9iamVjdCIsImtleXMiLCJ1bmRlZmluZWQiLCJoYW5kbGVDaGFuZ2UiLCJlIiwidmFsdWUiLCJ0eXBlIiwiY2hlY2tlZCIsInRhcmdldCIsInNldEJ1dHRvblRleHQiLCJjbGlja2FjY291bnQiLCJjbGlja2NoYXQiLCJnZXRhcGljaGF0IiwidmFsaWRhdGVQaG9uZSIsInBob25lUmVnZXgiLCJ0ZXN0IiwiYWRkTmV3Q2hhdCIsInBob25lTnVtYmVyIiwibmV3Q2hhdCIsImFkZENvbnRhY3QiLCJzZXRJc0FkZGluZ0NvbnRhY3QiLCJpc0FkZGluZ0NvbnRhY3QiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwicG9zdCIsImhlYWRlcnMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJwaG9uZWNvbnRhY3QiLCJhbGVydCIsImlzQWRkaW5nIiwic2V0SXNBZGRpbmciLCJuZXdBY2NvdW50TmFtZSIsInNldE5ld0FjY291bnROYW1lIiwiaG92ZXJlZENoYXQiLCJzZXRIb3ZlcmVkQ2hhdCIsImhvdmVyZWRBY2NvdW50Iiwic2V0SG92ZXJlZGNjb3VudCIsIkFjY291bnRjdXJyZW50Iiwic2V0QWNjb3VudCIsIndzIiwiYnV0dG9uVGV4dCIsImhhbmRsZUFkZEFjY291bnQiLCJ0cmltIiwibWUiLCJzZXNzaW9uUGF0aCIsInBhdGgiLCJwcmV2IiwiY3VycmVudCIsInNjcm9sbEludG9WaWV3IiwiYmVoYXZpb3IiLCJhZGRBY2NvdW50Iiwic2VuZE1lc3NhZ2UiLCJjaGF0SWQiLCJtZXNzYWdlIiwic2Vzc2lvbk5hbWUiLCJzZW5kZXJfaWQiLCJoYW5kbGVTZW5kTWVzc2FnZSIsInNldERhdGEiLCJ1c2VybmFtZSIsInBhdGhmaWxlIiwiaGFuZGxlRmlsZVNlbGVjdCIsImRpdiIsInN0eWxlIiwiZGlzcGxheSIsIndpZHRoIiwiaGVpZ2h0IiwiYmFja2dyb3VuZENvbG9yIiwiY29sb3IiLCJwYWRkaW5nIiwiZmxleERpcmVjdGlvbiIsIm1heEhlaWdodCIsImp1c3RpZnlDb250ZW50IiwibWFyZ2luQm90dG9tIiwiYnV0dG9uIiwib25DbGljayIsImJhY2tncm91bmQiLCJib3JkZXIiLCJwb3NpdGlvbiIsInRvcCIsImxlZnQiLCJ6SW5kZXgiLCJtYXJnaW5Ub3AiLCJib3JkZXJSYWRpdXMiLCJib3hTaGFkb3ciLCJnYXAiLCJ0cmFuc2Zvcm0iLCJoMyIsInRleHRBbGlnbiIsIm9uQ2hhbmdlIiwicGxhY2Vob2xkZXIiLCJpbnB1dFN0eWxlIiwibGFiZWwiLCJvbkZpbGVTZWxlY3QiLCJzZWxlY3QiLCJvcHRpb24iLCJidXR0b25TdHlsZSIsImFuaW1hdGlvbiIsImgyIiwibWFwIiwiYWNjb3VudCIsIm9uTW91c2VFbnRlciIsIm9uTW91c2VMZWF2ZSIsImFsaWduSXRlbXMiLCJib3JkZXJCb3R0b20iLCJmb250U2l6ZSIsInNwYW4iLCJvdmVyZmxvd1kiLCJjaGF0IiwiZm9udCIsImN1cnNvciIsImZsZXgiLCJtc2ciLCJwIiwibWFyZ2luTGVmdCIsInJlZiIsIm9uS2V5RG93biIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLFNBQVNBLFFBQVEsRUFBRUMsU0FBUyxFQUFFQyxNQUFNLFFBQVEsUUFBUTtBQUNwRCxPQUFPQyxnQkFBaUIsV0FBVztBQUNuQyxPQUFPQyxXQUFXLFFBQVE7QUFLMUIsZUFBZSxTQUFTQzs7SUFDdEIsTUFBTSxDQUFDQyxVQUFVQyxZQUFZLEdBQUdQLFNBQVM7SUFFekMsTUFBTSxDQUFDUSxPQUFPQyxTQUFTLEdBQUdULFNBQVM7UUFDakM7WUFDRVUsSUFBSTtZQUNKQyxNQUFNO1lBQ05DLGFBQWE7WUFDYkMsUUFBUTtZQUNSQyxVQUFVO2dCQUNSO29CQUFFSixJQUFJO29C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
