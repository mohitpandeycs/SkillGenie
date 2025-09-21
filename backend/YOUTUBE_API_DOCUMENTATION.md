# YouTube API Integration Documentation

## Overview

This document describes the YouTube API integration for SkillGenie, which provides video recommendations with comprehensive privacy controls and educational content filtering.

## Features

### 🎥 Core Functionality
- **Video Search**: Search for videos with advanced filtering options
- **Skill-based Recommendations**: Get curated video recommendations based on specific skills and levels
- **Trending Educational Content**: Discover trending videos in educational categories
- **Privacy Controls**: Comprehensive privacy settings and content filtering
- **Bulk Operations**: Process multiple skill recommendations in a single request

### 🔒 Privacy Features
- **Safe Search**: Strict content filtering (strict/moderate/none)
- **Region-based Results**: Localized content based on region codes
- **Content Sanitization**: Automatic removal of sensitive information from titles and descriptions
- **Data Minimization**: Limited data collection and processing
- **Age-appropriate Content**: Educational content filtering
- **Embeddable Content Control**: Filter for embeddable videos only

## API Endpoints

### 1. Video Search
```
GET /api/youtube/search
```

**Query Parameters:**
- `q` (required): Search query (1-100 characters)
- `maxResults` (optional): Maximum results (1-50, default: 25)
- `order` (optional): Sort order (relevance, date, rating, viewCount, title)
- `safeSearch` (optional): Safe search setting (strict, moderate, none)
- `regionCode` (optional): 2-letter country code
- `relevanceLanguage` (optional): Language code for relevance
- `publishedAfter` (optional): ISO 8601 date
- `publishedBefore` (optional): ISO 8601 date
- `videoDuration` (optional): Duration filter (any, short, medium, long)
- `videoDefinition` (optional): Definition filter (any, high, standard)
- `channelId` (optional): Specific channel ID

**Example Request:**
```bash
GET /api/youtube/search?q=JavaScript%20tutorial&maxResults=10&safeSearch=strict&order=relevance
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "videos": [
      {
        "id": "dQw4w9WgXcQ",
        "title": "JavaScript Tutorial for Beginners",
        "description": "Learn JavaScript fundamentals...",
        "thumbnail": {
          "default": "https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg",
          "medium": "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
          "high": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
        },
        "channel": {
          "id": "UCChannelId",
          "title": "Programming Channel"
        },
        "publishedAt": "2023-01-15T10:00:00Z",
        "duration": "PT15M30S",
        "viewCount": "1000000",
        "likeCount": "50000",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
        "privacyInfo": {
          "safeContent": true,
          "ageAppropriate": true,
          "educationalContent": true,
          "dataMinimized": true
        }
      }
    ],
    "totalResults": 1000000,
    "resultsPerPage": 10,
    "privacySettings": {
      "safeSearch": "strict",
      "regionCode": "US",
      "contentFiltering": true,
      "dataMinimization": true
    }
  },
  "query": "JavaScript tutorial",
  "timestamp": "2023-12-07T10:00:00Z"
}
```

### 2. Skill-based Recommendations
```
GET /api/youtube/recommendations/skill/:skill
```

**Parameters:**
- `skill` (required): Skill name (URL parameter)
- `level` (optional): Skill level (beginner, intermediate, advanced)
- `safeSearch` (optional): Safe search setting
- `regionCode` (optional): Region code

**Example Request:**
```bash
GET /api/youtube/recommendations/skill/Python?level=beginner&safeSearch=strict
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "skill": "Python",
    "level": "beginner",
    "recommendations": [
      {
        "id": "video_id_1",
        "title": "Python Basics Tutorial",
        "description": "Learn Python fundamentals...",
        "thumbnail": { "...": "..." },
        "channel": { "...": "..." },
        "publishedAt": "2023-01-15T10:00:00Z",
        "duration": "PT20M15S",
        "viewCount": "500000",
        "url": "https://www.youtube.com/watch?v=video_id_1",
        "privacyInfo": { "...": "..." }
      }
    ],
    "privacyCompliant": true,
    "contentFiltered": true
  },
  "timestamp": "2023-12-07T10:00:00Z"
}
```

### 3. Trending Educational Videos
```
GET /api/youtube/trending/:category
```

**Parameters:**
- `category` (required): Category name (URL parameter)
- `safeSearch` (optional): Safe search setting
- `regionCode` (optional): Region code

**Available Categories:**
- technology, programming, data-science, machine-learning
- artificial-intelligence, web-development, mobile-development
- cybersecurity, cloud-computing, devops, business, marketing
- finance, entrepreneurship, leadership, project-management
- design, ui-ux, graphic-design, science, mathematics
- physics, chemistry, biology, engineering, languages
- communication, soft-skills, productivity

**Example Request:**
```bash
GET /api/youtube/trending/technology?safeSearch=strict&regionCode=US
```

### 4. Video Details
```
GET /api/youtube/video/:videoId
```

