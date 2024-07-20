# Creating a Network and Performing Transactions

This guide will walk you through a basic example of using BitBrew to create a Bitcoin test network, set up wallets, mine some blocks, and perform a transaction. By following this example, you'll gain hands-on experience with the core features of BitBrew.

## Step 1: Create a Network

First, let's create a simple network with two nodes.

```bash
bitbrew brew
```

This command creates and starts a network with two nodes: `node0` and `node1`.

Verify the network creation:

```bash
bitbrew ls
```

You should see output similar to:

```bash
┌─────────┬─────────┬───────────┬───────┬──────────┐
│ (index) │  name   │  status   │ port  │ RPC port │
├─────────┼─────────┼───────────┼───────┼──────────┤
│    0    │ 'node0' │ 'running' │ 20443 │  21443   │
│    1    │ 'node1' │ 'running' │ 20444 │  21444   │
└─────────┴─────────┴───────────┴───────┴──────────┘
```

## Step 2: Connect the Nodes

Now, let's connect the two nodes:

```bash
bitbrew connect node0 node1
```

This establishes a connection between `node0` and `node1`.

## Step 3: Create Wallets

We'll create two wallets, one for each node:

```bash
bitbrew wallet create alice node0
bitbrew wallet create bob node1
```

Verify the wallet creation:

```bash
bitbrew wallet ls
```

You should see:

```bash
┌─────────┬─────────┬─────────┐
│ (index) │  name   │  node   │
├─────────┼─────────┼─────────┤
│    0    │ 'alice' │ 'node0' │
│    1    │  'bob'  │ 'node1' │
└─────────┴─────────┴─────────┘
```

## Step 4: Mine Some Blocks

To get some coins in Alice's wallet, we'll mine 101 blocks:

```bash
bitbrew mine alice 101
```

This mines 101 blocks, with the block rewards going to Alice's wallet. We mine 101 blocks because the coinbase transactions (which create new coins) require 100 confirmations before they can be spent.

## Step 5: Check Balances

Let's check the balance in Alice's wallet:

```bash
bitbrew wallet balance alice
```

You should see a balance of 50 BTC for each block mined (minus the first block), so approximately 5000 BTC.

Bob's wallet should still have 0 BTC:

```bash
bitbrew wallet balance bob
```

## Step 6: Perform a Transaction

Now, let's send some Bitcoin from Alice to Bob:

```bash
bitbrew send alice bob 10
```

This sends 10 BTC from Alice's wallet to Bob's wallet.

## Step 7: Verify the Transaction

Check the balances again:

```bash
bitbrew wallet balance alice
bitbrew wallet balance bob
```

You should see that Bob now has 10 BTC, and Alice's balance has decreased by slightly more than 10 BTC (the extra amount is the transaction fee).

## Step 8: Mine Another Block

To ensure the transaction is confirmed, let's mine another block:

```bash
bitbrew mine alice 1
```

## Conclusion

Congratulations! You've successfully:

1. Created a Bitcoin test network
2. Connected nodes in the network
3. Created wallets
4. Mined blocks to generate coins
5. Performed a transaction between wallets

This basic example demonstrates the core functionality of BitBrew. From here, you can explore more advanced features like adding more nodes, creating complex network topologies, or simulating various Bitcoin network scenarios.

Remember to clean up your test network when you're done:

```bash
bitbrew clean
```

This removes all nodes and resets your BitBrew environment.
