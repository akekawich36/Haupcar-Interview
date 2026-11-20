.PHONY: dev dev-app dev-api

# Run backoffice web + backoffice-service together. Ctrl-C stops both.
dev:
	@$(MAKE) -j2 dev-web dev-api

dev-app:
	cd app && pnpm dev

dev-api:
	cd api && pnpm dev
