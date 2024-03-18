# fzpkg
Flipper Zero Package website and application

## Structure
It's a tar file with these files inside:
```
/
    meta.txt
    data/
        apps_data/
            app_name/
                helloworld.txt
                binaryfile.bin
        apps_assets/
            app_name/
                image.bmp
    scripts/
        install.txt
    app_name.fap
```

## `meta.txt`
Containts info about the application.\
Structure:
```
<fzpkg_version: int>
<category: string>
```
Example:
```
0
Tools
```
`fzpkg_version` specifies the fzpkg file version.\
Right now just the version `0` is supported.\
`category` should be the app category.

## `data/`
Files in this directory will be copied to `/ext/<path>/<filename>`.\
Writing files to `/int` will most likely never be supported.\
All the files will be overwritten.

## `scripts/`
`scripts/install.txt` will be executed after copying the FAP and the `data/` files.

## `app_name.fap`
The main FAP file. Will be copied to `/ext/apps/<category>/<app_name>.fap`.
There can be multiple `.fap` files in one `.fzpkg` file.

## `bundle.sh`
Usage:
```sh
./bundle.sh -d <data_path> -s <scripts_path> -f <fap_path> -c <category_name>
```