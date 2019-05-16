.PHONY: build

install:
	docker-compose build

develop:
	docker-compose run --service-ports doc yarn develop -H 0.0.0.0

format:
	docker-compose run doc yarn format

build:
	docker-compose run doc yarn build
