import type { Lifecycle, SymbolName, Attestation } from '@/lib/types';
// Manually reviewed first-party pages on 2026-09-21. Dates below are issuer terms,
// not events inferred from market prices, an RPC account, or news.
export const VERIFIED_AT = '2026-09-21';
export const HISTORICAL_XAI_MINT = 'PreC1KtJ1sBPPqaeeqL6Qb15GTLCYVvyYEwxhdfTwfx';
function none(symbol:SymbolName, verifiedAt=VERIFIED_AT):Omit<Lifecycle,'state'|'daysRemaining'>{
 return {symbol,event:'NONE_ON_FILE',successor:null,target:null,ratio:null,deadline:null,consequence:null,action:null,sourceUrl:`https://prestocks.com/${symbol.toLowerCase()}`,verifiedAt};
}
const records: Record<SymbolName, Omit<Lifecycle, 'state' | 'daysRemaining'>> = {
 ANDURIL: none('ANDURIL','2026-09-22'),
 ANTHROPIC: none('ANTHROPIC'),
 FIGUREAI: none('FIGUREAI','2026-09-22'),
 KALSHI: none('KALSHI','2026-09-22'),
 NEURALINK: none('NEURALINK','2026-09-22'),
 OPENAI: none('OPENAI'),
 POLYMARKET: none('POLYMARKET','2026-09-22'),
 XAI: { symbol:'XAI', event:'ACQUIRED', successor:'SpaceX', target:'SPACEX', ratio:0.7165, deadline:'2026-09-12T23:59:00Z', consequence:'Issuer states that unconverted tokens expire worthless after the deadline.', action:'Convert each XAI into 0.7165 SPACEX.', sourceUrl:'https://prestocks.com/xai', verifiedAt:VERIFIED_AT },
 SPACEX: { symbol:'SPACEX', event:'PUBLIC_COMPANY_TRANSITION', successor:null, target:'$SPCXx or any other token', ratio:null, deadline:'2027-03-12T23:59:00Z', consequence:'Issuer states that unconverted tokens expire worthless after the deadline.', action:'Swap SpaceX PreStocks into $SPCXx or any other token before the deadline.', sourceUrl:'https://prestocks.com/spacex', verifiedAt:VERIFIED_AT },
};
export function lifecycleFor(symbol: SymbolName, now = Date.now()): Lifecycle {
 const record = records[symbol];
 const remaining = record.deadline ? Date.parse(record.deadline) - now : null;
 return { ...record, state: remaining === null ? 'NONE_ON_FILE' : remaining <= 0 ? 'WINDOW_CLOSED' : 'ACTION', daysRemaining: remaining === null ? null : Math.max(0, remaining / 86_400_000) };
}
const scope = 'BlockOffice reviewed issuer-provided documents and public information as of the report date. This is a third-party attestation, not a statutory audit or a live custody feed. Diverge has not reproduced the underlying document review.';
export const attestations: Partial<Record<SymbolName, Attestation>> = {
 SPACEX: { provider:'BlockOffice Pte. Ltd.', reviewer:'Hue Man Keong · ACCA 5071512', reportDate:'2026-06-17', mintableSupply:'43730.30', mintedSupply:'43713.43', sourceUrl:'https://prestocks.com/documents/spacex-prestocks-attestation-report.pdf', scope },
 ANTHROPIC: { provider:'BlockOffice Pte. Ltd.', reviewer:'Hue Man Keong · ACCA 5071512', reportDate:'2026-07-24', mintableSupply:'7384.00', mintedSupply:'7383.88', sourceUrl:'https://prestocks.com/documents/anthropic-prestocks-attestation-report.pdf', scope },
 KALSHI: { provider:'BlockOffice Pte. Ltd.', reviewer:'Hue Man Keong · ACCA 5071512', reportDate:'2026-07-15', mintableSupply:'1312.00', mintedSupply:'1311.99', sourceUrl:'https://prestocks.com/documents/kalshi-prestocks-attestation-report.pdf', scope },
 POLYMARKET: { provider:'BlockOffice Pte. Ltd.', reviewer:'Hue Man Keong · ACCA 5071512', reportDate:'2026-07-15', mintableSupply:'4820.00', mintedSupply:'4818.97', sourceUrl:'https://prestocks.com/documents/polymarket-prestocks-attestation-report.pdf', scope },
};
export const FAQ_URL = 'https://prestocks.com/faq?tab=legal';
export const MARKET_LIMITATION = 'A thin or missing Jupiter route does not establish that the asset lacks liquidity through issuer, RFQ, OTC, centralized, or other venues.';
