'use strict';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = '@Dm!n123';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    const { randomUUID } = require('node:crypto');
    const { default: argon2 } = await import('argon2');
    const now = new Date();

    await queryInterface.bulkInsert(
      'users',
      [
        {
          id: randomUUID(),
          email: ADMIN_EMAIL,
          password: await argon2.hash(ADMIN_PASSWORD),
          created_at: now,
          updated_at: now,
        },
      ],
      { ignoreDuplicates: true },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', { email: ADMIN_EMAIL });
  },
};
