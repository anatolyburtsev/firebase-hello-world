# Makefile

# Variables
BUILD_CMD = npm run build
DEPLOY_CMD = firebase deploy
EMULATOR_CMD = firebase emulators:start

.PHONY: build deploy emulator

# Default target
all: build deploy

# Build the project
build:
	$(BUILD_CMD)

# Deploy the project
deploy: build
	$(DEPLOY_CMD)

# Start Firebase emulators
emulator-start:
	$(EMULATOR_CMD)

# Clean up (optional)
clean:
	rm -rf node_modules
	rm -rf build
