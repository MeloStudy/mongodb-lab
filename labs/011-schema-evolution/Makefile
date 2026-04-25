.PHONY: setup test clean

setup:
	@echo "=> Starting MongoDB Container..."
	docker-compose up -d
	@echo "=> Waiting for MongoDB to be ready..."
	sleep 5

test:
	@npm test

clean:
	@echo "=> Cleaning up resources..."
	docker-compose down -v --remove-orphans
	@echo "=> Clean state achieved."
