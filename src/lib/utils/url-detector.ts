/**
 * URL Detection Utilities
 * Distinguishes between X Articles and standard tweets
 */

export type ContentType = "tweet" | "article";

export interface ParsedUrl {
  type: ContentType;
  tweetId: string | null;
  articleId: string | null;
  isValid: boolean;
}

/**
 * Detects if URL is a standard X/Twitter post or an X Article
 */
export function detectContentType(url: string): ParsedUrl {
  // X Article URL pattern: https://x.com/username/articles/[articleId]
  const articlePattern = /x\.com\/\w+\/articles\/(\d+)/;

  // Tweet URL patterns
  const tweetPatterns = [
    /x\.com\/\w+\/status\/(\d+)/,
    /twitter\.com\/\w+\/status\/(\d+)/,
    /mobile\.twitter\.com\/\w+\/status\/(\d+)/,
  ];

  // Check for X Article first
  const articleMatch = url.match(articlePattern);
  if (articleMatch) {
    return {
      type: "article",
      tweetId: null,
      articleId: articleMatch[1],
      isValid: true,
    };
  }

  // Check for tweets
  for (const pattern of tweetPatterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        type: "tweet",
        tweetId: match[1],
        articleId: null,
        isValid: true,
      };
    }
  }

  return {
    type: "tweet",
    tweetId: null,
    articleId: null,
    isValid: false,
  };
}

/**
 * Extracts the ID from a tweet or article URL
 */
export function extractId(url: string): string | null {
  const result = detectContentType(url);
  return result.tweetId || result.articleId;
}
