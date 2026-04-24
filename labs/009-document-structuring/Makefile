setup:
	@echo "=> Starting MongoDB Lab 009..."
	docker-compose up -d
	@echo "=> MongoDB is starting. Seeding will happen automatically via docker-entrypoint-initdb.d"

test:
	npm test

clean:
	@echo "=> Cleaning up environment (removing volumes for fresh seed)..."
	docker-compose down -v --remove-orphans
