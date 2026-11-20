.PHONY: dev dev-app dev-api

dev:
	@$(MAKE) -j2 dev-app dev-api

dev-app:
	cd app && pnpm dev

dev-api:
	cd api && pnpm dev
