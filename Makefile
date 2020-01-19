install:
	npm install

build-dev:
	npm run build-dev

build-prod:
	npm run build-prod

browser: ## Loads extesion from dist to run in browser
	npm run browser

pack: ## Builds production version and packages it with web-ext
	npm run pack

watch: ## Runs build-dev and browser concurrently, allowing for hot-loading changes with some limitations
	npm run watch
