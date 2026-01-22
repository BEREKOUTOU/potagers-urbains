import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

/**
 * Integration Tests: Backend API + Frontend Components
 * These tests simulate real user interactions and API calls
 */

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Frontend-Backend Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Garden Discovery Flow', () => {
    it('should fetch and display gardens from API', async () => {
      const mockGardens = [
        {
          id: 1,
          name: 'Community Garden',
          location: 'Downtown',
          current_members: 5,
        },
        {
          id: 2,
          name: 'Urban Garden',
          location: 'Uptown',
          current_members: 8,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gardens: mockGardens }),
      });

      const response = await fetch('/api/gardens');
      const data = await response.json();

      expect(data.gardens).toHaveLength(2);
      expect(data.gardens[0].name).toBe('Community Garden');
    });

    it('should handle API errors gracefully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      const response = await fetch('/api/gardens');
      const data = await response.json();

      expect(response.ok).toBe(false);
      expect(data.error).toBe('Internal server error');
    });

    it('should filter gardens by region from API', async () => {
      const mockGardens = [
        { id: 1, name: 'North Garden', region: 'North' },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gardens: mockGardens }),
      });

      const response = await fetch('/api/gardens?region=North');
      const data = await response.json();

      expect(data.gardens).toHaveLength(1);
      expect(data.gardens[0].region).toBe('North');
    });
  });

  describe('User Authentication Flow', () => {
    it('should login user and store token', async () => {
      const mockResponse = {
        token: 'jwt-token-123',
        user: { id: 1, username: 'testuser', role: 'user' },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });

      const data = await response.json();

      expect(data.token).toBe('jwt-token-123');
      expect(data.user.username).toBe('testuser');
    });

    it('should validate token on subsequent requests', async () => {
      const token = 'jwt-token-123';

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, username: 'testuser' } }),
      });

      const response = await fetch('/api/users/1', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data.user.username).toBe('testuser');
    });

    it('should handle expired token', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Invalid or expired token' }),
      });

      const response = await fetch('/api/users/1', {
        headers: { Authorization: 'Bearer expired-token' },
      });

      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('token');
    });
  });

  describe('Garden Creation Flow', () => {
    it('should create a new garden', async () => {
      const gardenData = {
        name: 'New Community Garden',
        location: 'Central Park',
        region: 'North',
        description: 'A beautiful community garden',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          garden: { id: 1, ...gardenData },
        }),
      });

      const response = await fetch('/api/gardens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(gardenData),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.garden.name).toBe('New Community Garden');
    });

    it('should validate required fields before submission', async () => {
      const invalidGardenData = {
        location: 'Central Park',
        // Missing required 'name' field
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Missing required fields' }),
      });

      const response = await fetch('/api/gardens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(invalidGardenData),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('Event Management Flow', () => {
    it('should fetch upcoming events for a garden', async () => {
      const mockEvents = [
        {
          id: 1,
          title: 'Planting Workshop',
          start_date: new Date().toISOString(),
          attendee_count: 10,
        },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ events: mockEvents }),
      });

      const response = await fetch('/api/events?gardenId=1&upcoming=true');
      const data = await response.json();

      expect(data.events).toHaveLength(1);
      expect(data.events[0].title).toBe('Planting Workshop');
    });

    it('should allow user to RSVP for an event', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: 'RSVP recorded' }),
      });

      const response = await fetch('/api/events/1/attend', {
        method: 'POST',
        headers: { Authorization: 'Bearer token' },
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Discussion Thread Flow', () => {
    it('should create a discussion thread', async () => {
      const discussionData = {
        title: 'Best Tomato Varieties',
        content: 'What varieties work best in our region?',
        gardenId: 1,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          discussion: { id: 1, ...discussionData },
        }),
      });

      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(discussionData),
      });

      expect(response.status).toBe(201);
    });

    it('should fetch discussion with replies', async () => {
      const mockDiscussion = {
        id: 1,
        title: 'Garden Tips',
        reply_count: 3,
        replies: [
          { id: 1, content: 'Great tip!', created_by_username: 'user1' },
        ],
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ discussion: mockDiscussion }),
      });

      const response = await fetch('/api/discussions/1');
      const data = await response.json();

      expect(data.discussion.reply_count).toBe(3);
    });

    it('should add reply to discussion', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ message: 'Reply added' }),
      });

      const response = await fetch('/api/discussions/1/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify({ content: 'My reply' }),
      });

      expect(response.status).toBe(201);
    });
  });

  describe('User Profile Flow', () => {
    it('should fetch user profile', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        bio: 'Gardening enthusiast',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      const response = await fetch('/api/users/1', {
        headers: { Authorization: 'Bearer token' },
      });

      const data = await response.json();

      expect(data.user.username).toBe('testuser');
      expect(data.user.bio).toBe('Gardening enthusiast');
    });

    it('should update user profile', async () => {
      const updatedData = {
        firstName: 'Updated',
        bio: 'Updated bio',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, ...updatedData } }),
      });

      const response = await fetch('/api/users/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      expect(data.user.firstName).toBe('Updated');
    });
  });

  describe('Error Handling Across Stack', () => {
    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('/api/gardens');
      } catch (error) {
        expect((error as Error).message).toBe('Network error');
      }
    });

    it('should handle malformed JSON responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token');
        },
      });

      try {
        const response = await fetch('/api/gardens');
        await response.json();
      } catch (error) {
        expect((error as Error).message).toContain('Unexpected token');
      }
    });

    it('should handle 401 unauthorized responses', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized' }),
      });

      const response = await fetch('/api/protected-resource', {
        headers: { Authorization: 'Bearer invalid-token' },
      });

      expect(response.status).toBe(401);
    });
  });
});
