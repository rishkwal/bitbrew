# BitBrew Command Reference

This guide provides a comprehensive list of all available BitBrew commands, their syntax, options, and brief descriptions.

## Network Management

### `brew`

Creates and starts a new Bitcoin test network.

Syntax: `bitbrew brew [options]`

Options:

- `-n, --nodes <number>`: Number of nodes to create (default: 2)
- `-e, --engine`: Start the BitBrew engine for automatic network activity

Example: `bitbrew brew -n 3`

### `connect`

Connects nodes in the Bitcoin network.

Syntax: `bitbrew connect [options] [source-node] [target-node...]`

Options:

- `-a, --all`: Connect all nodes in a round-robin fashion

Example: `bitbrew connect node0 node1 node2`

### `ls`

Lists all nodes in your Bitcoin test network.

Syntax: `bitbrew ls`

### `start`

Starts nodes in the Bitcoin network.

Syntax: `bitbrew start [options] [node...]`

Options:

- `-a, --all`: Start all nodes

Example: `bitbrew start node0 node1`

### `stop`

Stops nodes in your Bitcoin test network.

Syntax: `bitbrew stop [options] [node...]`

Options:

- `-a, --all`: Stop all nodes

Example: `bitbrew stop node0`

### `add`

Adds a new node to your Bitcoin test network.

Syntax: `bitbrew add <name>`

Example: `bitbrew add node3`

### `remove`

Removes nodes from your Bitcoin test network.

Syntax: `bitbrew remove <node>`

Example: `bitbrew remove node2`

### `clean`

Cleans up your Bitcoin test network, removing all nodes and associated data.

Syntax: `bitbrew clean`

## Node Interaction

### `exec`

Executes a command on a specific node.

Syntax: `bitbrew exec <node> <command>`

Example: `bitbrew exec node0 getblockchaininfo`

### `attach`

Attaches to a running node, allowing direct interaction.

Syntax: `bitbrew attach <node>`

Example: `bitbrew attach node1`

## Wallet Operations

### `wallet create`

Creates a new wallet for a specified node.

Syntax: `bitbrew wallet create <name> <node>`

Example: `bitbrew wallet create alice node0`

### `wallet ls`

Lists all wallets in your Bitcoin test network.

Syntax: `bitbrew wallet ls`

### `wallet balance`

Displays the balance of a specified wallet.

Syntax: `bitbrew wallet balance <name>`

Example: `bitbrew wallet balance alice`

### `send`

Transfers funds between wallets.

Syntax: `bitbrew send <from> <to> <amount>`

Example: `bitbrew send alice bob 10`

## Mining

### `mine`

Mines a specified number of blocks, with rewards going to the specified wallet.

Syntax: `bitbrew mine <wallet> [number]`

Example: `bitbrew mine alice 10`

## Miscellaneous

### `--version`

Displays the version of BitBrew.

Syntax: `bitbrew --version`

### `--help`

Displays help information for BitBrew or a specific command.

Syntax: `bitbrew --help [command]`

Example: `bitbrew --help connect`

---

Remember that all commands should be prefixed with `bitbrew`. For more detailed information on each command and its usage, you can use the `--help` option with any command.