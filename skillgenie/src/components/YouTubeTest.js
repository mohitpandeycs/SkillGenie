import React, { useState, useEffect } from 'react';
import { Play, Video, ExternalLink, Loader } from 'lucide-react';
import youtubeService from '../services/youtubeService';

const YouTubeTest = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testYouTubeIntegration = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing YouTube integration...');
      
      // Test skill recommendations
      const result = await youtubeService.getSkillRecommendations('Python', 'beginner');
      console.log('YouTube API Result:', result);
      
      if (result.success && result.data.recommendations) {
        setVideos(result.data.recommendations);
        console.log('Videos loaded:', result.data.recommendations.length);
      } else {
        setError('Failed to load videos');
      }
    } catch (err) {
      console.error('YouTube test error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testYouTubeIntegration();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">YouTube Integration Test</h2>
      
      <button 
        onClick={testYouTubeIntegration}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Test YouTube API'}
      </button>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-8 h-8 animate-spin text-blue-500 mr-3" />
          <span className="text-gray-600">Loading YouTube videos...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          Error: {error}
        </div>
      )}

      {videos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Found {videos.length} Python Tutorial Videos:
          </h3>
          
          {videos.map((video, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => youtubeService.openVideo(video.id)}
            >
              <div className="relative flex-shrink-0">
                <img 
                  src={youtubeService.getThumbnailUrl(video.thumbnail, 'medium')} 
                  alt={video.title}
                  className="w-24 h-18 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA5NiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9IjcyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zOSA0OEwzOSAyNEw1NyAzNkwzOSA0OFoiIGZpbGw9IiM2QjczODAiLz4KPC9zdmc+';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {video.title}
                </h4>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-1">
                  <Video className="w-4 h-4" />
                  <span>YouTube</span>
                  {video.duration && (
                    <span>• {youtubeService.formatDuration(video.duration)}</span>
                  )}
                  {video.viewCount && (
                    <span>• {youtubeService.formatViewCount(video.viewCount)}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{video.channel?.title}</p>
                {video.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
              
              <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-center p-8 text-gray-500">
          No videos found. Click "Test YouTube API" to load videos.
        </div>
      )}
    </div>
  );
};

export default YouTubeTest;
