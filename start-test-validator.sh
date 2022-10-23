#!/usr/bin/env bash

solana-test-validator -q -r --bpf-program FGsPzi6df2SL1ycYaiXB5bP8WguC9iWVhdoChn3TVjLN ./target/deploy/solr_token_sale.so --bpf-program 4ikowHMssMavQeDUaDVGPwsBcNMnU1nkzAJikMFG5mfv ./deps/solr_token_whitelist.so --bpf-program CChTq6PthWU82YZkbveA3WDf7s97BWhBK4Vx9bmsT743 ./deps/token_vesting.so