import React, { useState, useEffect } from 'react';
import { PurchaseDomain, TenderClause, TenderTemplateConfig } from '../types';
import { 
  getAllTemplates, 
  saveAllTemplates, 
  getAllClauses, 
  saveAllClauses, 
  resetTemplatesToDefault,
  resetClausesToDefault
} from '../services/configManager';

interface ConfigEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'templates' | 'clauses';

const ConfigEditor: React.FC<ConfigEditorProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [selectedDomain, setSelectedDomain] = useState<PurchaseDomain>(PurchaseDomain.IT);
  
  // Data State
  const [templates, setTemplates] = useState<Record<string, TenderTemplateConfig>>({});
  const [clauses, setClauses] = useState<Record<string, TenderClause[]>>({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Editing State
  const [editingClause, setEditingClause] = useState<TenderClause | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTemplates(getAllTemplates());
      setClauses(getAllClauses());
      setShowSaveSuccess(false);
      setEditingClause(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Handlers for Templates ---

  const handleTemplateChange = (field: keyof TenderTemplateConfig, value: any) => {
    setTemplates(prev => ({
      ...prev,
      [selectedDomain]: {
        ...prev[selectedDomain],
        [field]: value
      }
    }));
  };

  const handleTemplateSectionsChange = (text: string) => {
    // Split by double newline to approximate section blocks
    const sections = text.split('\n\n').filter(s => s.trim().length > 0);
    handleTemplateChange('sections', sections);
  };

  const handleSaveTemplates = () => {
    saveAllTemplates(templates);
    showSuccessMsg();
  };

  const handleResetTemplates = () => {
    if (confirm("Are you sure? This will revert all templates to factory defaults.")) {
      resetTemplatesToDefault();
      setTemplates(getAllTemplates());
    }
  };

  // --- Handlers for Clauses ---

  const handleClauseChange = (id: string, field: keyof TenderClause, value: any) => {
    const domainClauses = clauses[selectedDomain] || [];
    const updatedList = domainClauses.map(c => c.id === id ? { ...c, [field]: value } : c);
    
    setClauses(prev => ({
      ...prev,
      [selectedDomain]: updatedList
    }));
  };

  const handleAddClause = () => {
    const newClause: TenderClause = {
      id: `new-${Date.now()}`,
      title: 'New Standard Clause',
      content: 'Enter clause text here...',
      mandatory: true
    };
    setClauses(prev => ({
      ...prev,
      [selectedDomain]: [...(prev[selectedDomain] || []), newClause]
    }));
    setEditingClause(newClause);
  };

  const handleDeleteClause = (id: string) => {
    if (confirm("Delete this clause?")) {
      setClauses(prev => ({
        ...prev,
        [selectedDomain]: prev[selectedDomain].filter(c => c.id !== id)
      }));
      if (editingClause?.id === id) setEditingClause(null);
    }
  };

  const handleSaveClauses = () => {
    saveAllClauses(clauses);
    showSuccessMsg();
  };

  const handleResetClauses = () => {
    if (confirm("Are you sure? This will revert all clauses to factory defaults.")) {
      resetClausesToDefault();
      setClauses(getAllClauses());
    }
  };

  const showSuccessMsg = () => {
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">System Configuration</h2>
            <p className="text-sm text-gray-500">Manage tender templates and standard legal clauses.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs & Domain Selector */}
        <div className="flex items-center gap-6 px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'templates' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Tender Templates
            </button>
            <button 
              onClick={() => setActiveTab('clauses')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'clauses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Clause Library
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Domain:</label>
            <select 
              value={selectedDomain}
              onChange={(e) => {
                setSelectedDomain(e.target.value as PurchaseDomain);
                setEditingClause(null);
              }}
              className="border border-gray-300 rounded-md text-sm px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
            >
              {Object.values(PurchaseDomain).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 flex justify-end gap-2">
             {showSaveSuccess && <span className="text-green-600 text-sm font-medium animate-fade-in">Saved Successfully!</span>}
             <button 
                onClick={activeTab === 'templates' ? handleSaveTemplates : handleSaveClauses}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 font-medium shadow-sm"
             >
               Save Changes
             </button>
             <button 
                onClick={activeTab === 'templates' ? handleResetTemplates : handleResetClauses}
                className="px-3 py-2 text-red-500 text-sm hover:bg-red-50 rounded border border-transparent hover:border-red-100"
             >
               Reset Defaults
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          
          {activeTab === 'templates' && (
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
               {/* Template Config Form */}
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
                    <textarea 
                      value={templates[selectedDomain]?.focusArea || ''}
                      onChange={(e) => handleTemplateChange('focusArea', e.target.value)}
                      className="w-full h-24 border border-gray-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the focus of this template..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Keywords (comma separated)</label>
                    <textarea 
                      value={templates[selectedDomain]?.complianceKeywords.join(', ') || ''}
                      onChange={(e) => handleTemplateChange('complianceKeywords', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full h-24 border border-gray-300 rounded-lg p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., GDPR, ISO 27001"
                    />
                  </div>
               </div>

               <div className="h-px bg-gray-200 my-4"></div>

               <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Template Structure (Sections)</label>
                    <span className="text-xs text-gray-400">Separate main blocks with double newlines</span>
                  </div>
                  <textarea 
                    value={templates[selectedDomain]?.sections.join('\n\n') || ''}
                    onChange={(e) => handleTemplateSectionsChange(e.target.value)}
                    className="w-full h-[400px] border border-gray-300 rounded-lg p-4 text-sm font-mono bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                  />
               </div>
            </div>
          )}

          {activeTab === 'clauses' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Clause List Sidebar */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-700">Clauses List</h3>
                  <button onClick={handleAddClause} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                    + Add New
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {(clauses[selectedDomain] || []).map((clause) => (
                    <div 
                      key={clause.id}
                      onClick={() => setEditingClause(clause)}
                      className={`p-3 rounded-lg cursor-pointer border transition-all ${editingClause?.id === clause.id ? 'bg-white border-indigo-500 shadow-md' : 'bg-white border-gray-200 hover:border-indigo-300'}`}
                    >
                      <h4 className="text-sm font-medium text-gray-900 truncate">{clause.title}</h4>
                      <div className="flex justify-between mt-1">
                        <span className={`text-[10px] px-1.5 rounded ${clause.mandatory ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                          {clause.mandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(clauses[selectedDomain] || []).length === 0 && (
                    <div className="text-center p-8 text-gray-400 text-sm">No clauses defined for this domain.</div>
                  )}
                </div>
              </div>

              {/* Clause Editor */}
              <div className="flex-1 p-8 overflow-y-auto bg-white">
                {editingClause ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-start">
                       <h3 className="text-lg font-bold text-gray-800">Edit Clause</h3>
                       <button 
                         onClick={() => handleDeleteClause(editingClause.id)}
                         className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                       >
                         Delete Clause
                       </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clause Title</label>
                      <input 
                        type="text"
                        value={editingClause.title}
                        onChange={(e) => handleClauseChange(editingClause.id, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        id="mandatoryCheck"
                        checked={editingClause.mandatory}
                        onChange={(e) => handleClauseChange(editingClause.id, 'mandatory', e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="mandatoryCheck" className="text-sm text-gray-700">Mandatory inclusion for this domain</label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Clause Content (Markdown supported)</label>
                      <textarea 
                        value={editingClause.content}
                        onChange={(e) => handleClauseChange(editingClause.id, 'content', e.target.value)}
                        className="w-full h-64 border border-gray-300 rounded-lg p-4 text-sm font-mono bg-gray-50 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                      />
                    </div>
                  </div>
                ) : (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <p>Select a clause to edit or add a new one.</p>
                   </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConfigEditor;
