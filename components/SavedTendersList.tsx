import React from 'react';
import { SavedTender, PurchaseDomain } from '../types';

interface SavedTendersListProps {
  tenders: SavedTender[];
  onLoad: (tender: SavedTender) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const getDomainBadgeColor = (domain: PurchaseDomain) => {
  switch (domain) {
    case PurchaseDomain.IT: return 'bg-blue-100 text-blue-800';
    case PurchaseDomain.Medical: return 'bg-red-100 text-red-800';
    case PurchaseDomain.Construction: return 'bg-orange-100 text-orange-800';
    case PurchaseDomain.Logistics: return 'bg-green-100 text-green-800';
    case PurchaseDomain.Furniture: return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const SavedTendersList: React.FC<SavedTendersListProps> = ({ tenders, onLoad, onDelete, onClose }) => {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-end backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            My Projects
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {tenders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
            <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>No saved projects yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tenders.map((tender) => (
              <div key={tender.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow group relative">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 pr-6" title={tender.name}>{tender.name}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(tender.id); }}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Delete Project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-3 ${getDomainBadgeColor(tender.domain)}`}>
                  {tender.domain}
                </span>

                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {tender.analysis.recommendedTemplate}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">
                    {new Date(tender.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => onLoad(tender)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                  >
                    Open
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTendersList;