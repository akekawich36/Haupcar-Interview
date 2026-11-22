'use strict';

const BRAND_NAMES = [
  'Toyota',
  'Honda',
  'Mazda',
  'Nissan',
  'Mitsubishi',
  'BYD',
  'Tesla',
];

module.exports = {
  async up(queryInterface) {
    const { randomUUID } = require('node:crypto');
    const now = new Date();

    await queryInterface.bulkInsert(
      'brands',
      BRAND_NAMES.map((name) => ({
        id: randomUUID(),
        name,
        created_at: now,
        updated_at: now,
      })),
      { ignoreDuplicates: true },
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('brands', { name: BRAND_NAMES });
  },
};
