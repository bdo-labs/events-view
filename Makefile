
#
# Path
#

SHELL:=/bin/bash
PATH:=./node_modules/.bin:$(PATH)


#
# Settings
#

REPORTER?=spec


#
# Sources
#

SRC:=$(wildcard lib/*)
TESTS:=$(wildcard test/*)


#
# Targets
#

build: node_modules $(SRC)
	mkdir -p $@

	atomify

	@echo ""
	@echo "    events-view was built!"
	@echo ""

node_modules: package.json
	npm install

test: build
	node_modules/karma/bin/karma start

clean:
	rm -fr build

.PHONY: clean test build

