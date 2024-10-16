import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaEllipsisV, FaTimes, FaCheck } from 'react-icons/fa';
import createAuthenticatedApi from '../utils/api';
import AuthContext from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import UserHeader from '../components/UserHeader';
import message from '../images/message.png';
import Loading from '../components/Loading';

const Chat = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [api, setApi] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);
  const [editingTitle, setEditingTitle] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleNavigateToPractice = () => {
    navigate('/practice'); 
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (chatId, e) => {
    e.stopPropagation();
    setOpenMenu(openMenu === chatId ? null : chatId);
  };


  const location = useLocation();
  const { courseId } = location.state || {};
  const messagesEndRef = useRef(null);
  const chatHistoryRef = useRef(null);
  const { getSession, user } = useContext(AuthContext);

  useEffect(() => {
    const initApi = async () => {
      const authenticatedApi = await createAuthenticatedApi(getSession);
      setApi(authenticatedApi);
    };
    initApi();
  }, [getSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (api && courseId) {
      startChat();
      fetchChatHistory();
    }
  }, [api, courseId]);

  useEffect(() => {
    const handleScroll = () => {
      const chatHistoryElement = chatHistoryRef.current;
      if (chatHistoryElement) {
        const isScrolledToBottom = 
          chatHistoryElement.scrollHeight - chatHistoryElement.clientHeight <= chatHistoryElement.scrollTop + 1;
        chatHistoryElement.style.boxShadow = isScrolledToBottom ? 'none' : 'inset 0 -10px 10px -10px rgba(0,0,0,0.5)';
      }
    };

    const chatHistoryElement = chatHistoryRef.current;
    if (chatHistoryElement) {
      chatHistoryElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => chatHistoryElement?.removeEventListener('scroll', handleScroll);
  }, [isSidebarOpen]);

  const fetchChatHistory = async () => {
    if (!api || !courseId) return;
    try {
      const response = await api.get(`/get_chat_history?course_id=${courseId}`);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      toast.error('Failed to fetch chat history. Please try again.');
    }
  };

  const startChat = async () => {
    if (!api || !courseId) return;
    try {
      const response = await api.post('/start_chat', { course_id: courseId });
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        setMessages([]);
        setMessageCount(0);
        setSelectedChat(null);
        fetchChatHistory();
      }
    } catch (error) {
      console.error('Error starting new chat session:', error);
      toast.error('Failed to start new chat session. Please try again.');
    }
  };

  const editChatTitle = async (chatId, newTitle) => {
    if (!api) return;
    try {
      const response = await api.put('/edit_chat_title', { chat_id: chatId, new_title: newTitle });
      if (response.data.message) {
        toast.success(response.data.message);
        setChatHistory(prevHistory =>
          prevHistory.map(chat =>
            chat.chatId === chatId ? { ...chat, Title: newTitle } : chat
          )
        );
        setEditingTitle(null);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error('Error editing chat title:', error);
      toast.error('Failed to edit chat title. Please try again.');
    }
  };

  const saveCurrentChat = async () => {
    if (!api) return;
    try {
      const response = await api.post('/save_chat');
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Chat saved successfully!');
        fetchChatHistory();
      }
    } catch (error) {
      console.error('Error saving chat:', error);
      toast.error('Failed to save chat. Please try again.');
    }
  };

  const loadChat = async (chatId) => {
    if (!api || !chatId) return;
    try {
      const response = await api.get(`/load_chat?chat_id=${chatId}`);
      setMessages(response.data.messages.map(msg => ({
        type: msg.type === 'HumanMessage' ? 'user' : 'bot',
        content: msg.content
      })));
      setMessageCount(response.data.messageCount);
      setSelectedChat(chatId);
    } catch (error) {
      console.error('Error loading chat:', error);
      toast.error('Failed to load chat. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !api) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');

    const practiceKeywords = ['practice', 'question', 'exercise', 'test', 'quiz']

    try {
        const response = await api.post('/query', { query: input });
        setMessageCount(response.data.messageCount);

        if (practiceKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
            // Suggest going to the practice page
            setMessages(prev => [
                ...prev,
                { type: 'bot', content: "It seems like you are asking about practice! You can go to the practice page to start your practice." },
            ]);
           
        } else {
            setMessages(prev => [...prev, { type: 'bot', content: response.data.answer }]);
        }

        if (response.data.memoryFull) {
            toast.warning('Memory limit reached. Please clear the conversation to continue.');
        }
    } catch (error) {
        console.error('Error querying:', error);
        setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, an error occurred. Please try again.' }]);
    } finally {
        setIsLoading(false);
    }
};



  const copyEntireChat = useCallback(() => {
    const chatText = messages.map(message => 
      `${message.type === 'user' ? 'User' : 'Bot'}: ${message.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(chatText)
      .then(() => toast.success('Chat copied to clipboard!'))
      .catch(err => console.error('Failed to copy chat: ', err));
  }, [messages]);

  const formatMessage = useCallback((content, isBot) => {
    content = content.replace(/\*{2}(.*?)\*{2}/g, '<strong>$1</strong>');
  
    const codeBlocks = content.split('```');
    return codeBlocks.map((block, index) => {
      if (index % 2 === 1) {
        return (
          <div key={index} className="relative group">
            <pre className="bg-gray-800 text-green-400 p-4 rounded-md my-2 overflow-x-auto">
              <code>{block.trim()}</code>
            </pre>
            {isBot && (
              <button
                onClick={() => copyText(block.trim())}
                className="absolute top-2 right-2 bg-gray-700 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Copy Code
              </button>
            )}
          </div>
        );
      } else {
        return <span key={index} dangerouslySetInnerHTML={{ __html: block }} />;
      }
    });
  }, []);

  const copyText = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  }, []);

  const deleteChat = async (chatId) => {
    if (!api) return;

    try {
      const response = await api.delete('/delete_chat', { data: { chat_id: chatId } });
      if (response.data.message) {
        toast.success(response.data.message);
        setChatHistory(prevHistory => prevHistory.filter(chat => chat.chatId !== chatId));
        if (selectedChat === chatId) {
          setMessages([]);
          setMessageCount(0);
          setSelectedChat(null);
        }
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat. Please try again.');
    }
  };

  
  

  if (!courseId) return <div>Error: No course selected</div>;

  return (
    <div className="min-h-screen bg-primary p-0 flex flex-row">
      <UserHeader/>

      <div className='relative'>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-64 bg-primary text-white border-2 border-secondary p-4 rounded-lg flex flex-col h-full"
            >
              <h2 className="text-xl text-black font-pbold mb-4">Chat History</h2>
              <div 
  ref={chatHistoryRef} 
  className="overflow-y-auto flex-grow"
  style={{ 
    scrollbarWidth: 'thin', 
    scrollbarColor: '#4B5563 #1F2937',
    maxHeight: 'calc(100vh - 120px)'
  }}
>
  {chatHistory.length > 0 ? (
    chatHistory.map((chat) => (
      <div
        key={chat.chatId}
        className={`p-2 mb-2 bg-secondary text-black font-popp rounded-lg cursor-pointer transition-colors duration-200 hover:opacity-80 ${
          selectedChat === chat.chatId ? 'border-2 border-black' : ''
        } relative group`}
        onClick={() => loadChat(chat.chatId)}
      >
        <div className="flex justify-between items-center">
          {editingTitle === chat.chatId ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-secondary-200 text-black px-2 py-1 rounded flex-grow "
              autoFocus
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
            />
          ) : (
            <span className="flex-grow truncate">{chat.Title}</span>
          )}
          <button 
            className="text-black opacity-0 group-hover:opacity-100 transition-opacity ml-2"
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from bubbling up
              toggleMenu(chat.chatId, e);
            }}
          >
            <FaEllipsisV />
          </button>
        </div>
        {openMenu === chat.chatId && (
          <div 
            ref={menuRef} 
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {editingTitle === chat.chatId ? (
                <>
                  <button
                    className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100 hover:text-green-900 w-full text-left"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      editChatTitle(chat.chatId, newTitle);
                    }}
                  >
                    <FaCheck className="inline mr-2" /> Save
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-red-900 w-full text-left"
                    role="menuitem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingTitle(null);
                    }}
                  >
                    <FaTimes className="inline mr-2" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTitle(chat.chatId);
                    setNewTitle(chat.Title);
                  }}
                >
                  Edit Title
                </button>
              )}
              <button
                className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 hover:text-red-900 w-full text-left"
                role="menuitem"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat.chatId);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    ))
  ) : (
    <p>No chat history yet.</p>
  )}
