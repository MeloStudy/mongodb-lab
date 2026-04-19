.PHONY: setup test clean

# Central router Makefile
# Use it like: make test LAB=001

setup:
	@if [ -z "$(LAB)" ]; then echo "You must specify the laboratory: make setup LAB=000"; exit 1; fi
	@echo "=> Executing configuration for LAB-$(LAB)..."
	@cd labs/$(LAB)-* && bash setup.sh
	@echo "=> Running npm install at workspace root..."
	npm install

test:
	@if [ -z "$(LAB)" ]; then echo "You must specify the laboratory: make test LAB=000"; exit 1; fi
	@echo "=> Running tests for LAB-$(LAB)..."
	npm test --workspace=labs/$(LAB)-*

clean:
	@if [ -z "$(LAB)" ]; then echo "You must specify the laboratory: make clean LAB=000"; exit 1; fi
	@echo "=> Executing teardown for LAB-$(LAB)..."
	@cd labs/$(LAB)-* && bash reset.sh

clean-all:
	@echo "=> WARNING: Tearing down all running containers across all labs..."
	docker ps -q -f name="mongodb_lab_" | xargs -r docker rm -f
	@echo "=> Cleaning global node_modules..."
	rm -rf node_modules
