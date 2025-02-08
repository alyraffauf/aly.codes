+++
title = "Please Stop Using `nixos-rebuild switch`"
date = "2025-02-07"
description = "Good practices for safely and reliably deploying and updating NixOS systems."
keywords = "nix, nixos, linux, cicd, deployment, devops"
tags = ["nix", "cicd", "linux"]
toc = true
+++

🚨 Attention NixOS users! 🚨

Okay, I know this will sound strange to many of you. But hear me out.

**Please stop using `nixos-rebuild switch`.**

Seriously. Every time you deploy this way, you're likely causing more harm than you realize. And I promise you, thereare better, safer, and more reliable ways to live on NixOS.

Let’s talk about it.

---

## Background

Nix is a powerful package manager that lets you manage derivations—which include packages, configuration files, and more—in an atomic, declarative, and reproducible™ way.

On NixOS, everything—applications, configuration files, service units, etc.—lives in `/nix/store`, which acts as the system's read-only source of truth. Instead of modifying files in place like traditional package managers, Nix creates symlinks to the Nix store as needed. A particular collection of these symlinks is called a **generation**.

Unlike most Linux distributions, upgrading NixOS doesn't overwrite or delete anything. A new generation is created (symlinked to `/run/current-system`), while older generations remain intact and available for rollback. This guarantees access to previous configurations and installed packages.

This approach has major benefits. It prevents _rug-pulling_—where an application's executables or libraries change mid-run, potentially causing crashes or instability. It also isolates packages and their dependencies to avoid conflicts. In many cases, you can even pull packages from `nixos-unstable` or the latest upstream master branch without worrying about catastrophic breakage.

Most importantly, Nix makes rollbacks nearly effortless. If something goes wrong, you can boot into a previous generation—no panic or rescue USB required. Each generation is like a Git commit: you can always revert. _Or so they say._

---

## The Problem with `nixos-rebuild switch`

Okay, back to the issue at hand. Why should you avoid using `nixos-rebuild switch`?

At first glance, it seems like the obvious choice for applying a newly minted system generation. It immediately updates the running system and restarts services as needed, making it the most common method for upgrading or rolling back a NixOS system. However, despite its convenience, `nixos-rebuild switch` introduces several significant problems.

### 1. Incomplete Updates and Inconsistent System State

NixOS isolates system components to prevent unexpected rug-pulling. However, some components update immediately while others do not. For example, low-level components (like the kernel and systemd) take effect only after a reboot, and many user applications (e.g. Firefox, GNOME, Hyprland, various display servers) do not restart automatically after an update. Although the updated files appear in `/run/current-system`, the running instances continue to use the older versions until manually restarted.

This behavior minimizes disruptions but also creates a mixed system state: some components run the latest software while others continue using outdated (and potentially less secure) versions. This mismatch can lead to unpredictable behavior and complicates troubleshooting.

### 2. Hidden Bugs and Boot Issues

Because the system remains in an inconsistent state after a `switch`, subtle bugs or boot failures may only become apparent after a reboot. A system that appears stable at first might reveal issues only after a reboot, complicating your troubleshooting efforts. If a system fails its reboot test, the configuration cannot be reliably reproduced.

### 3. Boot Menu Clutter and Configuration Guesswork

Frequent iterations with `switch` generate an overwhelming number of system generations in your boot menu. This clutter makes it hard to identify the last known-good generation, often requiring multiple rollbacks to restore stability. After all, a rollback isn't very useful if you're not sure which generation to revert to.

### 4. Incompatible States

Each configuration iteration carries some risk—it could break your system's ability to boot or function as expected. Even if not every change is catastrophic, it's important to recognize the dangers before proceeding. Blindly running `nixos-rebuild switch` is akin to pushing broken code to master—except it's **worse** because generations are not fully isolated environments.

It isn't just about a new version of Linux or Mesa with a show-stopping bug. The core issue is that NixOS is not, by itself, a turly stateless system, and flawless rollbacks are never guaranteed. Your Wayland compositor might refuse to launch with configuration files from a newer generation, or your browser profile might become corrupted by an older version of Firefox. There is a real potential for data loss or corruption if you don't take proper precautions.

When it comes down to it, most software is designed to move _forward_, not backward.

---

