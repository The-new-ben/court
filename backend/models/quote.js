const quotes = [];
const clients = [];

function createQuote({ client, details, amount, status = 'draft' }) {
  const quote = {
    id: Date.now().toString(),
    client,
    details,
    amount,
    status
  };
  quotes.push(quote);
  return quote;
}

function setStatus(id, status) {
  const quote = quotes.find(q => q.id === id);
  if (!quote) return null;
  quote.status = status;
  return quote;
}

function activateQuote(id) {
  const quote = setStatus(id, 'accepted');
  if (!quote) return null;
  const client = {
    id: quote.id,
    name: quote.client,
    details: quote.details,
    amount: quote.amount
  };
  clients.push(client);
  return client;
}

module.exports = { quotes, clients, createQuote, setStatus, activateQuote };

