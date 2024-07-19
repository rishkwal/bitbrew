# Roadmap

This is a high-level roadmap for the BitBrew project. It outlines the key features and milestones planned for the project. The roadmap is subject to change based on feedback and contributions from the community.

**Last release**: 0.1.0-alpha

## 0.1.0

- [ ] Add debug logging and improve error handling
- [ ] Fix bugs from initial release and improve overall stability
- [ ] Improve help messages
- [ ] Use `esbuild` for more compact and faster builds
- [ ] Update documentation and add examples

## 0.2.0

- [ ] **Optimize and finalize the engine feature**
- [ ] Implement node renaming functionality
- [ ] Add support for creating multiple nodes with a single command (e.g., `bitbrew add -n 3`)
- [ ] Allow users to edit `bitcoin.conf` files for individual nodes
- [ ] Implement node restart functionality
- [ ] Other minor improvements and bug fixes

## Long-term Vision (1.0.0 and beyond)

- Develop a plugin system/architecture for extensibility
- Implement advanced features like custom signet networks and support for other Bitcoin implementations
- Create an API for programmatic interaction with the network
- Implement network visualization
- Add support for custom Docker images
- Develop snapshot and restore functionality for network states
- Implement time manipulation features (fast-forward, pause)
- Implement scalability solutions to span across multiple hosts

## Milestones

- [x] 0.1.0-alpha
  - [x] Initial project structure and core functionality
  - [x] Basic CLI interface with essential commands
  - [x] Docker integration for node management
  - [x] Wallet creation and management
  - [x] Basic transaction and mining capabilities


## Key Features to develop

- Improved error handling and logging
- Enhanced network management
- Advanced wallet operations
- Integration with external tools (explorers, monitoring)
- Snapshot and restore capabilities
- Time manipulation for testing scenarios
