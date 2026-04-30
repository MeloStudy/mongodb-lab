.PHONY: setup test clean

setup:
	@echo "=> Starting MongoDB Docker Container natively..."
	docker-compose up -d
	@echo "=> Sleeping for 5s to ensure MongoDB is ready to accept connections..."
	sleep 5

test:
	@npm test

clean:
	@echo "=> Performing Atomic Cleanup natively..."
	docker-compose down -v --remove-orphans
	@echo "=> Clean state achieved."

