# Token Sale + Vesting

## Environment Setup

1. Install the latest Rust stable from https://rustup.rs/
2. Install Solana v1.14.5 or later from https://docs.solana.com/cli/install-solana-cli-tools
3. Install [node](https://github.com/nvm-sh/nvm) 17.4.0
4. Install [anchor](https://www.anchor-lang.com/docs/installation) 0.25.0

## Build

```bash
$ cargo build-bpf
```

## Test

```bash
$ solana config set -ul
$ ./start-test-validator.sh &
$ anchor test --skip-build --skip-deploy --skip-local-validator
```