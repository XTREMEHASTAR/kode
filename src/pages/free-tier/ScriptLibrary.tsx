import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierLayout } from '../../components/free-tier/FreeTierLayout';
import { ScriptLibraryItem } from '../../components/free-tier/ScriptLibraryItem';
import { FreeTierScript } from '../../types/freeTier';
import { freeTierService } from '../../services/freeTierService';
import { useApp } from '../../context/AppContext';
import { downloadScriptReport } from '../../utils/reportExporter';
import { CustomSelect } from '../../components/ui/CustomSelect';

export const ScriptLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  
  // Data State
  const [scripts, setScripts] = useState<FreeTierScript[]>([]);
  
  // Filtering, Sorting & Search
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Rename Modal State
  const [renameScriptId, setRenameScriptId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // Initial Load & State Sync
  const loadScripts = () => {
    const list = freeTierService.getScripts();
    setScripts(list);
    freeTierService.fetchScriptsAsync().then((cloudList) => {
      setScripts(cloudList);
    }).catch(err => {
      console.warn("Library background cloud fetch warning:", err);
    });
  };

  useEffect(() => {
    loadScripts();
  }, []);

  // Filter & Sort Logic
  const filteredScripts = scripts.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || s.isFavorite;
    return matchesSearch && matchesTab;
  });

  const sortedScripts = [...filteredScripts].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'highest') {
      return b.hookScore - a.hookScore;
    }
    if (sortBy === 'lowest') {
      return a.hookScore - b.hookScore;
    }
    return 0;
  });

  // Pagination calculation
  const totalItems = sortedScripts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedScripts = sortedScripts.slice(startIndex, endIndex);

  // Reset page when search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, sortBy]);

  // Actions
  const handleSelect = (id: string) => {
    navigate(`/script-intelligence/${id}/results`);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = freeTierService.toggleFavorite(id);
    if (updated) {
      showToast(updated.isFavorite ? 'Script added to favorites.' : 'Script removed from favorites.', 'success');
      loadScripts();
    }
  };

  const handleDelete = (id: string) => {
    freeTierService.deleteScript(id);
    showToast('Script deleted successfully.', 'success');
    loadScripts();
  };

  const handleDownloadReport = (id: string) => {
    const script = scripts.find(s => s.id === id);
    if (script) {
      downloadScriptReport(script);
      showToast('Analysis report downloaded successfully!', 'success');
    }
  };

  const handleOpenRename = (id: string) => {
    const script = scripts.find(s => s.id === id);
    if (script) {
      setRenameScriptId(id);
      setNewTitle(script.title);
    }
  };

  const handleSaveRename = () => {
    if (!renameScriptId) return;
    if (!newTitle.trim()) {
      showToast('Title cannot be empty.', 'error');
      return;
    }

    const updated = freeTierService.renameScript(renameScriptId, newTitle.trim());
    if (updated) {
      showToast('Script renamed successfully.', 'success');
      setRenameScriptId(null);
      loadScripts();
    }
  };

  return (
    <FreeTierLayout>
      <div className="ft-card">
        {/* Title */}
        <div className="ft-title-row">
          <div>
            <h2 className="ft-page-title">My Library</h2>
            <p className="ft-page-subtitle">Manage and view past script analyses.</p>
          </div>
          <button className="ft-btn" onClick={() => navigate('/script-intelligence')}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Analyze New Script
          </button>
        </div>

        {/* Tabs */}
        <div className="ft-tabs">
          <button 
            className={`ft-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Scripts
          </button>
          <button 
            className={`ft-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
          </button>
        </div>

        {/* Filter Bar */}
        <div className="ft-filter-bar">
          <div className="ft-search-wrapper">
            <svg className="ft-search-icon" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              className="ft-search-input" 
              placeholder="Search scripts by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CustomSelect
            value={sortBy}
            onChange={(val) => setSortBy(val as any)}
            width="180px"
            options={[
              { value: 'newest', label: 'Newest First' },
              { value: 'oldest', label: 'Oldest First' },
              { value: 'highest', label: 'Highest Score' },
              { value: 'lowest', label: 'Lowest Score' }
            ]}
          />
        </div>

        {/* List Content */}
        {paginatedScripts.length > 0 ? (
          <>
            <div className="ft-library-list">
              {paginatedScripts.map((script) => (
                <ScriptLibraryItem 
                  key={script.id}
                  script={script}
                  onSelect={handleSelect}
                  onRename={handleOpenRename}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDelete}
                  onDownloadReport={handleDownloadReport}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="ft-pagination">
                <span>
                  Showing {startIndex + 1}–{endIndex} of {totalItems} results
                </span>
                <div className="ft-page-controls">
                  <button 
                    className={`ft-page-num ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button 
                      key={idx}
                      className={`ft-page-num ${currentPage === idx + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button 
                    className={`ft-page-num ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="ft-empty-state">
            <div className="ft-empty-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="ft-empty-title">
              {searchTerm || activeTab === 'favorites' ? "No matching scripts found" : "No scripts analyzed yet."}
            </h3>
            <p className="ft-empty-desc">
              {searchTerm 
                ? "Try searching for a different keyword or resetting your filters." 
                : activeTab === 'favorites'
                ? "You haven't added any scripts to your favorites yet."
                : "Your next great hook starts here."}
            </p>
            {!searchTerm && activeTab === 'all' && (
              <button className="ft-btn" onClick={() => navigate('/script-intelligence')}>
                Analyze My First Script
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {renameScriptId && (
        <div className="ft-modal-overlay">
          <div className="ft-modal">
            <h3 className="ft-modal-title">Rename Script</h3>
            <input 
              type="text" 
              className="ft-modal-input" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new script title..."
              autoFocus
            />
            <div className="ft-modal-actions">
              <button 
                className="ft-btn ft-btn-secondary" 
                onClick={() => setRenameScriptId(null)}
              >
                Cancel
              </button>
              <button 
                className="ft-btn" 
                onClick={handleSaveRename}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </FreeTierLayout>
  );
};
