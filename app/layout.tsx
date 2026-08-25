import type { Metadata } from 'next';
import './globals.css';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'';
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL??'https://honors-societies-club-elac.zcheng-xyg.chatgpt.site';
const asset=(path:string)=>`${basePath}${path}`;
export const metadata:Metadata={
  metadataBase:new URL(siteUrl),
  title:'Honors Societies Club | East Los Angeles College',
  description:'Academic support, transfer preparation, career development, service, and community at East Los Angeles College.',
  icons:{icon:asset('/og.png')},
  openGraph:{title:'Honors Societies Club',description:'Go further, together at East Los Angeles College.',type:'website',images:[{url:asset('/og.png'),width:1731,height:909,alt:'Honors Societies Club — Go further, together.'}]},
  twitter:{card:'summary_large_image',title:'Honors Societies Club',description:'Go further, together at East Los Angeles College.',images:[asset('/og.png')]}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
