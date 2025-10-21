import React, { useEffect, useState } from 'react'

const ScrollingBanner = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (isPaused) return
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)
        }, 4000) // Change slide every 4 seconds

        return () => clearInterval(interval)
    }, [data.length, isPaused])

    const getTimeAgo = (publishedAt) => {
        const now = new Date()
        const published = new Date(publishedAt)
        const diffInDays = Math.floor((now - published) / (1000 * 60 * 60 * 24))
        
        if (diffInDays === 0) return 'Today'
        if (diffInDays === 1) return '1 day ago'
        if (diffInDays < 7) return `${diffInDays} days ago`
        if (diffInDays < 14) return '1 week ago'
        if (diffInDays < 21) return '2 weeks ago'
        if (diffInDays < 28) return '3 weeks ago'
        return `${Math.floor(diffInDays / 7)} weeks ago`
    }

    const handleDotClick = (index) => {
        setCurrentIndex(index)
        setIsPaused(true)
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsPaused(false), 10000)
    }

    const handleSlideClick = (url) => {
        if (url) {
            window.open(url, '_blank')
        }
    }

    return (
        <div className="scrolling-banner">
            <div className="banner-container">
                <div 
                    className="banner-slides"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {data.map((item, index) => (
                        <div key={index} className="banner-slide">
                            <div 
                                className="slide-image"
                                onClick={() => handleSlideClick(item.url)}
                                style={{ cursor: item.url ? 'pointer' : 'default' }}
                            >
                                <img 
                                    src={item.urlToImage || 'https://via.placeholder.com/800x400/667eea/ffffff?text=No+Image'} 
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x400/667eea/ffffff?text=No+Image'
                                    }}
                                />
                                <div className="slide-overlay">
                                    <div className="slide-content">
                                        <h3>{item.title}</h3>
                                        <div className="slide-meta">
                                            <span>WorldStartupNews</span>
                                            <span>{getTimeAgo(item.publishedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    )
}

export default ScrollingBanner
