const { createPublicClient, http, formatEther } = require('viem');
const { base } = require('viem/chains');

const client = createPublicClient({ chain: base, transport: http('https://mainnet.base.org') });
client.getBalance({ address: '0xBa2631E3CfdB475898c1747d2Be1B88C4763B522' }).then(b => console.log('Master balance:', formatEther(b), 'ETH'));
