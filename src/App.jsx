import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, RotateCcw, Sparkles } from 'lucide-react';

const CatSwipeApp = () => {
  const [cats, setCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCats, setLikedCats] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  // Generate 15 unique cat images
  useEffect(() => {
    const catImages = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      url: `https://cataas.com/cat?width=500&height=600&${Date.now()}_${i}`,
    }));
    setCats(catImages);
  }, []);

  // Preload next image
  useEffect(() => {
    if (currentIndex < cats.length) {
      setImageLoaded(false);
      const img = new Image();
      img.src = cats[currentIndex].url;
      img.onload = () => setImageLoaded(true);
    }
  }, [currentIndex, cats]);

  const handleDragStart = (e) => {
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    setDragStart({ x: clientX, y: clientY });
    setIsDragging(true);
  };

  const handleDragMove = (e) => {
    if (!dragStart) return;
    
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!dragStart) return;
    
    const swipeThreshold = 100;
    
    if (Math.abs(dragOffset.x) > swipeThreshold) {
      if (dragOffset.x > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }
    
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleLike = () => {
    if (currentIndex < cats.length) {
      setLikedCats([...likedCats, cats[currentIndex]]);
      nextCat();
    }
  };

  const handleDislike = () => {
    if (currentIndex < cats.length) {
      nextCat();
    }
  };

  const nextCat = () => {
    if (currentIndex + 1 >= cats.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setLikedCats([]);
    setShowSummary(false);
    setDragOffset({ x: 0, y: 0 });
    setDragStart(null);
  };

  const rotation = dragOffset.x * 0.15;
  const scale = Math.max(0.85, 1 - Math.abs(dragOffset.x) / 500);

  if (showSummary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
              Results
            </div>
            <h2 className="text-4xl font-black text-gray-800 mb-3">Your Matches! 🐱</h2>
            <p className="text-xl text-gray-600">
              You liked <span className="text-pink-600 font-bold">{likedCats.length}</span> out of <span className="font-bold">{cats.length}</span> kitties
            </p>
          </div>
          
          {likedCats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {likedCats.map((cat, index) => (
                <div 
                  key={cat.id} 
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-pink-100"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`
                  }}
                >
                  <img
                    src={cat.url}
                    alt={`Liked cat ${cat.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-1.5 shadow-lg">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl mb-8">
              <p className="text-2xl text-gray-400 mb-2">No matches yet 😿</p>
              <p className="text-gray-500">Try being less picky next time!</p>
            </div>
          )}
          
          <button
            onClick={handleRestart}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  if (cats.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4 text-6xl">🐱</div>
          <div className="text-xl text-gray-600 font-medium">Loading adorable cats...</div>
        </div>
      </div>
    );
  }

  const currentCat = cats[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-4 flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-6 h-6 text-pink-500" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Kitty Match
            </h1>
            <Sparkles className="w-6 h-6 text-pink-500" />
          </div>
          <p className="text-gray-600 font-medium">Swipe to find your purr-fect match</p>
          
          {/* Progress */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-pink-100">
              <span className="text-pink-600 font-bold text-sm">{currentIndex + 1}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-600 font-bold text-sm">{cats.length}</span>
            </div>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative h-[550px] mb-6">
          {/* Background cards */}
          {currentIndex + 2 < cats.length && (
            <div className="absolute inset-x-4 inset-y-4 bg-white rounded-3xl shadow-sm transform scale-90 opacity-30 border border-gray-100" />
          )}
          {currentIndex + 1 < cats.length && (
            <div className="absolute inset-x-2 inset-y-2 bg-white rounded-3xl shadow-md transform scale-95 border border-gray-100" />
          )}
          
          {/* Main Card */}
          <div
            ref={cardRef}
            className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border-4 border-white"
            style={{
              transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
              transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center">
                <div className="text-6xl animate-bounce">🐱</div>
              </div>
            )}
            
            {/* Cat Image */}
            <img
              src={currentCat.url}
              alt={`Cat ${currentCat.id}`}
              className="w-full h-full object-cover pointer-events-none"
              draggable="false"
              style={{ opacity: imageLoaded ? 1 : 0 }}
            />
            
            {/* Swipe Indicators */}
            {isDragging && dragOffset.x > 30 && (
              <div
                className="absolute top-10 right-10 bg-green-500 text-white px-6 py-3 rounded-2xl font-black text-xl transform rotate-12 shadow-2xl border-4 border-white"
                style={{ 
                  opacity: Math.min(1, dragOffset.x / 120),
                  transform: `rotate(12deg) scale(${1 + Math.min(0.3, dragOffset.x / 500)})`
                }}
              >
                ❤️ LIKE
              </div>
            )}
            
            {isDragging && dragOffset.x < -30 && (
              <div
                className="absolute top-10 left-10 bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-xl transform -rotate-12 shadow-2xl border-4 border-white"
                style={{ 
                  opacity: Math.min(1, -dragOffset.x / 120),
                  transform: `rotate(-12deg) scale(${1 + Math.min(0.3, -dragOffset.x / 500)})`
                }}
              >
                ✕ NOPE
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleDislike}
            className="group bg-white p-5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-gray-100"
            aria-label="Dislike"
          >
            <X className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" strokeWidth={3} />
          </button>
          
          <div className="text-center px-4">
            <div className="text-sm font-medium text-gray-500">Swipe left or right</div>
          </div>
          
          <button
            onClick={handleLike}
            className="group bg-gradient-to-br from-pink-500 to-rose-500 p-5 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200"
            aria-label="Like"
          >
            <Heart className="w-8 h-8 text-white group-hover:scale-110 transition-transform" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatSwipeApp;