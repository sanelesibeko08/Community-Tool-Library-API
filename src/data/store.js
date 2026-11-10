const { randomUUID } = require('node:crypto');
const bcrypt = require('bcrypt');
const config = require('../config');

const tools = [
  {
    id: 'tool-1',
    name: 'Cordless Drill',
    category: 'Power Tools',
    condition: 'good',
    available: true
  },
  {
    id: 'tool-2',
    name: 'Garden Spade',
    category: 'Garden',
    condition: 'good',
    available: true
  },
  {
    id: 'tool-3',
    name: 'Claw Hammer',
    category: 'Hand Tools',
    condition: 'fair',
    available: true
  }
];

const loans = [];
const members = [
  {
    id: config.demoMember.id,
    username: config.demoMember.username,
    email: config.demoMember.email,
    passwordHash: bcrypt.hashSync(config.demoMember.password, 10)
  }
];

function createId() {
  return randomUUID();
}

module.exports = { tools, loans, members, createId };
