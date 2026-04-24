.PHONY: setup test test-optional bonus clean

setup:
	@echo "=> Starting MongoDB Docker Container natively..."
	docker-compose up -d
	@echo "=> Waiting for MongoDB to be ready..."
	# Cross-platform wait (simple sleep for educational consistency)
	sleep 5

test:
	@npm test

test-optional:
	@npm run test:optional

bonus:
	@node bonus.js

clean:
	@echo "=> Performing Atomic Cleanup natively..."
	docker-compose down -v --remove-orphans
	@echo "=> Clean state achieved."
