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

for path in "${selected[@]}"; do
    echo
    echo "== Updating $path =="
    git submodule update --remote --init "$path"

    if git diff --quiet -- "$path"; then
        echo "No changes for $path."
        continue
    fi

    git add "$path"
    git commit -m "Update $(basename "$path") submodule"
    echo "Committed update for $path."
done

echo
echo "Done. Review with 'git log' / 'git status' before pushing."