## The Solution

Instead of relying on blind faith in rollbacks for increasingly obfuscated generations, let's adopt a harm-reduction approach based on these guiding principles:

1. **Test Configurations Before Deployment**  
   Every generation should be tested before it's committed to the bootloader. Unverified changes should never be deployed directly.

2. **Ensure Bootloader Entries Only Point to Working Generations**  
   Broken configurations should not appear in your boot menu. A bootloader cluttered with failed attempts is as bad as a Git history filled with commits like _“try fix #1,”_ _“fix last fix,”_ or _“oops.”_

3. **Keep Generations Meaningful and Bisectable**  
   Each system generation should be useful for debugging. Just as you wouldn't push messy, unstructured commits to master, you shouldn't create a confusing boot history filled with arbitrary, untested changes.

Following these principles helps maintain a clean system history, reduces unnecessary breakage, and makes troubleshooting more manageable.

### Good Practices for Testing Nix Configurations

1. **Check Evaluation**
   Use `nix flake check` to catch syntax or logic errors.
2. **Build the Configuration**  
   Run `nix build` to ensure the configuration compiles successfully.
3. **Preview System Changes**  
   Use `nixos-rebuild --dry-activate` to preview modifications.
4. **Test in an Isolated Environment**  
   Run `nixos-rebuild build-vm`—especially useful for multi-host setups.
5. **Apply Changes Ephemerally**  
   Run `nixos-rebuild test` to verify success before committing to a bootable generation.

### Good Practices for Safe and Reliable Deployments

For most systems, manual updates should be avoided in favor of automated, controlled deployments. Several NixOS deployment tools exist[^fn1]. One straightforward solution is to simply use the `system.autoUpgrade` module in `nixpkgs`, which can:

- Build your system from a remote or local flake.
- Automatically upgrade your host to the latest commit at a specified time.
- Detect when a reboot is necessary and schedule it accordingly.

Here's an example configuration using `system.autoUpgrade`:

```nix
{
  system.autoUpgrade = {
    enable = true;
    allowReboot = true;   # Allow automatic reboots when needed.
    dates = "02:00";      # Build and symlink the new generation at 2 AM.
    flake = "github:alyraffauf/nixcfg";  # Build from a remote flake.
    operation = "switch"; # Activate the new generation immediately.

    # Schedule reboots between 2 AM and 6 AM.
    rebootWindow = {
      lower = "02:00";
      upper = "06:00";
    };
  };
}
```

This module automatically builds your system from the remote master branch at 2 AM, activates the new generation immediately, and then schedules a reboot while you sleep. Downtime is minimized, and your system is always built from the most recent commit. Unlike other Nix deployment tools, it doesn't deploy in real time, so you may occasionally need to intervene manually. Nevertheless, it's an excellent starting point for harmonizing your fleet of NixOS hosts and minimizing configuration drift.

Keep in mind, if your laptop is not connected to the internet at 2AM (i.e. it is off or sleeping), `system.autoUpgrade` with this configuration will neither build nor activate the new generation. As an alternative, you can set `system.autoUpgrade.persistent` to `true`. This ensures that the autoUpgrade service runs whenever the machine is turned on, provided it would have run when the machine was off or sleeping.

Initially, I had these machines set to use `switch` as well, but I found that this approach frequently introduced breakage—and it simply wasn't worth the risk. Instead, I now set `system.autoUpgrade.operation` to `boot` and `system.autoUpgrade.persistent` to `true`. Together, these options ensure that new generations are prepared for deployment without being immediately activated until the next reboot.

Ideally, there would be an easy way to notify the user when a new generation is pending—similar to how other distributions do it. Since such a feature isn't available in NixOS, users must manually reboot from time to time to activate the new generation. Being slightly behind other hosts in the fleet is **usually** acceptable—and it certainly beats having a broken and inconsistent system.

**TL;DR:** Your seven ThinkPads and Beelink servers need a CICD pipeline.

---

## Footnotes

[^fn1]: I'm most familiar with [cachix](https://docs.cachix.org/deploy/) and [colmena](https://github.com/zhaofengli/colmena). These enable more robust _push_ deployments and can be automated with your preferred Git CI/CD solution, but they aren't as simple as `system.autoUpgrade`.
