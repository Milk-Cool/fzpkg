#!/bin/bash

# https://stackoverflow.com/a/14203146/22470070

while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--data)
      DATA="$2"
      shift
      shift
      ;;
    -s|--scripts)
      SCRIPTS="$2"
      shift
      shift
      ;;
    -f|--fap)
      FAP="$2"
      shift
      shift
      ;;
    -c|--category)
      CATEGORY="$2"
      shift
      shift
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

if [ -z "$DATA" ]; then
  echo "Data directory not specified"
  exit 2
fi

if [ -z "$SCRIPTS" ]; then
  echo "Scripts directory not specified"
  exit 2
fi

if [ -z "$FAP" ]; then
  echo "FAP file not specified"
  exit 2
fi

if [ -z "$CATEGORY" ]; then
  echo "Category not specified"
  exit 2
fi

rm -rf /tmp/fzpkg/
mkdir /tmp/fzpkg/
mkdir /tmp/fzpkg/scripts
mkdir /tmp/fzpkg/data

cp $FAP /tmp/fzpkg/

echo 0 > /tmp/fzpkg/meta.txt
echo $CATEGORY >> /tmp/fzpkg/meta.txt

cp -r $(find $SCRIPTS -mindepth 1 -maxdepth 1) /tmp/fzpkg/scripts
cp -r $(find $DATA -mindepth 1 -maxdepth 1) /tmp/fzpkg/data

tar -cf out.tar -C /tmp/fzpkg/ $(ls /tmp/fzpkg/)