import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { blogArticles } from './blogData';

// Google Search Style Blog
export const BlogSection = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ['All', ...new Set(blogArticles.map(article => article.category))];

  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        @media (max-width: 768px) {
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
      `}</style>
      
      {/* Header / Search Area */}
      <header className="blog-header">
        <div className="blog-search-row">
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
          
          <div style={{ 
            flex: '1', maxWidth: '692px', position: 'relative',
            display: 'flex', alignItems: 'center', background: '#fff',
            border: '1px solid #dfe1e5', borderRadius: '24px', height: '46px',
            padding: '0 14px', boxShadow: 'none'
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
        </div>

        {/* Navigation Tabs */}
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
      </header>
      
      {/* Search Results */}
      <div className="blog-results">
        <div style={{ color: '#70757a', fontSize: '14px', marginBottom: '24px' }}>
          About {filteredArticles.length} results
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {filteredArticles.map((article) => (
            <article key={article.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                <span style={{ fontSize: '14px', color: '#202124' }}>
                  undiscoveredpath.in &rsaquo; blog &rsaquo; {article.category.toLowerCase().replace(/ /g, '-')}
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
    </main>
  );
};
