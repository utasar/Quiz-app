import axios from 'axios';
import { config } from '../config/config';

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  publishedAt: string;
  source: string;
}

export class NewsService {
  private apiKey: string;
  private baseUrl = 'https://newsapi.org/v2';

  constructor() {
    this.apiKey = config.newsApiKey;
  }

  async getTopHeadlines(country: string = 'us', category?: string): Promise<NewsArticle[]> {
    if (!this.apiKey) {
      console.warn('News API key not configured');
      return this.getMockNews();
    }

    try {
      const params: any = {
        apiKey: this.apiKey,
        country,
        pageSize: 10
      };

      if (category) {
        params.category = category;
      }

      const response = await axios.get(`${this.baseUrl}/top-headlines`, { params });
      
      return response.data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name
      }));
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.getMockNews();
    }
  }

  private getMockNews(): NewsArticle[] {
    return [
      {
        title: 'Global Climate Summit Concludes with New Agreements',
        description: 'World leaders agree on new climate action plans',
        content: 'The global climate summit concluded today with significant agreements on emissions reduction...',
        url: 'https://example.com/climate',
        publishedAt: new Date().toISOString(),
        source: 'Global News'
      },
      {
        title: 'Technology Breakthrough in Renewable Energy',
        description: 'Scientists develop more efficient solar panels',
        content: 'Researchers have announced a major breakthrough in solar panel efficiency...',
        url: 'https://example.com/tech',
        publishedAt: new Date().toISOString(),
        source: 'Tech Today'
      }
    ];
  }
}

export const newsService = new NewsService();
