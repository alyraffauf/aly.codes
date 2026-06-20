+++
title = '''Making AppImages suck less with AppHerder'''
date = "2026-06-20"
description = "Lifecycle management for your AppImages."
keywords = "appimage, appherder, linux, systemd, go, package management"
tags = ["appimage", "appherder", "linux", "systemd", "go", "cli", "package-management"]
toc = false
draft = false
cover = "imgs/covers/2026-06-20-appherder.png"
hideCover = true
atUri = "at://did:plc:zntngpowgd6rorjt3haywj36/site.standard.document/3mooywkcs5s22"
+++

Linux has many ways to install an app, which is a polite way of saying nobody agrees on one.

Flatpak, Nix, Homebrew, distro packages, and AppImages all have their place in theory, but in practice you are not choosing a format. You are choosing an app, and the app shows up in whatever format the author and your distribution chose to make it available.

---

I'm focusing on AppImages here because they occupy a particularly annoying middle ground in this crowded field. They are not quite packages, not quite portable apps, and not quite installers. An AppImage is basically an executable runtime with a compressed filesystem glued onto it. That filesystem contains the application, its libraries, and usually a `.desktop` file and icon. When you run the AppImage, the runtime mounts or extracts that payload and launches the app inside it.

They are executable filesystem bundles with just enough desktop-adjacent metadata to look like apps, but not enough glue to behave like installed software. That's a clever trick, but it also explains most of the weirdness.

The appeal is obvious. No root access needed, no distro-specific package, and no waiting for a distro maintainer to package your app. For self-distributing developers, AppImages are extremely convenient: build one file, throw it at users, and avoid most of the infrastructure and politics around app stores and distro repositories.

The catch is that running self-contained apps and installing them are not the same thing. An app is not installed just because your kernel agrees to execute it.

Users have higher expectations. They expect installed apps to:

- show up in the app launcher
- have the right icon
- open files they support
- update without sending you spelunking through GitHub releases
- uninstall without leaving a sad little `.desktop` file pointing at something that no longer exists

On their own, AppImages do not provide that. They do not reliably integrate with your desktop. They do not reliably update themselves. Many are unsigned. There is no central registry. There may be embedded update info, or there may not. The payload might be SquashFS, DwarFS, or some hitherto unknown format. Some tools eventually fall back to executing the AppImage itself with `--appimage-extract`, which is a pretty funny thing to do to a file you are trying to inspect safely.

To be fair to AppImages, every other platform has goofy app formats, too.

macOS DMGs make you drag an icon into another icon in a goofy little ritual, but at least the app lands somewhere obvious and everything else is handled for you. Portable Windows EXEs are loose files with no real promises, though nobody is pretending otherwise. Anything more complicated or permanent needs its own bespoke wizard, which is something Linux has _mostly_ avoided.

That said, I don't particularly _like_ AppImages. But they solve a genuine problem and fill a small niche that traditional package managers and modern stores can't. AppImages offer clever dependency management and app distribution without the adult supervision of Flatpak or extended timelines of distro packages. That means no built-in sandboxing, no vetting, and no centralized rules, but that's kind of the point. It's the wild west of package formats.

And like any wild west, the freedom cuts both ways. AppImages are censorship-resistant because distribution is fractured, decentralized, and piecemeal. That same chaos enables a great deal of laziness and danger. Tradeoffs abound.

---

## AppHerder

I was recently stuck on a hopelessly delayed plane for over three hours longer than planned. With no internet and too much time, I wrote the first version of AppHerder: a Python script doing its best to bring order to the chaos of my AppImages.

Since then, I've dedicated a few nights to producing a more refined version in Go, available as an AppImage on [GitHub](https://github.com/alyraffauf/appherder).

AppHerder is a local _lifecycle manager_ for AppImages. It does not try to be an app store. It does not solve discovery. It does not decide what software should exist. It's barely a package manager. It just takes the AppImages you already have and makes them behave as you'd expect.

Here's the gist: `~/AppImages` becomes the source of truth, just like `/Applications` on macOS. Throw an AppImage in there and AppHerder adopts it. It reads the metadata, installs the icon, writes a patched `.desktop` file, and marks that launcher as its own with `X-AppHerder=true`. Delete the AppImage later and AppHerder cleans up the launcher, icon, and metadata it created.

The trick that makes this feel automatic is a systemd user path unit that watches `~/AppImages`. When that directory changes, systemd runs `appherder sync` as a one-shot user service. There is no always-on daemon sitting around waiting.

