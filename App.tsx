import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatBubble from './components/ChatBubble';
import AnalysisPanel from './components/AnalysisPanel';
import SavedTendersList from './components/SavedTendersList';
import ConfigEditor from './components/ConfigEditor';
import { Message, Sender, TenderAnalysis, SavedTender } from './types';
import { sendChatMessage, analyzeTenderRequirements } from './services/geminiService';
import { saveTenderToStorage, getSavedTenders, deleteTenderFromStorage } from './services/tenderStorage';

// Simple UUID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Smart Tender Assistant. Tell me what you're looking to purchase, and I'll help you structure a professional tender.",
      sender: Sender.AI,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tenderAnalysis, setTenderAnalysis] = useState<TenderAnalysis | null>(null);
  
  // State to track current loaded project context
  const [currentTenderId, setCurrentTenderId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string | null>(null);
  const [currentDraft, setCurrentDraft] = useState<string | null>(null);

  const [showSavedTenders, setShowSavedTenders] = useState(false);
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [savedTenders, setSavedTenders] = useState<SavedTender[]>([]);
  
  // Resizing State
  const [sidebarWidth, setSidebarWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved tenders on mount
    setSavedTenders(getSavedTenders());
  }, []);

  // Resizing Logic
  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = window.innerWidth - mouseMoveEvent.clientX;
        // Set limits for sidebar width
        if (newWidth > 300 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);


  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: generateId(),
      text: inputText,
      sender: Sender.User,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsChatLoading(true);

    const responseText = await sendChatMessage(messages.concat(userMsg), inputText);

    const aiMsg: Message = {
      id: generateId(),
      text: responseText,
      sender: Sender.AI,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsChatLoading(false);
  };

  const handleAnalyze = async () => {
    if (messages.length < 2) return;
    setIsAnalyzing(true);
    
    // Reset current project context on new analysis
    setCurrentTenderId(null);
    setCurrentProjectName(null);
    setCurrentDraft(null);

    const analysis = await analyzeTenderRequirements(messages);
    setTenderAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleSaveProject = (name: string, structure: string[], draft: string | null) => {
    if (!tenderAnalysis) return;

    // Create updated analysis object with the new structure
    const updatedAnalysis = { ...tenderAnalysis, structure };

    // If we have an active project ID and the name hasn't changed, overwrite it (keep ID).
    // Otherwise, generate a new ID (Save As new).
    const idToUse = (currentTenderId && name === currentProjectName) ? currentTenderId : generateId();

    const newTender: SavedTender = {
      id: idToUse,
      name,
      domain: updatedAnalysis.domain,
      createdAt: new Date().toISOString(),
      analysis: updatedAnalysis,
      structure, // Save the modified structure
      draftContent: draft || undefined
    };

    const updated = saveTenderToStorage(newTender);
    setSavedTenders(updated);
    
    // Update current context to the newly saved project
    setCurrentTenderId(idToUse);
    setCurrentProjectName(name);
    setCurrentDraft(draft);

    // CRITICAL FIX: Update the main tenderAnalysis state with the new structure.
    // This ensures that when AnalysisPanel receives the new props (due to name change),
    // it syncs with this *updated* structure instead of reverting to the original analysis.
    setTenderAnalysis(updatedAnalysis);
  };

  const handleLoadTender = (tender: SavedTender) => {
    // Restore analysis and structure
    setTenderAnalysis({
      ...tender.analysis,
      structure: tender.structure
    });
    
    // Set current project context
    setCurrentTenderId(tender.id);
    setCurrentProjectName(tender.name);
    setCurrentDraft(tender.draftContent || null);
    
    setShowSavedTenders(false);
    
    // Add a system message to chat indicating restoration
    const restoreMsg: Message = {
      id: generateId(),
      text: `Loaded project: "${tender.name}". You can continue editing the structure or generate a new draft.`,
      sender: Sender.AI,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, restoreMsg]);
  };

  const handleDeleteTender = (id: string) => {
    const updated = deleteTenderFromStorage(id);
    setSavedTenders(updated);
    // If the deleted tender was active, reset context
    if (currentTenderId === id) {
      setCurrentTenderId(null);
      setCurrentProjectName(null);
      setCurrentDraft(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-gray-50 text-gray-900 relative ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      
      {/* Config Editor Modal */}
      <ConfigEditor 
        isOpen={showConfigEditor}
        onClose={() => setShowConfigEditor(false)}
      />

      {/* Saved Tenders Drawer/Modal */}
      {showSavedTenders && (
        <SavedTendersList 
          tenders={savedTenders}
          onLoad={handleLoadTender}
          onDelete={handleDeleteTender}
          onClose={() => setShowSavedTenders(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative h-full min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">SmartTender<span className="text-indigo-600">.ai</span></h1>
            <p className="text-xs text-gray-500">Intelligent Procurement Assistant</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfigEditor(true)}
              className="p-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-lg transition-colors"
              title="Configuration"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>

            <button
              onClick={() => setShowSavedTenders(true)}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              My Projects
              {savedTenders.length > 0 && (
                <span className="bg-indigo-100 text-indigo-600 text-xs px-1.5 py-0.5 rounded-full">{savedTenders.length}</span>
              )}
            </button>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || messages.length < 3}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm
                ${messages.length < 3 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Analyze Requirements
                </>
              )}
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2 scroll-smooth">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          
          {isChatLoading && (
             <div className="flex justify-start w-full mb-4">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="relative max-w-4xl mx-auto flex items-center gap-3">
            <textarea
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 resize-none shadow-sm outline-none transition-all"
              rows={1}
              placeholder="E.g., I need to buy 50 standing desks for our new tech hub..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isChatLoading}
              className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0"
            >
              <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">AI can make mistakes. Please review generated tenders carefully.</p>
        </div>
      </main>

      {/* Resizer Handle */}
      <div
        className={`w-1.5 hover:w-2 cursor-col-resize hover:bg-indigo-500 transition-all z-30 flex flex-col justify-center items-center hidden md:flex
          ${isResizing ? 'bg-indigo-600 w-2' : 'bg-gray-200'}
        `}
        onMouseDown={startResizing}
      >
         <div className={`h-8 w-0.5 rounded-full ${isResizing ? 'bg-white' : 'bg-gray-400'}`}></div>
      </div>

      {/* Side Panel for Analysis */}
      <aside 
        className="bg-white border-l border-gray-200 shadow-xl hidden md:block z-20 flex-shrink-0"
        style={{ width: sidebarWidth }}
      >
        <AnalysisPanel 
          analysis={tenderAnalysis} 
          isLoading={isAnalyzing} 
          onSave={handleSaveProject}
          initialProjectName={currentProjectName}
          initialDraft={currentDraft}
        />
      </aside>

    </div>
  );
};

export default App;
