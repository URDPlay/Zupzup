import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, BookOpen, Settings, Layout, X } from 'lucide-react';
import { getBlogArticles, saveBlogArticle, deleteBlogArticle } from './blogData';

// Dynamic Blog Section with Reader View and Publisher Studio
export const BlogSection = ({ onBack }) => {
  const [articles, setArticles] = useState(() => getBlogArticles());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Studio States
  const [isPublisherMode, setIsPublisherMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('AI & Machine Learning');
  const [customCategory, setCustomCategory] = useState('');
  const [formAuthor, setFormAuthor] = useState('Sarah Jenkins');
  const [customAuthor, setCustomAuthor] = useState('');
  const [customAuthorTitle, setCustomAuthorTitle] = useState('');
  const [customAuthorBio, setCustomAuthorBio] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'

  const categories = ['All', ...new Set(articles.map(article => article.category))];

  // Refresh articles list
  const refreshArticles = () => {
    setArticles(getBlogArticles());
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle open create/edit form
  const handleOpenForm = (article = null) => {
    if (article) {
      setEditingArticle(article);
      setFormTitle(article.title);
      
      const standardCategories = ['AI & Machine Learning', 'Railway Safety', 'IoT & Hardware', 'Engineering', 'Company News'];
      if (standardCategories.includes(article.category)) {
        setFormCategory(article.category);
        setCustomCategory('');
      } else {
        setFormCategory('Custom');
        setCustomCategory(article.category);
      }

      const standardAuthors = ['Sarah Jenkins', 'David Chen', 'Dr. Elena Rostova'];
      if (standardAuthors.includes(article.author)) {
        setFormAuthor(article.author);
        setCustomAuthor('');
      } else {
        setFormAuthor('Custom');
        setCustomAuthor(article.author);
        setCustomAuthorTitle(article.authorTitle || '');
        setCustomAuthorBio(article.authorBio || '');
      }

      setFormExcerpt(article.excerpt);
      setFormContent(article.content);
    } else {
      setEditingArticle(null);
      setFormTitle('');
      setFormCategory('AI & Machine Learning');
      setCustomCategory('');
      setFormAuthor('Sarah Jenkins');
      setCustomAuthor('');
      setCustomAuthorTitle('');
      setCustomAuthorBio('');
      setFormExcerpt('');
      setFormContent('');
    }
    setActiveTab('write');
    setShowForm(true);
  };

  // Helper to calculate read time
  const calculateReadTime = (contentHtml) => {
    const text = contentHtml.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  // Handle Save
  const handleSave = (e) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      alert('Title and Content are required!');
      return;
    }

    const finalCategory = formCategory === 'Custom' ? customCategory || 'Uncategorized' : formCategory;
    const finalAuthor = formAuthor === 'Custom' ? customAuthor || 'Anonymous' : formAuthor;

    let authorTitle = 'Contributor';
    let authorBio = `${finalAuthor} is a contributor to UNDISCOVEREDPATH.`;

    if (formAuthor === 'Custom') {
      authorTitle = customAuthorTitle || 'Contributing Author';
      authorBio = customAuthorBio || `${finalAuthor} is a contributing writer for UNDISCOVEREDPATH.`;
    } else {
      const authorsData = {
        "Sarah Jenkins": {
          bio: "Lead AI Engineer specializing in predictive modeling and embedded neural networks for safety-critical systems.",
          title: "Lead AI Engineer"
        },
        "David Chen": {
          bio: "Senior Backend Architect focusing on high-throughput, low-latency telemetry pipelines and edge computing.",
          title: "Senior Backend Architect"
        },
        "Dr. Elena Rostova": {
          bio: "Head of Safety Research with a Ph.D. in Embedded Systems. Dedicated to fault-tolerant hardware and compliance.",
          title: "Head of Safety Research"
        }
      };
      authorTitle = authorsData[formAuthor]?.title || 'Contributor';
      authorBio = authorsData[formAuthor]?.bio || 'Engineering contributor.';
    }

    const payload = {
      id: editingArticle ? editingArticle.id : 'custom_' + Date.now(),
      title: formTitle,
      category: finalCategory,
      date: editingArticle ? editingArticle.date : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: finalAuthor,
      authorTitle,
      authorBio,
      readTime: calculateReadTime(formContent),
      excerpt: formExcerpt || (formContent.replace(/<[^>]*>/g, '').substring(0, 140) + '...'),
      content: formContent
    };

    saveBlogArticle(payload);
    setShowForm(false);
    refreshArticles();
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteBlogArticle(id);
      refreshArticles();
    }
  };

  // Separated custom articles from static articles
  const customArticles = articles.filter(a => String(a.id).startsWith('custom_'));

  if (selectedArticle) {
    return (
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px', fontFamily: 'Roboto, Arial, sans-serif' }}>
        <button 
          onClick={() => setSelectedArticle(null)}
          style={{
            background: 'none', border: 'none', color: '#1a0dab',
            cursor: 'pointer', fontSize: '14px', marginBottom: '24px',
            padding: 0, textDecoration: 'none'
          }}
          onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
        >
          &larr; Back to search results
        </button>

        <article>
          <header style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', color: '#202124', marginBottom: '8px' }}>
              <span>{selectedArticle.category}</span> &rsaquo; <span>{selectedArticle.author}</span>
            </div>
            <h1 style={{ fontSize: '32px', color: '#202124', margin: '0 0 12px 0', fontWeight: '400', lineHeight: '1.2' }}>
              {selectedArticle.title}
            </h1>
            <div style={{ color: '#70757a', fontSize: '14px' }}>
              <time dateTime={new Date(selectedArticle.date).toISOString()}>
                {selectedArticle.date}
              </time> 
              &nbsp;&middot;&nbsp; {selectedArticle.readTime}
            </div>
          </header>

          <div 
            style={{ fontSize: '16px', lineHeight: '1.6', color: '#3c4043', marginBottom: '40px' }}
            dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
          />

          {/* Author EEAT Box */}
          <div style={{ 
            display: 'flex', gap: '20px', padding: '24px', 
            backgroundColor: '#f8f9fa', borderRadius: '12px',
            border: '1px solid #e8eaed', marginBottom: '40px'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: '#1a73e8', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 'bold', flexShrink: 0
            }}>
              {selectedArticle.author.charAt(0)}
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#202124' }}>
                {selectedArticle.author}
              </h3>
              <div style={{ fontSize: '14px', color: '#1a73e8', fontWeight: '500', marginBottom: '8px' }}>
                {selectedArticle.authorTitle}
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#5f6368', lineHeight: '1.5' }}>
                {selectedArticle.authorBio}
              </p>
            </div>
          </div>

          <AdBanner slotId="9876543210" />
        </article>
      </main>
    );
  }

  // AdBanner Component
  function AdBanner({ slotId }) {
    useEffect(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense push error", e);
      }
    }, []);
  
    return (
      <div style={{ margin: '40px auto', textAlign: 'center', width: '100%', overflow: 'hidden' }}>
        <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Advertisement</p>
        <ins className="adsbygoogle"
             style={{ display: 'block', minHeight: '90px' }}
             data-ad-client="ca-pub-2538738703402430"
             data-ad-slot={slotId || "auto"}
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Roboto, Arial, sans-serif' }}>
      <style>{`
        .blog-header {
          padding: 20px 24px;
          border-bottom: 1px solid #ebebeb;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .blog-search-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .blog-nav {
          display: flex;
          gap: 24px;
          margin-left: 210px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .blog-results {
          padding: 24px;
          max-width: 652px;
          margin-left: max(24px, 210px);
        }
        .studio-btn {
          background: linear-gradient(135deg, #1a73e8, #1557b0);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 24px;
          font-weight: 500;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 5px rgba(26,115,232,0.25);
          outline: none;
        }
        .studio-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(26,115,232,0.35);
        }
        .studio-btn-secondary {
          background: #f1f3f4;
          color: #3c4043;
          border: 1px solid #dadce0;
          box-shadow: none;
        }
        .studio-btn-secondary:hover {
          background: #e8eaed;
          box-shadow: none;
        }
        .studio-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: #f8f9fa;
          border: 1px solid #dadce0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #e8f0fe;
          color: #1a73e8;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .form-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(32, 33, 36, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .form-modal {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14);
          display: flex;
          flex-direction: column;
        }
        .form-header {
          padding: 20px 24px;
          border-bottom: 1px solid #dadce0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .form-body {
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-footer {
          padding: 16px 24px;
          border-top: 1px solid #dadce0;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #f8f9fa;
          border-radius: 0 0 16px 16px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .input-group label {
          font-weight: 500;
          color: #202124;
          font-size: 14px;
        }
        .input-field {
          padding: 10px 14px;
          border: 1px solid #dadce0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          background: #fff;
          color: #202124;
        }
        .input-field:focus {
          border-color: #1a73e8;
        }
        .editor-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          min-height: 300px;
        }
        @media (max-width: 768px) {
          .editor-split {
            grid-template-columns: 1fr;
          }
          .blog-search-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .blog-search-row > div {
            width: 100%;
          }
          .blog-nav {
            margin-left: 0;
            padding-left: 0;
          }
          .blog-results {
            margin-left: auto;
            margin-right: auto;
            padding: 24px 16px;
          }
        }
        .preview-pane {
          border: 1px solid #dadce0;
          border-radius: 8px;
          padding: 14px;
          background: #f8f9fa;
          overflow-y: auto;
          max-height: 400px;
          font-size: 14px;
          line-height: 1.6;
          color: #3c4043;
        }
        .preview-pane h3 {
          margin-top: 20px;
          margin-bottom: 8px;
          font-size: 18px;
          color: #202124;
        }
        .preview-pane p {
          margin-bottom: 12px;
        }
        .tab-btn {
          border: none;
          background: none;
          padding: 8px 16px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          color: #5f6368;
          border-bottom: 2px solid transparent;
        }
        .tab-btn.active {
          color: #1a73e8;
          border-bottom: 2px solid #1a73e8;
        }
      `}</style>
      
      {/* Header / Search Area */}
      <header className="blog-header">
        <div className="blog-search-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={onBack}
              style={{
                background: 'none', border: 'none', color: '#1a0dab',
                cursor: 'pointer', fontSize: '24px', fontWeight: 'bold',
                letterSpacing: '-1px'
              }}
            >
              UNDISCOVEREDPATH
            </button>
            <span style={{ color: '#dadce0', fontSize: '20px' }}>|</span>
            <span style={{ fontSize: '16px', fontWeight: '500', color: '#5f6368' }}>
              {isPublisherMode ? 'Publisher Studio' : 'Engineering Blog'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className={`studio-btn ${isPublisherMode ? 'studio-btn-secondary' : ''}`}
              onClick={() => setIsPublisherMode(!isPublisherMode)}
            >
              {isPublisherMode ? (
                <>
                  <BookOpen size={16} /> Reader Mode
                </>
              ) : (
                <>
                  <Settings size={16} /> Publisher Studio
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Only in Reader Mode) */}
        {!isPublisherMode && (
          <nav className="blog-nav">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: selectedCategory === category ? '3px solid #1a73e8' : '3px solid transparent',
                  color: selectedCategory === category ? '#1a73e8' : '#5f6368',
                  fontSize: '14px',
                  fontWeight: selectedCategory === category ? 'bold' : 'normal',
                  padding: '0 0 10px 0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {category}
              </button>
            ))}
          </nav>
        )}
      </header>

      {isPublisherMode ? (
        /* Publisher Studio View */
        <div className="studio-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '24px', margin: '0 0 8px 0', fontWeight: 'bold', color: '#202124' }}>
                Content Management System
              </h2>
              <p style={{ margin: 0, color: '#5f6368', fontSize: '14px' }}>
                Publish new articles, edit drafts, and view blog metrics dynamically.
              </p>
            </div>
            <button className="studio-btn" onClick={() => handleOpenForm()}>
              <Plus size={18} /> New Article
            </button>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen size={24} />
              </div>
              <div>
                <div style={{ color: '#5f6368', fontSize: '13px' }}>Total Articles</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#202124', marginTop: '4px' }}>
                  {articles.length}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e6f4ea', color: '#137333' }}>
                <Layout size={24} />
              </div>
              <div>
                <div style={{ color: '#5f6368', fontSize: '13px' }}>Custom Articles</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#202124', marginTop: '4px' }}>
                  {customArticles.length}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef7e0', color: '#b06000' }}>
                <Search size={24} />
              </div>
              <div>
                <div style={{ color: '#5f6368', fontSize: '13px' }}>Static Articles</div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#202124', marginTop: '4px' }}>
                  {articles.length - customArticles.length}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Management Table */}
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#202124' }}>
            Custom Published Articles ({customArticles.length})
          </h3>

          {customArticles.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px', 
              border: '2px dashed #dadce0', borderRadius: '12px', background: '#f8f9fa'
            }}>
              <BookOpen size={40} color="#9aa0a6" style={{ marginBottom: '12px' }} />
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#202124' }}>No Custom Articles Published Yet</h4>
              <p style={{ margin: '0 0 20px 0', color: '#5f6368', fontSize: '14px' }}>
                Create your first blog post using the editor to see it appear in the search results.
              </p>
              <button className="studio-btn" style={{ margin: '0 auto' }} onClick={() => handleOpenForm()}>
                <Plus size={16} /> Write First Article
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="article-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customArticles.map(article => (
                    <tr key={article.id}>
                      <td style={{ fontWeight: '500', color: '#202124' }}>{article.title}</td>
                      <td>
                        <span style={{ 
                          background: '#e8f0fe', color: '#1a73e8', 
                          padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '500'
                        }}>
                          {article.category}
                        </span>
                      </td>
                      <td>{article.author}</td>
                      <td style={{ color: '#70757a' }}>{article.date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button 
                            onClick={() => handleOpenForm(article)}
                            style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', padding: '6px' }}
                            title="Edit Article"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            style={{ background: 'none', border: 'none', color: '#d93025', cursor: 'pointer', padding: '6px' }}
                            title="Delete Article"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Reader View (Search Results) */
        <div className="blog-results">
          {/* Custom Search bar right above results */}
          <div style={{ 
            maxWidth: '652px', position: 'relative',
            display: 'flex', alignItems: 'center', background: '#fff',
            border: '1px solid #dfe1e5', borderRadius: '24px', height: '46px',
            padding: '0 14px', marginBottom: '24px', boxShadow: 'none'
          }}>
            <Search size={20} color="#9aa0a6" style={{ marginRight: '10px' }} />
            <input 
              type="text" 
              placeholder="Search engineering blog..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                flex: '1', border: 'none', outline: 'none', 
                fontSize: '16px', color: '#202124', background: 'transparent'
              }} 
            />
          </div>

          <div style={{ color: '#70757a', fontSize: '14px', marginBottom: '24px' }}>
            About {filteredArticles.length} results
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {filteredArticles.map((article) => (
              <article key={article.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', color: '#202124' }}>
                    undiscoveredpath.in &rsaquo; blog &rsaquo; {article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  </span>
                </div>
                
                <h2 style={{ margin: 0, padding: 0 }}>
                  <button
                    onClick={() => setSelectedArticle(article)}
                    style={{
                      background: 'none', border: 'none', padding: 0,
                      color: '#1a0dab', fontSize: '20px', lineHeight: '1.3',
                      textAlign: 'left', cursor: 'pointer', textDecoration: 'none',
                      fontWeight: '400', display: 'inline-block'
                    }}
                    onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    {article.title}
                  </button>
                </h2>
                
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', lineHeight: '1.58', color: '#4d5156' }}>
                  <span style={{ color: '#70757a' }}>{article.date} — </span>
                  {article.excerpt}
                </p>
              </article>
            ))}
          </div>

          <AdBanner slotId="8765432109" />

          {filteredArticles.length === 0 && (
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '16px', color: '#202124' }}>
                Your search - <strong>{searchQuery}</strong> - did not match any documents.
              </p>
              <p style={{ marginTop: '16px', color: '#4d5156', fontSize: '14px' }}>Suggestions:</p>
              <ul style={{ color: '#4d5156', fontSize: '14px', paddingLeft: '24px' }}>
                <li>Make sure all words are spelled correctly.</li>
                <li>Try different keywords.</li>
                <li>Try more general keywords.</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal Overlay */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-modal">
            <div className="form-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#202124' }}>
                {editingArticle ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: '#5f6368', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-body">
                <div className="input-group">
                  <label>Article Title</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Enter a descriptive title..."
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="input-group">
                    <label>Category</label>
                    <select 
                      className="input-field"
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                    >
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Railway Safety">Railway Safety</option>
                      <option value="IoT & Hardware">IoT & Hardware</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Company News">Company News</option>
                      <option value="Custom">Custom Category...</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Author</label>
                    <select 
                      className="input-field"
                      value={formAuthor}
                      onChange={e => setFormAuthor(e.target.value)}
                    >
                      <option value="Sarah Jenkins">Sarah Jenkins (AI)</option>
                      <option value="David Chen">David Chen (Backend)</option>
                      <option value="Dr. Elena Rostova">Dr. Elena Rostova (Safety)</option>
                      <option value="Custom">Custom Author...</option>
                    </select>
                  </div>
                </div>

                {formCategory === 'Custom' && (
                  <div className="input-group">
                    <label>Custom Category Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. Data Science, Operations"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      required 
                    />
                  </div>
                )}

                {formAuthor === 'Custom' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #dadce0' }}>
                    <div className="input-group">
                      <label>Author Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. John Miller"
                        value={customAuthor}
                        onChange={e => setCustomAuthor(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="input-group">
                      <label>Author Professional Title</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Infrastructure Engineer"
                        value={customAuthorTitle}
                        onChange={e => setCustomAuthorTitle(e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label>Author Biography</label>
                      <textarea 
                        className="input-field" 
                        rows={2}
                        placeholder="Short bio detailing expertise..."
                        value={customAuthorBio}
                        onChange={e => setCustomAuthorBio(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label>Excerpt / Summary</label>
                  <textarea 
                    className="input-field" 
                    rows={2}
                    placeholder="Provide a brief summary of the article..."
                    value={formExcerpt}
                    onChange={e => setFormExcerpt(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Content (HTML Supported)</label>
                    <div style={{ display: 'flex', borderBottom: '1px solid #dadce0' }}>
                      <button 
                        type="button" 
                        className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
                        onClick={() => setActiveTab('write')}
                      >
                        Write
                      </button>
                      <button 
                        type="button" 
                        className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                      >
                        Preview
                      </button>
                    </div>
                  </div>

                  {activeTab === 'write' ? (
                    <textarea 
                      className="input-field" 
                      rows={10}
                      style={{ fontFamily: 'monospace' }}
                      placeholder="<p>Write your article body here. You can use standard HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;strong&gt;, etc.</p>"
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      required 
                    />
                  ) : (
                    <div 
                      className="preview-pane"
                      dangerouslySetInnerHTML={{ 
                        __html: formContent || '<p style="color:#70757a; font-style:italic;">Nothing to preview yet. Start typing in the Write tab!</p>' 
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="form-footer">
                <button 
                  type="button" 
                  className="studio-btn studio-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="studio-btn">
                  {editingArticle ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
