#!/bin/bash

# https://stackoverflow.com/a/14203146/22470070

EXTRA=false

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
    -e|--extra)
      EXTRA=true
      shift
      ;;
    -*|--*)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

rm -rf /tmp/fzpkg/
mkdir /tmp/fzpkg/
mkdir /tmp/fzpkg/scripts
mkdir /tmp/fzpkg/data

cp $FAP /tmp/fzpkg/

echo 0 > /tmp/fzpkg/meta.txt
echo $CATEGORY >> /tmp/fzpkg/meta.txt
echo $EXTRA >> /tmp/fzpkg/meta.txt

cp $SCRIPTS/* /tmp/fzpkg/scripts
cp $DATA/* /tmp/fzpkg/data

tar -cf out.tar -C /tmp/fzpkg/ $(ls /tmp/fzpkg/)