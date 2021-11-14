import { useState, useEffect, useRef } from "react"
import ChatbotMessage from "./ChatbotMessage"
import WaveMessage from "./WaveMessage"

const ChatbotOpen = (props) => {
  const { setIsOpen } = props
  const [conversation, setConversation] = useState([])
  const [enteredTextInput, setEnteredTextInput] = useState("")
  const [isWaiting, setIsWaiting] = useState(false)
  const chatboxInnerRef = useRef()

  useEffect(() => {
    if (chatboxInnerRef.current) {
      chatboxInnerRef.current.scrollTop = chatboxInnerRef.current.scrollHeight
    }
  }, [conversation])

  useEffect(() => {
    fetch("https://icanhazdadjoke.com/", {
      // method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
      },
      // body: JSON.stringify({ question: "xin chào" }),
    })
      .then((response) => response.json())
      .then((data) =>
        setConversation((prevState) => {
          return [...prevState, { sender: "bot", content: data.joke }]
        }),
      )
  }, [])

  const handleCloseChatbox = () => {
    setIsOpen(false)
  }

  const handleChangeInput = (event) => {
    !isWaiting && setEnteredTextInput(event.target.value)
  }

  const handleSubmitForm = (event) => {
    event.preventDefault()
    if (enteredTextInput) {
      setConversation((prevState) => {
        return [
          ...prevState,
          {
            sender: "user",
            content: enteredTextInput,
          },
        ]
      })
      getResponse(enteredTextInput)
    }
    setEnteredTextInput("")
  }

  const getResponse = async (input) => {
    setIsWaiting(true)
    await fetch("https://icanhazdadjoke.com/", {
      // method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json",
      },
      // body: JSON.stringify({ question: input }),
    })
      .then((response) => response.json())
      .then((data) =>
        setConversation((prevState) => {
          return [...prevState, { sender: "bot", content: data.joke }]
        }),
      )
      .catch(() =>
        setConversation((prevState) => {
          return [...prevState, { sender: "bot", content: "Lỗi hệ thống" }]
        }),
      )
    setIsWaiting(false)
  }
  return (
    <div className="chatbox-wapper">
      <div className="chatbox-header">
        <p>Ultimate Chatbot For Education</p>
        <div className="chatbox-btn" onClick={handleCloseChatbox}>
          <box-icon name="x" color="white"></box-icon>
        </div>
      </div>
      <div className="chatbox-inner" ref={chatboxInnerRef}>
        {conversation.map((message, index) => (
          <ChatbotMessage sender={message.sender} key={index}>
            {message.content}
          </ChatbotMessage>
        ))}
        {/* {isWaiting && <ChatbotMessage content={WaveMessage} sender="bot" />} */}
        {isWaiting && (
          <ChatbotMessage sender="bot">
            <WaveMessage />
          </ChatbotMessage>
        )}
      </div>
      <div className="chatbox-footer">
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            placeholder="Send something ..."
            onChange={handleChangeInput}
            value={enteredTextInput}
          />
          <button
            className={`chatbox-btn ${enteredTextInput && "active"}`}
            type="submit"
            onClick={handleSubmitForm}
          >
            <box-icon
              type="solid"
              name="send"
              color={`${enteredTextInput && "#d82c2c"}`}
            ></box-icon>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatbotOpen
