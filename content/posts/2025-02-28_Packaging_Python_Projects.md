Title: Packaging Python Projects
Date: 2025-02-28 15:22 
Category: Tech
Tags: python
Author: morganp
Status: published
<!--to publish change draft to published-->

How to package a pythin script or project for distribution. Offical Docs are [here][python_package].
Packaging for pip requires use of a [build backend][], [Hatchling][] is the default for this example.

This run through uses the testPyPI. 


Summary
--

[Register for a test.pypi account](https://test.pypi.org/account/register/).

Initialise Python project area:
note: the build process also uses the gitignore to excluded the venv folder.

    mkdir packaging_tutorial
    cd packagin_tutorial
    python3 -m venv venv
    source venv/bin/activate
    curl --output .gitignore "https://raw.githubusercontent.com/github/gitignore/refs/heads/main/Python.gitignore"

Create the folder structure:

    packaging_tutorial/
    ├── LICENSE
    ├── pyproject.toml
    ├── README.md
    ├── src/
    │   └── example_package_YOUR_USERNAME_HERE/
    │       ├── __init__.py
    │       └── example.py
    └── tests/

`__init__.py` can be empty, but allows project to be imported in standard way.

pyproject.toml - directs pip how to build the project

    [build-system]
    requires = ["hatchling"]
    build-backend = "hatchling.build"

    [project]
    name = "example_package_YOUR_USERNAME_HERE"
    version = "0.0.1"
    authors = [
      { name="Example Author", email="author@example.com" },
    ]
    description = "A small example package"
    readme = "README.md"
    requires-python = ">=3.8"
    classifiers = [
        "Programming Language :: Python :: 3",
        "Operating System :: OS Independent",
    ]
    license = "MIT"
    license-files = ["LICEN[CS]E*"]

    [project.urls]
    Homepage = "https://github.com/pypa/sampleproject"
    Issues = "https://github.com/pypa/sampleproject/issues"


    [python_package]: https://packaging.python.org/en/latest/tutorials/packaging-projects/
    [build backend]: https://packaging.python.org/en/latest/glossary/#term-Build-Backend
    [Hatchling]: https://hatch.pypa.io/latest/

Generate Distrubution Archive
--

Update `build`

    pip install --upgrade build

Build:

    python3 -m build

This should create

    dist/
    ├── example_package_YOUR_USERNAME_HERE-0.0.1-py3-none-any.whl (Built Distribution)
    └── example_package_YOUR_USERNAME_HERE-0.0.1.tar.gz (Source Distibution)

Upload!
--

Create and store API token. [Create Token](https://test.pypi.org/manage/account/#api-tokens), set scope to entire account.

Update `twine`

    pip install --upgrade twine

Upload the files in dist

    python3 -m twine upload --repository testpypi dist/*

Once Complete the uploaded package can be viewed here:

    https://test.pypi.org/project/example_package_YOUR_USERNAME_HERE.

Test install

    python3 -m pip install --index-url https://test.pypi.org/simple/ --no-deps example-package-YOUR-USERNAME-HERE


