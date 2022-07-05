# papermc for Cloudron

This is a fork of an old package and has been updated to the latest version of PaperMC.

**current version**: Paper 1.18.2-267 (works with Minecraft 1.18.2, but you can add the [ViaVersion plugin from the SpigotMC resources](https://www.spigotmc.org/resources/viaversion.19254/) to support other versions too)

**MC server host with this package**: craft.ruds.io (add it to the Minecraft servers)

## installing

You don't need to build this image and can directly run `cloudron install --image rswat09/cloudron.papermc.app` after installing the Cloudron CLI.

## development

You can install the Cloudron CLI and run `cloudron build --no-push` to build the image after making your changes.

## updating

You can run `cloudron update --image rswat09/cloudron.papermc.app --app NAME-OF-THE-APP`.

## notes

* You can use the NodeJS snap for the Cloudron CLI, since it requires at least Node 14 and the APT package for Node in Ubuntu 20.04 is really old.
* Plugins can be added by opening the files tab in Cloudron, going to the `/app/data` folder if not already in it and opening the plugins folder, where you can upload the plugin JAR files.
