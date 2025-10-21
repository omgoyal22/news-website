import React, { useEffect, useState } from 'react'
import Card from './Card'
import ScrollingBanner from './ScrollingBanner'

const Newsapp = () => {
    const [search, setSearch] = useState("startups");
    const [newsData, setNewsData] = useState(null)
    const [featuredNews, setFeaturedNews] = useState(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false)
    const [activeCategory, setActiveCategory] = useState("startups")
    const API_KEY = "9c3ed8ee95884dec979460a60f96675b";

    // Real-time date and time fetching
    useEffect(() => {
        const updateDateTime = () => {
            setCurrentDate(new Date())
        }
        
        // Update every second for real-time clock
        const interval = setInterval(updateDateTime, 1000)
        
        return () => clearInterval(interval)
    }, [])

    const getData = async(searchTerm = search) => {
        setIsLoading(true)
        try {
            // Enhanced search terms for startup-focused content
            const enhancedSearchTerm = `${searchTerm} startup unicorn funding venture capital tech innovation`
            const response = await fetch(`https://newsapi.org/v2/everything?q=${enhancedSearchTerm}&sortBy=publishedAt&language=en&apiKey=${API_KEY}`);
            const jsonData = await response.json();
            console.log('NewsAPI Response:', jsonData);
            
            if (jsonData.articles && jsonData.articles.length > 0) {
                let dt = jsonData.articles.slice(0,10)
                console.log('Setting news data:', dt.length, 'articles')
                setNewsData(dt)
            } else {
                console.warn('No articles found in NewsAPI response');
                setNewsData([])
            }
        } catch (error) {
            console.error('Error fetching news:', error)
            setNewsData([])
        } finally {
            setIsLoading(false)
        }
    }

    const getFeaturedData = async() => {
        try {
            // Fetch startup-focused featured news
            const response = await fetch(`https://newsapi.org/v2/everything?q=startup technology entrepreneurs funding&sortBy=publishedAt&language=en&apiKey=${API_KEY}`);
            const jsonData = await response.json();
            console.log('Featured News Response:', jsonData);
            
            if (jsonData.articles && jsonData.articles.length > 0) {
                let featured = jsonData.articles.slice(0,5)
                console.log('Setting featured data:', featured.length, 'articles')
                setFeaturedNews(featured)
            } else {
                console.warn('No featured articles found in NewsAPI response');
                setFeaturedNews([])
            }
        } catch (error) {
            console.error('Error fetching featured news:', error)
            setFeaturedNews([])
        }
    }

    useEffect(() => {
        getData()
        getFeaturedData()
    }, [])

    const handleInput = (e) => {
        console.log(e.target.value);
        setSearch(e.target.value)
    }

    const userInput = (event) => {
        const searchTerm = event.target.value
        setSearch(searchTerm)
        setActiveCategory(searchTerm)
        getData(searchTerm)
    }

    // Handle navigation category clicks
    const handleCategoryClick = (category) => {
        let searchTerm = ""
        switch(category) {
            case "internet-startups":
                searchTerm = "startups"
                break
            case "financial-companies":
                searchTerm = "fintech"
                break
            case "healthcare":
                searchTerm = "healthcare"
                break
            default:
                searchTerm = "startups"
        }
        
        setSearch(searchTerm)
        setActiveCategory(category)
        getData(searchTerm)
    }

    // Handle news item clicks
    const handleNewsClick = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
        }
    }

  return (
    <div className="news-app">
        {/* Top Date Bar */}
        <div className="date-bar">
            <span>{currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}</span>
            <span className="current-time">
                {currentDate.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    hour12: true 
                })}
            </span>
        </div>

        {/* Hero Banner */}
        <div className="hero-banner">
            <div className="hero-content">
                <h1>Global News Center</h1>
                <p>SUCCESS STORIES</p>
            </div>
        </div>

        {/* Navigation Bar */}
        <nav className="main-nav">
            <div className="nav-links">
                <a 
                    href="#" 
                    className={`nav-link ${activeCategory === 'internet-startups' ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault()
                        handleCategoryClick('internet-startups')
                    }}
                >
                    Internet Startups
                </a>
                <a 
                    href="#" 
                    className={`nav-link ${activeCategory === 'financial-companies' ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault()
                        handleCategoryClick('financial-companies')
                    }}
                >
                    Financial Companies
                </a>
                <a 
                    href="#" 
                    className={`nav-link ${activeCategory === 'healthcare' ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault()
                        handleCategoryClick('healthcare')
                    }}
                >
                    Healthcare
                </a>
            </div>
            <div className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
            </div>
        </nav>

        {/* Flash Story Banner */}
        <div className="flash-story">
            <div className="flash-button">
                <span>FLASH STORY</span>
            </div>
            <div className="news-ticker">
                {newsData && newsData.slice(0,3).map((item, index) => (
                    <span key={index} className="ticker-item">
                        {item.title}
                    </span>
                ))}
            </div>
        </div>

        {/* Scrolling Banner */}
        {featuredNews && <ScrollingBanner data={featuredNews} />}

        {/* Main Content */}
        <div className="main-content">
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading latest news...</p>
                </div>
            ) : newsData && newsData.length > 0 ? (
                <div className="content-grid">
                    <div className="editor-picks">
                        <h3>Editor's Picks</h3>
                        {newsData && newsData.slice(0,2).map((item, index) => (
                            <div key={index} className="pick-item" onClick={() => handleNewsClick(item.url)}>
                                <img src={item.urlToImage || 'https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image'} alt={item.title} />
                                <div className="pick-content">
                                    <h4>{item.title}</h4>
                                    <p>{item.source.name} • {new Date(item.publishedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="main-story">
                        <h3>Main Story</h3>
                        {newsData && newsData[0] && (
                            <div className="main-story-item" onClick={() => handleNewsClick(newsData[0].url)}>
                                <img src={newsData[0].urlToImage || 'https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image'} alt={newsData[0].title} />
                                <div className="main-story-content">
                                    <h4>{newsData[0].title}</h4>
                                    <p>{newsData[0].description}</p>
                                    <span>{newsData[0].source.name} • {new Date(newsData[0].publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="trending">
                        <h3>Trending Story</h3>
                        {newsData && newsData.slice(0,3).map((item, index) => (
                            <div key={index} className="trending-item" onClick={() => handleNewsClick(item.url)}>
                                <span className="trending-number">{index + 1}</span>
                                <img src={item.urlToImage || 'https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image'} alt={item.title} />
                                <div className="trending-content">
                                    <h5>{item.title}</h5>
                                    <span>{item.source.name} • {new Date(item.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>No news available. Trying to fetch latest updates...</p>
                </div>
            )}
        </div>

        {/* Featured Story Section */}
        <div className="featured-section">
            <h3>Featured Story</h3>
            <div className="featured-grid">
                {newsData && newsData.slice(0,5).map((item, index) => (
                    <div key={index} className="featured-card" onClick={() => handleNewsClick(item.url)}>
                        <img src={item.urlToImage} alt={item.title} />
                        <div className="featured-content">
                            <h5>{item.title}</h5>
                            <span>{item.source.name} • {new Date(item.publishedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Search and Categories */}
        <div className="search-section">
            <div className='searchBar'>
                <input type='text' placeholder='Search News' value={search} onChange={handleInput}/>
                <button onClick={getData}>Search</button>
            </div>
            <div className='categoryBtn'>
                <button onClick={userInput} value="technology startups">Technology</button>
                <button onClick={userInput} value="business startups">Business</button>
                <button onClick={userInput} value="finance startups">Finance</button>
                <button onClick={userInput} value="healthcare startups">Healthcare</button>
                <button onClick={userInput} value="innovation startups">Innovation</button>
            </div>
        </div>

    </div>
  )
}

export default Newsapp