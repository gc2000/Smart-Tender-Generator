import React from 'react';
import { Message, Sender } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.text}</div>
        <div
          className={`text-[10px] mt-1 text-right ${
            isUser ? 'text-indigo-200' : 'text-gray-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;