
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

SRC:=$(shell find lib -regex '/^.*(html|js|json|css)$$/')
TESTS:=$(shell find lib -name '*.test.js')


#
# Targets
#

build: node_modules $(SRC)
	mkdir -p $@
	atomify
	@echo ""
	@echo "    indicator-events was built!"
	@echo ""

node_modules: package.json
	npm install

test: build
	node_modules/karma/bin/karma start

clean:
	rm -fr build

.PHONY: clean test

