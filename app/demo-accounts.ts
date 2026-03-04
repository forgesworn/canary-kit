// app/demo-accounts.ts — Pre-generated demo identities for testing

/** A demo account with pre-generated keys and kind-0 profile metadata. */
export interface DemoAccount {
  name: string
  bio: string
  nsec: string
  npub: string
  pubkey: string
}

/**
 * Four demo accounts for testing multi-member flows.
 * These are throwaway keys — never use them for real Nostr activity.
 */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = Object.freeze([
  {
    name: 'Alice',
    bio: 'Security researcher. Loves hiking.',
    nsec: 'nsec1vuhg9nandn0kas2w9uuvztwyla2fp7enfzz0emt6ly4gs6p5q3mqc6c6w5',
    npub: 'npub1x5zth0r5sx8q3jsjgjn4jmq9vhk6djq23mnyzttp0vucaymt5wrss9zqf7',
    pubkey: '3504bbbc74818e08ca1244a7596c0565eda6c80a8ee6412d617b398e936ba387',
  },
  {
    name: 'Bob',
    bio: 'Journalist covering human rights.',
    nsec: 'nsec1hszs2j8elt78kq6ewresrxfallpc6qvf0p33usgy9ujdkgu0mcesd4qryw',
    npub: 'npub1fhfrmrnjwzae87dg2je3k0m750q4y70qweqf2klwhwucy4myc87q25s78h',
    pubkey: '4dd23d8e7270bb93f9a854b31b3f7ea3c15279e07640955beebbb9825764c1fc',
  },
  {
    name: 'Charlie',
    bio: 'Aid worker, field ops lead.',
    nsec: 'nsec1xtpf5zgr2cx63v0dcflud46luerqnjqeel8drmp80k0dp66nf88s08j72c',
    npub: 'npub1mz50hua3k5htvhke075xk8eqjmhp0mr9ahhcdgzqsgw4kx0gvv6ql9cjr5',
    pubkey: 'd8a8fbf3b1b52eb65ed97fa86b1f2096ee17ec65edef86a040821d5b19e86334',
  },
  {
    name: 'Dana',
    bio: 'Conference organiser, Bitcoin maxi.',
    nsec: 'nsec1efpah2zcmt2huqwhxc2tjdwqze3q0e5h0u3xf4hj4fymwekzu3msmkncp8',
    npub: 'npub18pn0dtd6gvkrzpldf3cy62h8w6cekzu83u8qfqzjzmvlllcvwp3sf00cc3',
    pubkey: '3866f6adba432c3107ed4c704d2ae776b19b0b878f0e04805216d9ffff0c7063',
  },
])
