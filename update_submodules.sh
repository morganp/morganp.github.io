#!/usr/bin/env bash
# Prompt which git submodules to update to latest, then update + commit each selected one.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

SUBMODULES=()
while IFS= read -r line; do
    SUBMODULES+=("$line")
done < <(git config --file .gitmodules --get-regexp path | awk '{print $2}')

if [ ${#SUBMODULES[@]} -eq 0 ]; then
    echo "No submodules found."
    exit 0
fi

echo "Submodules:"
for i in "${!SUBMODULES[@]}"; do
    printf "  %d) %s\n" "$((i+1))" "${SUBMODULES[$i]}"
done

echo
echo "Enter numbers to update (space separated), 'a' for all, or 'q' to quit:"
read -r -p "> " selection

if [ "$selection" = "q" ]; then
    echo "Aborted."
    exit 0
fi

if [ "$selection" = "a" ]; then
    selected=("${SUBMODULES[@]}")
else
    selected=()
    for n in $selection; do
        idx=$((n-1))
        if [ "$idx" -ge 0 ] && [ "$idx" -lt "${#SUBMODULES[@]}" ]; then
            selected+=("${SUBMODULES[$idx]}")
        else
            echo "Skipping invalid selection: $n"
        fi
    done
fi

if [ ${#selected[@]} -eq 0 ]; then
    echo "Nothing selected."
    exit 0
fi

committed=()
dirty_inner=()

for path in "${selected[@]}"; do
    echo
    echo "== Updating $path =="
    git submodule update --remote --init "$path"

    if ! git -C "$path" status --porcelain | grep -q .; then
        :
    else
        dirty_inner+=("$path")
        echo "WARNING: $path has uncommitted/untracked content inside its own repo."
        echo "         Commit (and push) that inside $path first, or it won't be captured by this bump."
    fi

    if git diff --quiet -- "$path"; then
        echo "No pointer change for $path."
        continue
    fi

    git add "$path"
    git commit -m "Update $(basename "$path") submodule"
    committed+=("$path")
    echo "Committed update for $path."
done

echo
echo "== Summary =="
if [ ${#committed[@]} -eq 0 ]; then
    echo "No submodule pointer commits made."
else
    echo "Committed pointer bumps for:"
    for path in "${committed[@]}"; do
        echo "  - $path"
    done
fi

if [ ${#dirty_inner[@]} -gt 0 ]; then
    echo
    echo "Needs attention (uncommitted content inside submodule, not covered by pointer bump):"
    for path in "${dirty_inner[@]}"; do
        echo "  - $path"
    done
fi

echo
echo "Outstanding changes in this repo to push:"
git status --short -- "${selected[@]}"

echo
echo "Review with 'git log' / 'git status' before pushing."
