push:
	git push -u origin $(shell git rev-parse --abbrev-ref HEAD)
merge:
	git checkout main
	git merge $(shell git rev-parse --abbrev-ref HEAD)
	git push
