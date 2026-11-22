'use strict';

const MODELS_BY_BRAND = {
  Toyota: ['Yaris', 'Yaris Ativ', 'Corolla Altis', 'Camry', 'Fortuner'],
  Honda: ['City', 'Civic', 'Accord', 'HR-V', 'CR-V'],
  Mazda: ['Mazda2', 'Mazda3', 'CX-3', 'CX-5'],
  Nissan: ['Almera', 'Kicks', 'Navara'],
  Mitsubishi: ['Mirage', 'Attrage', 'Xpander', 'Pajero Sport'],
  BYD: ['Dolphin', 'Atto 3', 'Seal'],
  Tesla: ['Model 3', 'Model Y'],
};

const findBrands = (queryInterface, Sequelize) =>
  queryInterface.sequelize.query(
    'SELECT id, name FROM brands WHERE name IN (:names)',
    {
      replacements: { names: Object.keys(MODELS_BY_BRAND) },
      type: Sequelize.QueryTypes.SELECT,
    },
  );

module.exports = {
  async up(queryInterface, Sequelize) {
    const { randomUUID } = require('node:crypto');
    const now = new Date();

    const brands = await findBrands(queryInterface, Sequelize);
    if (brands.length === 0) {
      return;
    }

    const existingModels = await queryInterface.sequelize.query(
      'SELECT brand_id, name FROM car_models WHERE brand_id IN (:brandIds)',
      {
        replacements: { brandIds: brands.map((brand) => brand.id) },
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const existing = new Set(
      existingModels.map((model) => `${model.brand_id}:${model.name}`),
    );

    const models = brands.flatMap((brand) =>
      MODELS_BY_BRAND[brand.name]
        .filter((name) => !existing.has(`${brand.id}:${name}`))
        .map((name) => ({
          id: randomUUID(),
          name,
          brand_id: brand.id,
          created_at: now,
          updated_at: now,
        })),
    );

    if (models.length > 0) {
      await queryInterface.bulkInsert('car_models', models);
    }
  },

  async down(queryInterface, Sequelize) {
    const brands = await findBrands(queryInterface, Sequelize);

    await Promise.all(
      brands.map((brand) =>
        queryInterface.bulkDelete('car_models', {
          brand_id: brand.id,
          name: MODELS_BY_BRAND[brand.name],
        }),
      ),
    );
  },
};
