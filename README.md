# BitBrew

> [!WARNING]
> This app is still in alpha phase of development.

<p align=center>
  <image src="https://github.com/user-attachments/assets/08a57f5a-099a-48c5-b37b-6c27ecc7350b" width=250/>
</p>
    
Bitbrew is a simple CLI tool to help you create and manage private Bitcoin test net works. It is designed to be easy to use and to provide a simple interface to the Bitcoin Core RPC API.

## Prerequisites

### Docker

BitBrew uses Docker to create and manage the nodes. Make sure that Docker is installed on your system and added to the path. You can download Docker from [here](https://www.docker.com/products/docker-desktop).

### Node.js

Make sure that Node.js is installed on your system. You can download Node.js from [here](https://nodejs.org/en/download/).

**Note**: Node.js version 18 or higher is recommended.

## Installation

```bash
$ npm install -g bitbrew
```

Check if the installation was successful by running:

```bash
$ bitbrew --version
```

## Usage

**Windows**: Run PowerShell as an administrator.

**Linux**: Run the following command to run the CLI as a superuser.

```bash
sudo su
```

Then you can find the list of available commands by running:

```plaintext
$ bitbrew --help
```

```plaintext
______ _ _  ______
| ___ (_) | | ___ \
| |_/ /_| |_| |_/ /_ __ _____      __
| ___ \ | __| ___ \ '__/ _ \ \ /\ / /
| |_/ / | |_| |_/ / | |  __/\ V  V /
\____/|_|\__\____/|_|  \___| \_/\_/


Usage: bitbrew [options] [command]

BitBrew: Craft your own Bitcoin test networks with ease

Options:
  -V, --version                                     output the version number
  -h, --help                                        display help for command

Commands:
  brew [options]                                    Brew your own Bitcoin test network
  connect [options] [source-node] [target-node...]  Connect nodes in the Bitcoin network
  ls                                                List your network nodes
  start [options] [node...]                         Start nodes in the Bitcoin network
  stop [options] [node...]                          Stop your Bitcoin test network
  add <name>                                        Add a new node to your Bitcoin test network
  clean                                             Clean up your Bitcoin test network
  remove <node>                                     Remove nodes from your Bitcoin test network
  exec <node> <command>                             Execute a command
  attach <node>                                     Attach to a running node
  wallet                                            Manage wallets
  send <from> <to> <amount>                         Transfer funds between wallets
  mine <wallet> [number]                            Mine a new block
  ```

## Quick Start

Start by brewing your network:

```bash
$ bitbrew brew
```

This will create and start two nodes `node0` and `node`.

### List the nodes

You can list the nodes by running:

```bash
$ bitbrew ls
```

```bash
┌─────────┬─────────┬───────────┬───────┬──────────┐
│ (index) │  name   │  status   │ port  │ RPC port │
├─────────┼─────────┼───────────┼───────┼──────────┤
│    0    │ 'node0' │ 'running' │ 20443 │  21443   │
│    1    │ 'node1' │ 'running' │ 20444 │  21444   │
└─────────┴─────────┴───────────┴───────┴──────────┘
```

### Connect the nodes

You can connect the nodes by running:

```bash
$ bitbrew connect node0 node1
```

This will create an outbound connection from `node0` to `node1`.

### Create a wallet

You can then create a wallet using the following command:

```bash
$ bitbrew wallet create alice node0
```

This will create a wallet named `alice` associated with `node0`.
We will create another wallet named `bob` associated with `node1`.

```bash
$ bitbrew wallet create bob node1
```
### List the wallets

You can list all the wallets by running:

```bash
$ bitbrew wallet ls
```

```bash
┌─────────┬─────────┬─────────┐
│ (index) │  name   │  node   │
├─────────┼─────────┼─────────┤
│    0    │ 'alice' │ 'node0' │
│    1    │  'bob'  │ 'node1' │
└─────────┴─────────┴─────────┘
```

### Mine blocks

You can mine blocks using the following command:

```bash
$ bitbrew mine alice 101
```
This will mine 101 blocks and send the rewards to the `alice` wallet.

### Send funds

You can send funds from one wallet to another using the following command:

```bash
$ bitbrew send alice bob 10
```

This will send 10 BTC from the `alice` wallet to the `bob` wallet.

### Check the balance

You can check the balance of a wallet using the following command:

```bash
$ bitbrew wallet balance alice
```
```yml
mine:
  trusted:           39.99999859
  untrusted_pending: 0
  immature:          5000
lastprocessedblock:
  hash:   5a730482a236de6f38adbd594af1bf8aa919c720d7ca964367c2fe13ae7c5bee
  height: 101
```

Congratulations! You have successfully created a Bitcoin test network, connected the nodes, created wallets, mined blocks, and sent funds between wallets.

## Advanced Usage

### Attach to a node

You can attach to a running node using the following command:

```bash
$ bitbrew attach node0
```

This will allow you to interact with the node's machine directly. You can use the `bitcoin-cli` command to interact with the node.

Enter `exit` to exit the node's machine.

### Execute a command

Optionally, you can execute a `bitcoin-cli` command on a node using the following command:

```bash
$ bitbrew exec node0 getblockchaininfo
```

```yml
chain:                regtest
blocks:               101
headers:              101
bestblockhash:        5a730482a236de6f38adbd594af1bf8aa919c720d7ca964367c2fe13ae7c5bee
difficulty:           4.656542373906925e-10
time:                 1721195807
mediantime:           1721195806
verificationprogress: 1
initialblockdownload: false
chainwork:            00000000000000000000000000000000000000000000000000000000000000cc
size_on_disk:         30375
pruned:               false
warnings:
```
