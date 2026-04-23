.PHONY: setup test clean

# Standard Lab Makefile

setup:
	docker-compose up -d
	@echo "=> Waiting for MongoDB..."
	@sleep 2
	node generate-dirty-data.js

test:
	npm test

clean:
	docker-compose down -v
