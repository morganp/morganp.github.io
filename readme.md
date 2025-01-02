Pelican for GithubPages
==

https://gist.github.com/JosefJezek/6053301
https://pages.charlesreid1.com/how-do-i-pelican/Hosting/

https://antonellocalamea.medium.com/step-by-step-guide-to-setup-a-web-site-using-pelican-and-gitpages-5de976ae44cb


    mkdir Pelican_project
    cd Pelican_project 

Create Virtual env

    python3 -m venv venv
    source venv/bin/activate

install & run setup

    pip install pelican markdown ghp-import 
    pelican-quickstart
    




Use the flying pelican for a bootstrap, download the zip and copy the pelican folder contents to the root of this project

https://github.com/charlesreid1/magic-flying-pelican 

setup the simple-bootstrap theme

    git clone --recursive https://github.com/getpelican/pelican-themes 
    cd pelican-themes
    pelican-themes -i simple-bootstrap

Modern make build
--
Build and serve 

    make devserver

To get a full list of option just run `make`.

Old build methods
--
Build

    pelican

Localhost

    cd pelican/output/
    python -m http.server    # serve content on localhost:8000

for CLI git with https: can not use passwords requies access token


Push to github
--

Manual Method

    pelican content -o output -s pelicanconf.py
    ghp-import output -b gh-pages
    git push origin gh-pages

Built in method

    make github


Add main code to a github depo

https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github

    # Set initial branch name to main
    git config --global init.defaultBranch main
    # or use 'git brnach -m main' after init to rename.

    git init
    git add content/*
    git add pelicanconf.py
    git commit -m 'initial pelican code'



Update site. Rebuid

    pelican
    cd output

    git status
    git add *
    git commit -m 'Second Pelican build'
    git push origin gh-pages

    git remote add origin REMOTE-URL
    # Verify Working
    git remote -v
    # All good ? push code
    git push -u origin main


Use 'gh' githubs command line tool which allows authorisation.

    brew install gh

setup login

    gh auth login

Then follow the instructions from the command prompt, it will also require you to use your 2 factor authentication.
