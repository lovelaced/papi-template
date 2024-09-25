# **demo polkadot api dapp - block number fetcher**

so you wanna mess around with a polkadot dapp, huh? cool. this one's about as basic as it gets. the goal: fetch the latest block number from the polkadot chain and show it off in the ui. you'll be working with react, typescript, and some light polkadot api stuff. don't stress it, we got you.

## **what this dapp does:**
- connects to polkadot via **smoldot** (lightweight client, super low overhead).
- fetches **real-time block numbers** as new blocks are created on-chain.
- displays the latest block number, no fluff.
  
## **prereqs**
1. **node.js** (v14.x or higher). just grab it from [here](https://nodejs.org/). if you don’t have it already.
2. **git**: download it [here](https://git-scm.com/) if you somehow don’t already have it.

## **setup**
don't worry about manual setup — there’s a script for that. here’s how you get up and running:

1. **clone the repo**:
   ```bash
   git clone https://github.com/lovelaced/papi-template.git
   cd papi-template
   ```

2. **install deps**:
   ```bash
   npm install 
   ```

3. **generate papi descriptors**:
   ```bash
   npx papi generate
   ```

4. **run the app**:
   ```bash
   npm run dev
   ```
   this is the magic command. it spins up the dev server and launches the app in your default browser. the app should pop up at `http://localhost:5173`. the block number should start showing up shortly after.

**tl;dr**: clone, install deps, then `npm run dev`.

---

## **what's happening here?**
this isn't some super deep project, but it's a great place to get comfortable with some core concepts. here’s a rundown:

### **react + typescript + polkadot api**
- **react** for the UI.
- **typescript** to keep things type-safe and predictable.
- **polkadot-api** to interact with the blockchain and listen for block updates.
- **smoldot** light client for polkadot handles blockchain connections in a webworker so it doesn’t mess with the main thread.

### **how it works**
1. **ChainProvider**: initializes the polkadot api client and makes it available to any component that needs it. it's like the water main of your app — all the blockchain data flows from here.
2. **BlockNumberDisplay**: this component subscribes to the latest block number and renders it to the screen. that's it.
3. **custom hooks**: `useFetchBlockNumber` handles the logic of talking to the blockchain and getting new block numbers in real-time.

---

## **commands**
only one thing matters here:  
```bash
npm run dev
```
that’s the command that runs the app in development mode. if you forget everything else, remember this.

if you want to build the app for production later on (you probably don't, but just in case):
```bash
npm run build
```

---

## **what you should do next:**
1. fire it up, play around with it. it's a dapp; get the block number showing and try to understand how the whole api thing works.
2. maybe tweak the ui or add some more data from the chain, like balances or transactions. sky’s the limit.

---

## **a quick walkthrough**

1. **block number fetching**: you’re pulling in real-time block numbers, subscribing to updates as new blocks are produced on the polkadot chain.
2. **ChainProvider**: wraps your entire app and makes sure the blockchain connection is available everywhere you need it.
3. **custom hooks**: react hooks let you reuse logic and stay clean. `useFetchBlockNumber` listens for the block number, then updates the ui whenever a new block comes in.

---

## **things to know if you're new**

1. **context in react**: this lets you share the polkadot api across all components without passing props around like it’s the stone age. we use `ChainProvider` to handle that.
2. **react hooks**: functions that let you use react features like state and lifecycle methods in functional components. you’ll see `useState` for state management and `useEffect` for triggering side effects like api calls.
3. **smoldot**: this is the light polkadot client we're using to connect to the blockchain. it runs in a background web worker so it doesn't slow down the main thread (your ui).

---

## **troubleshooting**

- **it's stuck on loading the block number**: check the console for errors. might be a connection issue with smoldot or something wrong with the api setup.
- **npm start not working**: make sure node.js and npm are installed correctly, and you ran `./papi-install.sh` first.
- **still lost?**: hit up the docs for [polkadot-api](https://papi.how) or ask a dev who knows what they’re doing.

---

## **next steps**
- mess around with the polkadot api more: try fetching other data, like account balances or transaction info.
- style it up: give the dapp some flair, make it more visually appealing.
- learn by breaking things: edit the code, see what happens, and learn from it.

---

### **credits & thanks**
you’ve now got a functioning polkadot api demo running. this is just the start. if you wanna go deeper, keep exploring the polkadot ecosystem, react, and typescript.


