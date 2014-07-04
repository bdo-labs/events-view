
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

SRC:=$(shell find -E lib -regex '/^.*(html|js|json|css)$$/')
TESTS:=$(shell find lib -name '*.test.js')


#
# Targets
#

build: node_modules $(SRC)
	mkdir -p $@
	atomify
	@echo ""
	@echo "    scorecard was built!"
	@echo ""

node_modules: package.json
	npm install

test: build
	mocha --reporter $(REPORTER) $(TESTS)

clean:
	rm -fr build

.PHONY: clean test

