+++
title = "deployer.sh: Mildly Better Flake Deployments"
date = "2025-05-19"
description = "A simple Nix deployment tool I've been using lately."
keywords = "nix, nixos, flakes, linux, cicd, deployment, devops"
tags = ["nix", "bash", "cicd", "linux"]
toc = true
+++

## Introduction

You probably don't need a new [NixOS](https://nixos.org/) deployment tool.

In fact, NixOS already includes one: it can build, roll back, and switch between NixOS configurations on the local machine as well as on remote machines. It's the main way most users interact with their operating system: [`nixos-rebuild`](https://nixos.org/manual/nixos/stable/#sec-nixos-rebuild).

But what if you need to consistently deploy the same [flake](https://nixos.wiki/wiki/Flakes) to multiple hosts? Sure, you could do something like this:

```bash
nixos-rebuild switch --flake .#mauville --target-host root@my-host &&
nixos-rebuild switch --flake .#slateport --target-host root@my-host2
```

That's a lot of typing that scales poorly as you add hosts. It also introduces room for error—for example, typing the wrong IP address may deploy the wrong `nixosConfiguration` to an unintended host.

There are a few options for solving this problem. If you're a _channels_ (rather than flakes) user, something like [NixOps](https://github.com/NixOS/nixops) might work. Otherwise, solutions like [Colmena](https://github.com/colmena/colmena) are robust and flexible. Other options, such as [Cachix Deploy](https://docs.cachix.org/deploy), rely on a daemon running on the host and support features like automatic rollbacks and seamless background deployments.

However, many of these tools are designed for large fleets with dozens (or hundreds) of hosts and significant complexity. All _I_ really need is a one‑command tool to deploy my flake to the seven headless machines in my home lab. I don't need complex orchestration, and I don't want to marry myself to a particular way of building my flake or other infrastructure.

My requirements were simple:

- Nix‑native _declarative_ configuration.
- Minimal dependencies outside native Nix tooling.
- Basic sanity checks for safety and reliability.
- Full support for Nix flakes.

First, I dug into the Nix documentation and the source code for `nixos-rebuild`. It turns out it's actually quite simple to write your own deployment tool for NixOS—and it's not nearly as risky as it sounds!

So I wrote [deployer.sh](https://github.com/alyraffauf/nixcfg/blob/master/utils/deployer.sh). It's a small Bash script that builds NixOS configurations, copies them to remote machines, and activates them. It's flake‑only and dead simple to use. It does everything I need it to do, exactly how I want it done. Oh, and it has pretty colors.

Here's what it does.

---

## Step 1: Parsing deployments.nix

Your `deployments.nix` is a simple [attribute set](https://nixos.org/manual/nix/stable/language/attributes) of job names along with their target hostname (or IP address), output, and remote SSH user. **deployer.sh** supports privilege elevation with `sudo`, but you can also target any user able to rebuild the system.

```nix
# deployments.nix
{
  lavaridge = {
    output   = "lavaridge";
    hostname = "lavaridge";
    user     = "root";
  };

  lilycove = {
    output   = "lilycove";
    hostname = "lilycove";
    user     = "root";
  };
}
```

deployer.sh reads this file once and stores the values in a Bash array via an intermediary JSON expression derived from the Nix attribute set:

```bash
# deployer.sh
HOSTS_JSON="$(nix eval --json -f "$DEPLOYMENTS")"
mapfile -t HOSTS < <(printf '%s\n' "$HOSTS_JSON" | jq -r 'keys[]')
```

---

## Step 2: Build closures

In NixOS, a [closure](https://zero-to-nix.com/concepts/closures/) is every package needed to run a system—the kernel, drivers, your packages, and all their dependencies. **deployer.sh** builds each closure locally—on the machine running deployer—and stores the resulting paths in a Bash array.

**deployer.sh** builds each closure sequentially and exits safely upon any build failure. If a closure doesn't build, none of them are deployed. This prevents uneven states that can cause unexpected behavior in tightly integrated fleets.

If you have [remote builders](https://nixos.org/manual/nix/stable/advanced-topics/distributed-builds) configured, **deployer.sh** will happily use them. Because it shells out to [`nix build`](https://nixos.org/manual/nix/stable/command-ref/new-cli/nix3-build), it inherits whatever distributed‑build setup you already have, so heavy compilations can be off‑loaded to faster lab boxes and the laptop running the script stays cool.

```bash
# deployer.sh
for host in "${HOSTS[@]}"; do
  echo -e "[deployer] ${YELLOW}Building nixosConfigurations.${host}.config.system.build.toplevel...${NC}"

  # Build, piping JSON to jq; warnings to stderr
  out=$(nix build \
        --no-link \
        --json \
        ".#nixosConfigurations.${host}.config.system.build.toplevel" \
        2>/dev/null | jq -r '.[0].outputs.out')

  OUT_PATHS["$host"]="$out"
  echo -e "[deployer] ${GREEN}✔ Built: ${out}${NC}"
done
```

---

## Step 3: Copy closure & activate

Now that we have our closures, we can copy them to the remote machines and activate them. Each NixOS generation includes a [`switch-to-configuration`](https://nixos.org/manual/nixos/stable/#sec-switch-to-configuration) script, which can switch to a new generation, roll back to a prior one, or schedule the switch for the next boot. **deployer.sh** uses this script to activate the new generation.

```bash
# deployer.sh
for host in "${HOSTS[@]}"; do
  host_json=$(printf '%s\n' "$HOSTS_JSON" | jq --arg h "$host" '.[$h]')
  hostname=$(printf '%s\n' "$host_json" | jq -r '.hostname')
  user=$(printf '%s\n' "$host_json" | jq -r '.user')
  target="${user}@${hostname}"
  out="${OUT_PATHS[$host]}"

  echo -e "[deployer] ${YELLOW}Deploying to ${target}...${NC}"

  # Copy the closure
  nix copy --to "ssh://${target}" "$out"

  # Activate remotely
  # shellcheck disable=SC2029
  ssh "$target" "sudo '${out}/bin/switch-to-configuration' '${OPERATION}'"

  echo -e "[deployer] ${GREEN}✔ Deployed to ${target}.${NC}"
done
```

Assuming no errors, **deployer.sh** exits successfully. We're deployed!

---

## Limitations

Such a simple script comes with limitations compared with more feature‑rich alternatives. Here are a few things it _doesn't_ do:

- Automatic rollbacks (not feasible in this design).
- Parallel deployments (probably not worth it).
- Deploying any Nix profile outside `nixosConfigurations`.
- Split deployments (tags, groups, etc.).

If you need any of these features, you're likely better off with an existing solution. That said, I have a couple of improvements in mind:

- [nh](https://github.com/nix-community/nh)-like informational dialogs.
- Config via deployment.nix (instead of relying on environment variables).
- Rewriting the script in _anything_ other than Bash.
- Separate copy and activation steps.

---

## Conclusion

deployer.sh is a reasonably simple, mostly predictable, and fairly safe deployment tool for NixOS—in other words, it's pretty mediocre. It's not breaking new ground, but it's mine, and I'm happy to no longer fiddle with `nixos-rebuild`'s myriad flags and limitations.

To be clear, **deployer.sh** isn't a _real_ project. It's a little utility in my flake. But hopefully you'll find this a good starting point for writing your own quick deployment tool. If you do, I'd love to see how it goes!
