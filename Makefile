.PHONY: dev dev-app dev-api dev-db

dev:
	@$(MAKE) -j2 dev-app dev-api dev-db

dev-app:
	cd app && pnpm dev

dev-db:
	docker-compose -f docker-compose.yml up -d

dev-api:
	cd api && pnpm dev
