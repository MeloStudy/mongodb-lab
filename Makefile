.PHONY: setup test clean clean-all help

# Central router Makefile
# Use it like: make test LAB=001

help:
	@echo "MongoDB Masterclass Laboratory - CLI Tool"
	@echo "------------------------------------------"
	@echo "Usage:"
	@echo "  make setup LAB=XXX   - Spin up the database container for a lab"
	@echo "  make test LAB=XXX    - Run the TDD validation suite for a lab"
	@echo "  make clean LAB=XXX   - Tear down the lab environment and volumes"
	@echo "  make clean-all       - EMERGENCY: Stop all mongodb_lab containers"
	@echo ""
	@echo "Example: make setup LAB=007"

setup:
	@if [ -z "$(LAB)" ]; then echo "Error: You must specify the laboratory (e.g., make setup LAB=007)"; exit 1; fi
	@echo "=> Spinning up container for LAB-$(LAB)..."
	@cd labs/$(LAB)-* && docker-compose up -d
	@echo "=> Container is ready."

test:
	@if [ -z "$(LAB)" ]; then echo "Error: You must specify the laboratory (e.g., make test LAB=007)"; exit 1; fi
	@echo "=> Running tests for LAB-$(LAB)..."
	@# We use the folder path as the workspace identifier. The shell expansion handles the wildcard.
	npm test --workspace=labs/$(LAB)-*

clean:
	@if [ -z "$(LAB)" ]; then echo "Error: You must specify the laboratory (e.g., make clean LAB=007)"; exit 1; fi
	@echo "=> Tearing down LAB-$(LAB) environment..."
	@cd labs/$(LAB)-* && docker-compose down -v

clean-all:
	@echo "=> WARNING: Tearing down all running containers across all labs..."
	@# Stops all containers starting with mongodb_lab_
	@docker ps -a -q -f name="mongodb_lab_" | xargs -r docker rm -f
	@echo "=> Containers stopped and removed."
