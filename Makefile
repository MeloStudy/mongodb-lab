.PHONY: setup test clean clean-all help

# Central router Makefile
# Use it like: make test LAB=001

# Shell configuration for Windows compatibility
PWSH = powershell -ExecutionPolicy Bypass -Command

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

check-lab:
ifndef LAB
	$(error Error: You must specify the laboratory (e.g., make setup LAB=007))
endif

setup: check-lab
	@echo "=> Spinning up container for LAB-$(LAB)..."
	@$(PWSH) "$$labDir = Get-ChildItem -Path labs -Filter '$(LAB)-*' | Select-Object -ExpandProperty FullName; cd $$labDir; docker-compose up -d"
	@echo "=> Container is ready."

test: check-lab
	@echo "=> Running tests for LAB-$(LAB)..."
	@$(PWSH) "$$labDir = Get-ChildItem -Path labs -Filter '$(LAB)-*' | Select-Object -ExpandProperty FullName; npm test --workspace=$$labDir"

clean: check-lab
	@echo "=> Tearing down LAB-$(LAB)..."
	@$(PWSH) "$$labDir = Get-ChildItem -Path labs -Filter '$(LAB)-*' | Select-Object -ExpandProperty FullName; cd $$labDir; docker-compose down -v --remove-orphans"
	@echo "=> Environment cleaned."

clean-all:
	@echo "=> EMERGENCY: Cleaning all lab containers..."
	@$(PWSH) "docker ps -a --filter 'name=mongodb_lab' -q | ForEach-Object { docker stop $$_; docker rm $$_ }"
	@echo "=> All lab containers stopped and removed."
