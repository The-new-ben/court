class Client {
  constructor({ id, name, email, phone, history = [] }) {
    this.id = id || Date.now().toString();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.history = history;
    this.createdAt = new Date().toISOString();
  }
}

const clients = [];

module.exports = { Client, clients };