To the user, this is basically transparent. Drop an app in the folder and within seconds it's in your menu. Delete it and it disappears just as fast.

<blockquote class="bluesky-embed" data-bluesky-uri="at://did:plc:zntngpowgd6rorjt3haywj36/app.bsky.feed.post/3mojhvxap7c2u" data-bluesky-cid="bafyreic3io5yb7idnyd2iwdrv2vul3tfk7fdxbke7ytcdtmdw5vsk4av74" data-bluesky-embed-color-mode="system">
<p lang="en">I think I have successfully &#x27;fixed&#x27; the UX of appimages<br><br>this started as a rawdogged (no internet no AI no nothing) python script I hallucinated in one shot on the plane (I spent like 8hrs on planes recently), but I think I think I&#x27;ve eliminated basically all the pain points<br><br>(and rewrote it in Go)<br><br><a href="https://bsky.app/profile/did:plc:zntngpowgd6rorjt3haywj36/post/3mojhvxap7c2u?ref_src=embed">[image or embed]</a></p>
&mdash; aly (<a href="https://bsky.app/profile/did:plc:zntngpowgd6rorjt3haywj36?ref_src=embed">@aly.codes</a>)
<a href="https://bsky.app/profile/did:plc:zntngpowgd6rorjt3haywj36/post/3mojhvxap7c2u?ref_src=embed">7:32 PM · Jun 17, 2026</a>
</blockquote>

Since this is automatic rather than manually invoked, the systemd unit it triggers is relatively locked down. It runs with `NoNewPrivileges`, a private temp directory, a read-only system view, and explicit write access only to the directories AppHerder needs to manage. It is still your user account managing your files, not a sandbox, but it is tighter than a normal shell command.

AppHerder uses the same systemd-user approach for automatic upgrades, with a timer instead of a path watcher. Because AppImages have no universal update mechanism, it is very easy to collect stale binaries that need to be manually replaced.

Luckily, many AppImages provide basic update info in an embedded `.upd_info` section of the binary. AppHerder checks that first, then falls back to user-configurable sources when upstream metadata is missing or wrong.

For safer updates, AppImages can be signed to verify provenance. Not every AppImage is signed, because of course they aren't, but AppHerder enforces signatures for updates when available. If an AppImage is signed, AppHerder pins that signing key on first install and refuses unsigned or differently-signed updates after that. Unsigned apps still work, but they do not get to pretend they have the same provenance story as signed ones. It is up to the user to decide if they are comfortable using unsigned software.

```text
download candidate
        |
        v
is it an AppImage?
   | yes
   v
expected hash available?
   | yes -> must match
   | no  -> continue, but no checksum claim
   v
signature available?
   | yes -> pin key on first install
   |        require same key for updates
   | no  -> allowed, but provenance is weaker
   v
install / reject
```

Regardless, AppHerder still verifies that the file is _actually_ an AppImage and checks expected hashes when the update source provides them (spoiler: they do not always provide them). This verification happens before AppHerder installs the update.

Some AppImage tools execute the AppImage with `--appimage-extract` to inspect its contents, but AppHerder unpacks them passively without execution. Yes, the user may eventually run the app, but that is a conscious user choice, not something happening automatically just because a manager wanted an icon. Technically speaking, this limits AppHerder to SquashFS and DwarFS AppImages, but that is the _vast_ majority of all AppImages currently available.

And because updates can always turn into "oops, everything is worse now," AppHerder keeps several previous versions around for easy rollback.

---

AppHerder does not make AppImages perfect. They're not as tidy as Flatpaks or as vetted as your distro's packages. They are still AppImages. Sorry.

Instead, it is an adversarial attempt at making the bargain a lot less bad. If the app you need ships as an AppImage, fine. Put it in `~/AppImages`, let it behave like an app, and delete it when you're done. That should not leave you with a Downloads folder full of mystery binaries and desktop entries pointing at ghosts.

You can grab AppHerder from [GitHub](https://github.com/alyraffauf/appherder), or use the install script:

```bash
curl -sSL https://raw.githubusercontent.com/alyraffauf/appherder/main/scripts/install.sh | bash
```

It downloads the latest AppImage, installs AppHerder into `~/AppImages`, and enables automatic sync and upgrades. After that, `~/AppImages` is the place: drop AppImages in there, delete them when you're done, and let AppHerder handle the boring parts.

With any luck, this makes them suck _less_. Regrettably, that may be as good as it gets.
