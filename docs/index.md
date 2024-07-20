# Introduction

<p align="center">
  <img src="https://github.com/user-attachments/assets/08a57f5a-099a-48c5-b37b-6c27ecc7350b" width="250" alt="BitBrew Logo">
</p>

BitBrew is a powerful CLI tool designed to revolutionize Bitcoin test network interactions. By providing an intuitive interface to the Bitcoin Core RPC API and leveraging regtest mode, BitBrew creates isolated networks ideal for testing, development, and educational purposes.

!!! warning
    BitBrew is currently in the alpha phase of development. While functional, it may contain bugs or undergo significant changes.

## The Challenge with Traditional Testnets

Bitcoin developers and testers often face significant hurdles when working with traditional testnets. These public networks can be unpredictable and unreliable, with constantly changing network conditions. Developers have limited control over crucial aspects like block times and mining, while competition for shared resources can hinder efficient development and testing.

Recent events have further highlighted the volatility of public testnets. For instance, a [griefing attack on Bitcoin's testnet](https://www.theblock.co/post/291519/bitcoin-testnet-griefing-attack-generates-three-years-worth-of-blocks-in-one-week-frustrating-developers) generated three years' worth of blocks in just one week, causing significant disruptions for developers.

Setting up a private testnet manually is often a complex, time-consuming, and error-prone process. These challenges can significantly slow down development, complicate testing processes, and create barriers for newcomers to Bitcoin development.

## BitBrew: Crafting Reliable Test Environments

BitBrew addresses these challenges head-on by allowing you to brew your own private Bitcoin test networks. With BitBrew, you can:

- Create isolated environments free from external interference
- Maintain full control over block generation, mining, and network conditions
- Spin up a fully functional test network with a single command
- Ensure a stable, predictable environment for repeatable tests and experiments

## Key Features and Benefits

BitBrew stands out for its simplicity and power, offering a streamlined way to work with Bitcoin networks:

- **Easy Network Creation**: Brew your own Bitcoin test network with a single command.
- **Comprehensive Node Management**: Effortlessly add, remove, start, and stop nodes in your network.
- **Wallet Operations**: Create wallets, mine blocks, and transfer funds between wallets with ease.
- **Network Visualization**: Quickly list and inspect your network nodes and their connections.
- **Direct Node Interaction**: Attach to nodes or execute Bitcoin Core commands directly from the CLI.

By choosing BitBrew, you're opting for reliability over unpredictable testnet behavior, simplified setup over complex configurations, and a controlled environment perfect for learning and development. The Docker integration ensures consistent and isolated environments, making BitBrew an ideal tool for both seasoned developers and newcomers to Bitcoin development.

## Quick Start

Get started with BitBrew in minutes:

```bash
npm install -g bitbrew
bitbrew brew
```

This simple command installs BitBrew and creates your first test network with two regtest nodes, giving you immediate access to a controlled Bitcoin testing environment.

## Next Steps

To dive deeper into BitBrew:

1. Check out [Getting Started](getting-started.md) for detailed setup instructions.
2. Have a look at all the commands at [Command Reference](user-guide/command-reference.md)
3. Look at an [example](examples/basic-usage.md).

Join us in brewing the future of Bitcoin development, where reliable and controllable test environments are just a command away!