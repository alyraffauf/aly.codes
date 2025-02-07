+++
title = "Please Stop Using `nixos-rebuild switch`"
date = "2025-02-07"
description = "Good practices for safely and reliably deploying and updating NixOS systems."
keywords = "nix, nixos, linux, cicd, deployment, devops"
draft = true
tags = ["nix", "cicd", "linux"]
+++

This is a PSA[^fn1]: please stop using `nixos-rebuild switch`. You may be doing more harm than good.

Seriously. It's probably a bad idea. Let's talk about why.

---

## Background

As you may know, Nix is a powerful package manager that lets you manage derivations—which include packages, configuration files, and more—in an atomic, declarative, and reproducible™ way.

On NixOS, everything—applications, config files, service units, and so on—lives in `/nix/store`, which serves as the system's read-only _source of truth_. Instead of modifying files in place like traditional package managers, Nix creates symlinks pointing to the Nix store whenever needed. A specific collection of these symlinks is called a _generation_.

Unlike most Linux distributions, upgrading NixOS doesn't overwrite or delete anything. Instead, it creates a new generation, symlinked to `/run/current-system`, while older generations remain intact and available for rollback. This ensures you always have access to previous configurations and installed packages.

This approach has some major benefits. First, it prevents _rug-pulling_—a situation where an application's executables or libraries are replaced mid-run, potentially causing crashes or instability. It also ensures proper isolation between packages and their dependencies, meaning dependency conflicts are rare. In many cases, you can even pull packages from `nixos-unstable` or the latest upstream master branch without worrying about catastrophic breakage.

Most importantly, Nix makes rollbacks nearly effortless. If something goes wrong, you can simply boot into a previous generation—no need to panic or scramble for a rescue USB. The likelihood of your system becoming completely unrecoverable is _extremely_ low. Each generation is essentially a Git commit—you can always revert. _Or so they say._

---

## The Problem with `nixos-rebuild switch`

So why should you avoid `nixos-rebuild switch`? `nixos-rebuild switch` allows users to imperatively move their system to a newly minted generation in place. **`switch`** applies the new generation immediately, updating the running system and restarting services as needed. This is probably the most common way that users upgrade or roll back their NixOS systems. However, this comes with several important problems.

### 1. Incomplete Updates and Inconsistent System State

While Nix makes a best-effort attempt to restart services when necessary, its guarantees against rug-pulling introduce several new problems, including:

- Low-level components like the kernel and systemd are **not** updated in place, meaning a reboot is required for them to take effect.
- Many user applications—such as Firefox, GNOME, Hyprland, and display servers—are **not** restarted automatically. They may be updated in `/run/current-system`, but they will continue running the old version until manually restarted.

While this behavior prevents disruptions, it also leads to an **inconsistent system state**, wherein some components are updated while others continue running outdated versions. This creates a **massive security and stability risk**, as outdated applications may remain vulnerable to known exploits. Additionally, users may unknowingly run software that is incompatible with their updated system state, leading to unpredictable behavior and hard-to-debug issues.

### 2. Hidden Bugs and Boot Issues

Because the system remains in an inconsistent state after `switch`, it becomes difficult to identify whether a new generation has introduced subtle bugs—or worse, boot failures. A system that seems stable at first might reveal issues only after the next reboot, making troubleshooting harder. A system that doesn't pass the reboot test is not one that can be reliably reproduced.

### 3. Boot Menu Clutter & Configuration Guesswork

If you're frequently tweaking configurations, `switch` can quickly lead to an overwhelming number of system generations in your boot menu. This makes it difficult to track the last known-good generation, potentially requiring multiple rollbacks to restore stability. What good are rollbacks if you don't know what to roll back to?

### 4. NixOS is Not Stateless

Every iteration of your configuration carries some risk—it could break your system’s ability to boot or function as expected. Even if not every change is catastrophic, it's important to acknowledge the real dangers before moving forward. Blindly running `nixos-rebuild switch` is the NixOS equivalent of pushing broken code to master, except it’s **worse** because generations are not fully isolated environments.

It's not just about a new version of Linux or Mesa with a show-stopping bug. The problem is that NixOS is not a truly stateless system unless you're wiping it clean on every boot, and rollbacks working flawlessly is never a guarantee, only a convenience. Your Wayland compositor may refuse to launch with config files from a newer generation. Your browser profile may get garbled by an older version of Firefox. At the end of the day, most software is designed to move forward, not back.

