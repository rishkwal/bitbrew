# Getting Started with BitBrew

Welcome to BitBrew! This comprehensive guide will walk you through setting up BitBrew and creating your first Bitcoin test network.

## Prerequisites

Before diving into BitBrew, let's ensure you have the necessary tools installed.

### Docker

BitBrew leverages Docker to create isolated environments for Bitcoin nodes. This approach ensures consistency across different systems and simplifies the setup process.

- Download Docker from [docker.com](https://www.docker.com/products/docker-desktop)
- Installation steps vary by operating system:
  - Windows and Mac: Use the Docker Desktop installer
  - Linux: Follow the appropriate installation guide for your distribution
- After installation, open a terminal/command prompt and verify Docker is working:
  ```
  docker --version
  docker run hello-world
  ```

If both commands execute without errors, Docker is set up correctly.

### Node.js

BitBrew is built on Node.js, allowing it to run on various platforms.

- Download Node.js (version 18 or higher) from [nodejs.org](https://nodejs.org/en/download/)
- Choose the appropriate installer for your operating system
- After installation, verify by opening a terminal/command prompt and running:
  ```
  node --version
  npm --version
  ```

Both commands should return version numbers without any errors.

## Installation

With the prerequisites in place, you're ready to install BitBrew.

```bash
npm install -g bitbrew
```

This command installs BitBrew globally on your system, making the `bitbrew` command available from any directory.

Verify the installation:

```bash
bitbrew --version
```

If you see a version number, BitBrew is installed correctly.

## Quick Start Guide

Now, let's create your first Bitcoin test network and explore BitBrew's core features.

### 1. Brew Your Network

The `brew` command is your starting point with BitBrew. It sets up a basic network with two nodes.

```bash
bitbrew brew
```

This command:
- Creates two Docker containers, each running a Bitcoin Core node in regtest mode
- Sets up the necessary configuration for each node
- Starts the nodes

### 2. List Your Nodes

The `ls` command gives you an overview of your network.

```bash
bitbrew ls
```

You'll see a table with details about each node:
- Name: The identifier for each node
- Status: Whether the node is running or stopped
- Port: The network port the node is using
- RPC port: The port used for Remote Procedure Calls (RPC) to interact with the node

### 3. Connect the Nodes

In a real Bitcoin network, nodes discover and connect to each other automatically. In our controlled environment, we manually connect them.

```bash
bitbrew connect node0 node1
```

This command establishes a connection from `node0` to `node1`, allowing them to exchange information.

### 4. Create Wallets

Wallets are essential for managing funds in Bitcoin. Let's create two wallets:

```bash
bitbrew wallet create alice node0
bitbrew wallet create bob node1
```

These commands create wallets named "alice" and "bob" on `node0` and `node1` respectively. In a test environment, it's common to use descriptive names like this for clarity.

### 5. Mine Some Blocks

In Bitcoin, new coins are created through mining. Let's mine some blocks to generate coins:

```bash
bitbrew mine alice 101
```

This command:
- Mines 101 blocks
- Sends the block rewards to the "alice" wallet
- We mine 101 blocks because the coinbase transaction (which creates new coins) requires 100 confirmations before it can be spent

### 6. Send Funds

Now that we have some coins, let's perform a transaction:

```bash
bitbrew send alice bob 10
```

This command sends 10 BTC from Alice's wallet to Bob's wallet. In the background, BitBrew:
- Creates a transaction
- Signs it with Alice's wallet
- Broadcasts it to the network
- Mines a new block to confirm the transaction

### 7. Check Balances

To verify the transaction, let's check both wallets:

```bash
bitbrew wallet balance alice
bitbrew wallet balance bob
```

You should see that Bob's balance has increased by 10 BTC, while Alice's has decreased by slightly more than 10 BTC (the extra amount is the transaction fee).

## Next Steps

Congratulations! You've set up a Bitcoin test network, created wallets, mined blocks, and performed a transaction. Here's how you can dive deeper:

- Explore more commands with `bitbrew --help`
- Check out the [User Guide](user-guide/basic-concepts.md) for detailed information on each feature
- Try our [Examples](examples/multi-node-network.md) for more complex scenarios, like setting up multi-node networks or simulating specific network conditions
- Join our community forums or GitHub discussions to share your experiences and get help

Remember, BitBrew allows you to experiment freely without affecting the real Bitcoin network. Happy brewing, and enjoy exploring the world of Bitcoin development!