</div>
             
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isSidebarOpen ? 180 : 0, transitionDuration:   '0s' }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-1/2 transform -translate-y-1/2 bg-secondary text-white p-2 rounded-r-lg z-10 transition-transform duration-300 ${isSidebarOpen ? 'right-0' : 'left-0'}`}
        >
          <FaChevronRight/>
        </motion.button>
      </div>
      

      <div className={`flex-grow transition-all duration-300 p-4 ${isSidebarOpen ? 'ml-3' : 'ml-7'} mt-20`}>

      <h1 className="text-2xl font-pbold text-secondary inline-block">Chat for {courseId}</h1>

  <div className="flex justify-between items-center mb-4">
  <span className="text-black font-popp ml-4">Message Count: {messageCount}/30</span>
  
    <div className="flex space-x-2">
      <button onClick={copyEntireChat} className="w-20 bg-blue text-gray-200 font-popp p-2 border-2 border-secondary rounded-full hover:opacity-70">
        Copy
      </button>
      <button onClick={startChat} className="w-20 bg-blue text-gray-200 font-popp p-2 border-2 border-secondary rounded-full hover:opacity-70">
        Clear
      </button>
      <button onClick={saveCurrentChat} className="w-20 bg-blue text-gray-200 font-popp p-2 border-2 border-secondary rounded-full hover:opacity-70">
        Save
      </button>
    </div>
    
  </div>

        <div className="bg-white p-4 border-2 border-secondary rounded-lg h-96 flex flex-col">

  <div className="flex-grow overflow-y-auto mb-4">
    {messages.map((message, index) => (
      <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-lg relative group ${
          message.type === 'user' ? 'bg-secondary text-black' : 'bg-gray-100 text-black'
        }`}>
          {formatMessage(message.content, message.type === 'bot')}
          {message.type === 'bot' && (
            <div className='flex flex-row items-center justify-end pt-5'>
              <button
                onClick={() => copyText(message.content)}
                className="bg-secondary text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary-200"
              >
                Copy Message
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
    
    <div ref={messagesEndRef} />
  </div>

  <form onSubmit={handleSubmit} className="relative flex items-center">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="flex-grow p-2 rounded-full bg-white border-2 border-secondary text-black pr-12" // Add padding to the right for button space
    placeholder="Type your message..."
  />

  <button
    type="submit"
    disabled={isLoading || messageCount >= 30}
    className="absolute right-2" // Position the button inside the input
  >
    {isLoading ? (
      <Loading/>
    
    ) : (
      <img src={message} alt="Send" className="w-8 h-8" />
    )}
  </button>
</form>

</div>
</div>
    </div>
  );
};

export default Chat;