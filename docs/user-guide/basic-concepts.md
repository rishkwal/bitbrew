# Basic Concepts

Welcome to the BitBrew Basic Concepts guide. This document will introduce you to the fundamental components and ideas behind BitBrew and its Bitcoin test networks. Understanding these concepts will help you make the most of BitBrew's features.

## Nodes

In the context of BitBrew, a node represents a Bitcoin Core instance running in regtest mode. Each node is an independent participant in your test network, capable of mining blocks, validating transactions, and maintaining a copy of the blockchain. BitBrew creates and manages these nodes using Docker containers, providing a consistent and isolated environment for each node.

Key characteristics of nodes in BitBrew:

- Independent Bitcoin Core instances
- Run in regtest mode
- Managed via Docker containers
- Identified by simple names (e.g., `node0`, `node1`)

Common node operations:

1. Add a node: `bitbrew add <node_name>`
2. Remove a node: `bitbrew remove <node_name>`
3. Start a node: `bitbrew start <node_name>`
4. Stop a node: `bitbrew stop <node_name>`
5. List all nodes: `bitbrew ls`

**Note**: For all BitBrew nodes, the default RPC credentials are: `rpcuser=user` and `rpcpassword=pass`.

## Wallets

Wallets in BitBrew are Bitcoin wallets associated with specific nodes. They serve as the interface for managing, sending, and receiving Bitcoin within your test network. Each wallet is tied to a specific node, allowing you to simulate different participants in your Bitcoin network.

Key points about wallets:

- Associated with specific nodes
- Manage private keys and addresses
- Can have descriptive names (e.g., "alice", "bob")
- Simulate different network participants

Wallet operations:

1. Create a wallet: `bitbrew wallet create <wallet_name> <node_name>`
2. List wallets: `bitbrew wallet ls`
3. Check balance: `bitbrew wallet balance <wallet_name>`
4. Send funds: `bitbrew send <from_wallet> <to_wallet> <amount>`

## Network

The network in BitBrew refers to the collection of interconnected nodes that form your private Bitcoin test environment. This network is completely isolated from the public Bitcoin network, giving you full control over network conditions, block generation, and connections.

Network features:

- Isolated from the public Bitcoin network
- Fully controllable environment
- Customizable topology and conditions

Main network operations:

1. Create a network: `bitbrew brew`
2. Connect nodes: `bitbrew connect <source_node> <target_node>`
3. Mine blocks: `bitbrew mine <wallet_name> <number_of_blocks>`

## Regtest Mode

BitBrew uses Bitcoin Core's regression test mode (regtest). This mode is specifically designed for testing and development purposes, offering features that make it ideal for creating controlled test environments.

Key features of regtest mode:

- Instant block generation on-demand
- Easy blockchain reset (stop and restart network)
- Completely controlled environment
- No influence from external factors

## Docker Integration

BitBrew leverages Docker to create isolated environments for each node. This integration provides several key benefits for testing and development.

Benefits of Docker integration:

1. Consistency across different systems
2. Easy setup and teardown of nodes
3. Isolation between nodes and from the host system
4. Realistic simulation of network environments

## Understanding BitBrew's Workflow

The typical BitBrew workflow follows these steps:

1. Create a network (`brew`): Sets up Docker containers for nodes.
2. Connect nodes: Establishes connections between nodes in your network.
3. Create wallets: Allows you to manage funds within nodes.
4. Mine blocks: Generates new blocks and Bitcoin in your test network.
5. Perform transactions: Send Bitcoin between wallets to simulate activity.

This workflow allows you to create complex scenarios and test various aspects of Bitcoin applications in a controlled, realistic environment.

By understanding these basic concepts, you'll be well-equipped to use BitBrew effectively for your Bitcoin development and testing needs. As you become more familiar with these components, you'll be able to create increasingly complex scenarios and thoroughly test various aspects of Bitcoin applications.

For more detailed information on each concept and associated commands, please refer to the respective sections in the User Guide.