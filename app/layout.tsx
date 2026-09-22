import type {Metadata} from 'next';
import './globals.css';
import {Header,Footer} from '@/components/primitives';
export const metadata:Metadata={title:{default:'DIVERGE, PreStocks integrity monitor',template:'%s · DIVERGE'},description:'Independent onchain observations, sourced issuer evidence, market observations and lifecycle deadlines for PreStocks.',icons:{icon:[{url:'/icon.svg'},{url:'/icon.png'}],apple:'/apple-icon.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>;}
