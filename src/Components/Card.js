import React from 'react'

const Card = ({data}) => {
     console.log(data);

     const handleCardClick = (url) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer')
        }
     }
     
  return (
    <div className='cardContainer'>
    {data.map((curItem,index)=>{
        if(!curItem.urlToImage){
            return null
        }else{
            return(
            <div key={index} className='card' onClick={() => handleCardClick(curItem.url)}>
                <img src={curItem.urlToImage} alt={curItem.title}/>
                <div className='content'>
                    <h3 className='title'>{curItem.title}</h3>
                    <p>{curItem.description}</p>
                    <button onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick(curItem.url)
                    }}>Read More</button>
                </div>
            </div>
        )
        }
         
    })}
    </div>
  )
}

export default Card