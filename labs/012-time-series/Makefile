.PHONY: setup test clean

# LAB-012: Time-Series Makefile

setup:
	docker-compose up -d
	@echo "=> Waiting for MongoDB to initialize..."
	@node -e "setTimeout(() => {}, 1000)"
	@echo "=> Environment ready."

test:
	npm test

clean:
	docker-compose down -v --remove-orphans
