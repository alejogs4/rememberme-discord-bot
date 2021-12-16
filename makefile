test:
	docker-compose -f docker-compose.e2e.yml -p e2e up --build --abort-on-container-exit
	docker-compose -f docker-compose.e2e.yml -p e2e down