**Parameters:**
- `videoId` (required): YouTube video ID (11 characters)

**Example Request:**
```bash
GET /api/youtube/video/dQw4w9WgXcQ
```

### 5. Privacy Settings Management
```
GET /api/youtube/privacy-settings
PUT /api/youtube/privacy-settings
```

**GET Response:**
```json
{
  "success": true,
  "data": {
    "safeSearch": "strict",
    "regionCode": "US",
    "relevanceLanguage": "en",
    "maxResults": 25,
    "videoDuration": "any",
    "videoDefinition": "any",
    "videoLicense": "any",
    "videoEmbeddable": "any",
    "videoSyndicated": "any",
    "eventType": "any"
  },
  "timestamp": "2023-12-07T10:00:00Z"
}
```

**PUT Request Body:**
```json
{
  "safeSearch": "strict",
  "regionCode": "US",
  "maxResults": 20,
  "videoDuration": "medium"
}
```

### 6. Bulk Skill Recommendations
```
POST /api/youtube/bulk-recommendations
```

**Request Body:**
```json
{
  "skills": [
    {
      "skill": "JavaScript",
      "level": "beginner"
    },
    {
      "skill": "Python",
      "level": "intermediate"
    },
    {
      "skill": "React",
      "level": "advanced"
    }
  ],
  "privacyOptions": {
    "safeSearch": "strict",
    "regionCode": "US"
  }
}
```

### 7. Available Categories
```
GET /api/youtube/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "technology",
        "name": "Technology",
        "slug": "technology"
      },
      {
        "id": "programming",
        "name": "Programming",
        "slug": "programming"
      }
    ]
  },
  "timestamp": "2023-12-07T10:00:00Z"
}
```

## Environment Configuration

Add the following to your `.env` file:

```env
# YouTube API Configuration
YOUTUBE_API_KEY=your-youtube-api-key-here
```

## Privacy and Security Features

### 1. Content Filtering
- **Safe Search**: Automatically filters inappropriate content
- **Educational Focus**: Prioritizes educational and learning content
- **Age Appropriateness**: Ensures content is suitable for all ages

### 2. Data Protection
- **Data Minimization**: Only collects necessary video metadata
- **Content Sanitization**: Removes sensitive information from descriptions
- **Privacy-first Design**: No user tracking or personal data collection

### 3. Regional Compliance
- **Localized Results**: Respects regional content restrictions
- **Language Preferences**: Supports multiple languages and regions
- **Cultural Sensitivity**: Filters content based on regional standards

## Usage Examples

### Basic Video Search
```javascript
const response = await fetch('/api/youtube/search?q=React hooks tutorial&maxResults=5');
const data = await response.json();
console.log(data.data.videos);
```

### Get Skill Recommendations
```javascript
const response = await fetch('/api/youtube/recommendations/skill/Node.js?level=intermediate');
const data = await response.json();
console.log(data.data.recommendations);
```

### Bulk Skill Recommendations
```javascript
const response = await fetch('/api/youtube/bulk-recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    skills: [
      { skill: 'JavaScript', level: 'beginner' },
      { skill: 'Python', level: 'intermediate' }
    ],
    privacyOptions: {
      safeSearch: 'strict',
      regionCode: 'US'
    }
  })
});
const data = await response.json();
```

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (development only)",
  "timestamp": "2023-12-07T10:00:00Z"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting to ensure fair usage:
- **Window**: 15 minutes
- **Limit**: 100 requests per IP per window
- **Headers**: Rate limit information in response headers

## Testing

Run the test suite to verify the integration:

```bash
node test-youtube.js
```

This will test:
1. Basic video search functionality
2. Skill-based recommendations
3. Trending educational videos
4. Privacy settings management
5. Search with privacy options

## Dependencies

Required npm packages:
- `googleapis`: YouTube API client
- `express-validator`: Request validation
- `express`: Web framework

## Best Practices

### 1. API Usage
- Always include appropriate error handling
- Use pagination for large result sets
- Implement client-side caching for better performance
- Respect rate limits and implement exponential backoff

### 2. Privacy Compliance
- Always use `safeSearch: 'strict'` for educational content
- Implement user consent for data collection
- Regularly audit privacy settings
- Document data usage and retention policies

### 3. Performance Optimization
- Cache frequently requested content
- Use appropriate `maxResults` values
- Implement lazy loading for video thumbnails
- Monitor API quota usage

## Support and Maintenance

### Monitoring
- API response times and error rates
- YouTube API quota usage
- Privacy compliance metrics
- User engagement with recommended content

### Updates
- Regular security updates for dependencies
- YouTube API version compatibility
- Privacy policy updates
- Feature enhancements based on user feedback

## License and Compliance

This integration complies with:
- YouTube API Terms of Service
- GDPR and privacy regulations
- Educational content guidelines
- Regional content restrictions

For questions or support, please refer to the main project documentation or contact the development team.