## The Solution

Instead of relying on blind faith in rollbacks to increasingly obfuscated generations, let's adopt a harm reduction approach with three guiding principles:

1. **Test configurations before deployment.**  
   Every generation should be tested before committing it to the bootloader. Unverified changes should never be deployed directly to your system.

2. **Ensure bootloader entries only point to working generations.**  
   Broken configurations should never make it into your boot menu. A bootloader cluttered with failed attempts is no better than a Git history full of commits like _"try fix #1,"_ _"fix last fix,"_ or _"oops."_

3. **Keep generations meaningful and bisectable.**  
   Each system generation should be useful for debugging. Just as you wouldn’t push messy, unstructured commits to `master`, you shouldn’t generate a confusing boot history filled with arbitrary, untested changes.

By following these principles, you can keep your system history clean, avoid unnecessary breakages, and make troubleshooting far more manageable.

### Good Practices for Testing Nix Configurations

1. **Check evaluation** with `nix flake check` to catch syntax or logic errors.
2. **Build the configuration** with `nix build` to ensure it compiles successfully.
3. **Preview system changes** with `nixos-rebuild --dry-activate` to confirm modifications.
4. **Test in an isolated environment** with `nixos-rebuild build-vm`, especially useful for multi-host setups.
5. **Apply changes ephemerally** with `nixos-rebuild test` to verify success before committing to bootable generations.

### Good Practices for Safe and Reliable Deployments

In most cases, manual updates should be avoided altogether in favor of automated, controlled deployments. Many NixOS deployment tools exist[^fn2], but the most straightforward solution is to use the `system.autoUpgrade` module in `nixpkgs`. It can:

- Build your system from a remote or local flake.
- Automatically upgrade your host to the latest commit at a specified time.
- Detect when reboots are necessary and schedule them accordingly.

Here's an example use of `system.autoUpgrade`:

```nix
{
    system.autoUpgrade = {
      enable = true;
      allowReboot = true; # Allow automatic reboots when needed.
      dates = "02:00"; # Build and symlink the new generation at 2AM.
      flake = "github:alyraffauf/nixcfg"; # Build from my remote flake.
      operation = "switch"; # Activate the new generation immediately.

      # Schedule reboots between 2AM and 6AM.
      rebootWindow = {
        lower = "02:00";
        upper = "06:00";
      };
    };
}
```

This module automatically builds your system from the remote master branch at 2AM, activates the new generation immediately, and then schedules a reboot while you sleep. Downtime is minimized, and your system is always built from the most recent commit. Unlike other Nix deployment tools, it doesn't deploy in real time, so you may occasionally need to manually intervene. However, it's a great starting point for harmonizing your fleet of NixOS hosts and minimizing configuration drift.

It's not without its annoyances, though. If your laptop is not connected to the internet at 2AM (i.e., it is off or sleeping), `system.autoUpgrade` with this configuration will neither build nor activate the new generation. As an alternative, you can set `system.autoUpgrade.persistent` to `true`. This ensures that the autoUpgrade service runs whenever the user turns on their machine, provided it would have run when the machine was off or sleeping.

Initially, I had these machines set to `switch` as well, but I found that this fairly regularly introduced breakage and probably wasn't worth it. The carnage it caused is the inspiration for this post. Instead, I've opted to set `system.autoUpgrade.operation` to `boot` and `system.autoUpgrade.persistent` to `true`, which together ensure the system readies new generations for deployment but doesn't actually activate them until reboot.

Ideally, there would be an easy way to notify the user that a new generation is pending, as other distributions do. However, I'm not aware of any such feature for NixOS, so we rely on the user to manually reboot the system from time to time to activate the new generation. Being slightly behind the other hosts in the fleet is **usually** fine, and it certainly beats the having a broken and inconsistent system.

---

## Footnotes

[^fn1]: Personal Service Announcement. Because no one needs to hear this more than I do.
[^fn2]: I'm most familiar with [cachix](https://docs.cachix.org/deploy/) and [colmena](https://github.com/zhaofengli/colmena). These use more robust _push_ deployments, and can be automated with your preferred Git CI/CD solution, but they're not as simple as `system.autoUpgrade`.
