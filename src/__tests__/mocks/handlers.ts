/**
 * MSW Request Handlers
 *
 * Mock HTTP handlers for testing API client methods.
 * Simulates the Zapallo API endpoints.
 */

import { rest } from 'msw';
import { mockExchanges, mockExchangeUsers, mockExchangeCards } from './data';

// Base URL for API (matches config)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/api/v1';
const API_BASE = `${BASE_URL}${API_PREFIX}`;

/**
 * In-memory data stores for testing
 * (reset between tests via resetHandlers or by reinitializing)
 */
let exchanges = [...mockExchanges];
let exchangeUsers = [...mockExchangeUsers];
let exchangeCards = [...mockExchangeCards];

/**
 * Reset all data to initial state
 * Called between tests
 */
export function resetMockData(): void {
  exchanges = [...mockExchanges];
  exchangeUsers = [...mockExchangeUsers];
  exchangeCards = [...mockExchangeCards];
}

/**
 * MSW request handlers
 */
export const handlers = [
  // ============= Exchange Endpoints =============

  // GET /exchanges - List all exchanges
  rest.get(`${API_BASE}/exchanges`, (_req, res, ctx) => {
    return res(ctx.json(exchanges));
  }),

  // GET /exchanges/:id - Get single exchange
  rest.get(`${API_BASE}/exchanges/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const exchange = exchanges.find((e) => e.id === id);

    if (!exchange) {
      return res(ctx.status(404), ctx.json({ detail: 'Exchange not found' }));
    }

    return res(ctx.json(exchange));
  }),

  // POST /exchanges - Create exchange
  rest.post(`${API_BASE}/exchanges`, async (req, res, ctx) => {
    const body = await req.json();

    // Check for duplicate name
    if (exchanges.some((e) => e.name === body.name)) {
      return res(
        ctx.status(409),
        ctx.json({ detail: `Exchange with name '${body.name}' already exists` })
      );
    }

    const newExchange = {
      id: `new-exchange-${Date.now()}`,
      name: body.name,
      display_name: body.display_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    exchanges.push(newExchange);
    return res(ctx.status(201), ctx.json(newExchange));
  }),

  // PUT /exchanges/:id - Update exchange
  rest.put(`${API_BASE}/exchanges/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();

    const exchangeIndex = exchanges.findIndex((e) => e.id === id);

    if (exchangeIndex === -1) {
      return res(ctx.status(404), ctx.json({ detail: 'Exchange not found' }));
    }

    // Check for duplicate name
    if (body.name && exchanges.some((e) => e.name === body.name && e.id !== id)) {
      return res(
        ctx.status(409),
        ctx.json({ detail: `Exchange with name '${body.name}' already exists` })
      );
    }

    const updatedExchange = {
      ...exchanges[exchangeIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    exchanges[exchangeIndex] = updatedExchange;
    return res(ctx.json(updatedExchange));
  }),

  // DELETE /exchanges/:id - Delete exchange
  rest.delete(`${API_BASE}/exchanges/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const exchangeIndex = exchanges.findIndex((e) => e.id === id);

    if (exchangeIndex === -1) {
      return res(ctx.status(404), ctx.json({ detail: 'Exchange not found' }));
    }

    exchanges.splice(exchangeIndex, 1);
    return res(ctx.status(204));
  }),

  // ============= ExchangeUser Endpoints =============

  // GET /exchange_users - List all exchange users
  rest.get(`${API_BASE}/exchange_users`, (_req, res, ctx) => {
    return res(ctx.json(exchangeUsers));
  }),

  // GET /exchange_users/:id - Get single exchange user
  rest.get(`${API_BASE}/exchange_users/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const user = exchangeUsers.find((u) => u.id === id);

    if (!user) {
      return res(ctx.status(404), ctx.json({ detail: 'ExchangeUser not found' }));
    }

    return res(ctx.json(user));
  }),

  // POST /exchange_users - Create exchange user
  rest.post(`${API_BASE}/exchange_users`, async (req, res, ctx) => {
    const body = await req.json();

    const newUser = {
      id: `new-user-${Date.now()}`,
      exchange_id: body.exchange_id,
      external_user_id: body.external_user_id,
      name: body.name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    exchangeUsers.push(newUser);
    return res(ctx.status(201), ctx.json(newUser));
  }),

  // PUT /exchange_users/:id - Update exchange user
  rest.put(`${API_BASE}/exchange_users/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();

    const userIndex = exchangeUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res(ctx.status(404), ctx.json({ detail: 'ExchangeUser not found' }));
    }

    const updatedUser = {
      ...exchangeUsers[userIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    exchangeUsers[userIndex] = updatedUser;
    return res(ctx.json(updatedUser));
  }),

  // DELETE /exchange_users/:id - Delete exchange user
  rest.delete(`${API_BASE}/exchange_users/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const userIndex = exchangeUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res(ctx.status(404), ctx.json({ detail: 'ExchangeUser not found' }));
    }

    exchangeUsers.splice(userIndex, 1);
    return res(ctx.status(204));
  }),

  // ============= ExchangeCard Endpoints =============

  // GET /exchange_cards - List all exchange cards
  rest.get(`${API_BASE}/exchange_cards`, (_req, res, ctx) => {
    return res(ctx.json(exchangeCards));
  }),

  // GET /exchange_cards/:id - Get single exchange card
  rest.get(`${API_BASE}/exchange_cards/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const card = exchangeCards.find((c) => c.id === id);

    if (!card) {
      return res(ctx.status(404), ctx.json({ detail: 'ExchangeCard not found' }));
    }

    return res(ctx.json(card));
  }),

  // POST /exchange_cards - Create exchange card
  rest.post(`${API_BASE}/exchange_cards`, async (req, res, ctx) => {
    const body = await req.json();

    const newCard = {
      id: `new-card-${Date.now()}`,
      exchange_id: body.exchange_id,
      external_card_id: body.external_card_id,
      name: body.name,
      set_name: body.set_name,
      language: body.language,
      rarity: body.rarity || null,
      is_foil: body.is_foil,
      image_front_id: body.image_front_id || null,
      image_back_id: body.image_back_id || null,
      card_id: body.card_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    exchangeCards.push(newCard);
    return res(ctx.status(201), ctx.json(newCard));
  }),

  // PUT /exchange_cards/:id - Update exchange card
  rest.put(`${API_BASE}/exchange_cards/:id`, async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json();

    const cardIndex = exchangeCards.findIndex((c) => c.id === id);

    if (cardIndex === -1) {
      return res(ctx.status(404), ctx.json({ detail: 'ExchangeCard not found' }));
    }

    const updatedCard = {
      ...exchangeCards[cardIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };

    exchangeCards[cardIndex] = updatedCard;
    return res(ctx.json(updatedCard));
  }),

  // DELETE /exchange_cards/:id - Delete exchange card
  rest.delete(`${API_BASE}/exchange_cards/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const cardIndex = exchangeCards.findIndex((c) => c.id === id);

    if (cardIndex === -1) {
      return res(ctx.status(404), ctx.json({ detail: 'ExchangeCard not found' }));
    }

    exchangeCards.splice(cardIndex, 1);
    return res(ctx.status(204));
  }),
];
