PY?=
# Prefer an activated venv (pelican/ghp-import on PATH), fall back to lxc117's /opt/blog-venv
PELICAN?=$(shell command -v pelican 2>/dev/null || echo /opt/blog-venv/bin/pelican)
GHPIMPORT?=$(shell command -v ghp-import 2>/dev/null || echo /opt/blog-venv/bin/ghp-import)
PELICANOPTS=

BASEDIR=$(CURDIR)
INPUTDIR=$(BASEDIR)/content
OUTPUTDIR=$(BASEDIR)/output
CONFFILE=$(BASEDIR)/pelicanconf.py
PUBLISHCONF=$(BASEDIR)/publishconf.py

GITHUB_PAGES_BRANCH=gh-pages
GITHUB_PAGES_COMMIT_MESSAGE=Generate Pelican site


DEBUG ?= 0
ifeq ($(DEBUG), 1)
	PELICANOPTS += -D
endif

RELATIVE ?= 0
ifeq ($(RELATIVE), 1)
	PELICANOPTS += --relative-urls
endif

SERVER ?= "0.0.0.0"

PORT ?= 0
ifneq ($(PORT), 0)
	PELICANOPTS += -p $(PORT)
endif


help:
	@echo 'Makefile for a pelican Web site                                           '
	@echo '                                                                          '
	@echo 'Usage:                                                                    '
	@echo '   make html                           (re)generate the web site          '
	@echo '   make clean                          remove the generated files         '
	@echo '   make regenerate                     regenerate files upon modification '
	@echo '   make publish                        generate using production settings '
	@echo '   make serve [PORT=8000]              serve site at http://localhost:8000'
	@echo '   make serve-global [SERVER=0.0.0.0]  serve (as root) to $(SERVER):80    '
	@echo '   make devserver [PORT=8000]          serve and regenerate together      '
	@echo '   make devserver-global               regenerate and serve on 0.0.0.0    '
	@echo '   make github                         upload the web site via gh-pages   '
	@echo '                                                                          '
	@echo 'Set the DEBUG variable to 1 to enable debugging, e.g. make DEBUG=1 html   '
	@echo 'Set the RELATIVE variable to 1 to enable relative urls                    '
	@echo '                                                                          '

copy-webapps:
	rsync -a --delete "$(BASEDIR)/content/amba-explorer/public/" "$(OUTPUTDIR)/amba-explorer/"
	rsync -a --delete "$(BASEDIR)/content/openscad-gui/public/" "$(OUTPUTDIR)/openscad-gui/"

html:
	"$(PELICAN)" "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS)
	$(MAKE) copy-webapps

clean:
	[ ! -d "$(OUTPUTDIR)" ] || rm -rf "$(OUTPUTDIR)"

regenerate: copy-webapps
	"$(PELICAN)" -r "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS)

serve: copy-webapps
	"$(PELICAN)" -l "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS)

serve-global: copy-webapps
	"$(PELICAN)" -l "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS) -b $(SERVER)

devserver: copy-webapps
	"$(PELICAN)" -lr "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS)

devserver-global: copy-webapps
	"$(PELICAN)" -lr "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(CONFFILE)" $(PELICANOPTS) -b 0.0.0.0

publish:
	"$(PELICAN)" "$(INPUTDIR)" -o "$(OUTPUTDIR)" -s "$(PUBLISHCONF)" $(PELICANOPTS)
	$(MAKE) copy-webapps

github: publish
	find "$(OUTPUTDIR)" -name ".git" -delete
	"$(GHPIMPORT)" -m "$(GITHUB_PAGES_COMMIT_MESSAGE)" -b $(GITHUB_PAGES_BRANCH) "$(OUTPUTDIR)" --no-jekyll
	git push origin $(GITHUB_PAGES_BRANCH) --force


.PHONY: html help clean regenerate serve serve-global devserver devserver-global publish github copy-webapps
