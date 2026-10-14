import type {Ref} from './adapter.ts';
// Verified original quotation labels -> canonical Company IDs. Names are read live.
const supplierCompanies:Record<string,string>={
 'Shanghai Huiang Industrial Co., Ltd.':'2877657695',
 'Mianyang Jersey Mellon Electronic Commerce Co':'2877677987',
 'Quick Fish Logistics':'2877675789',
 'Guangzhou Origional Bamboo Tevhnology Co., Ltd.':'2877675788',
 'Dongguan Oumeng Houseware Products Co., Ltd.':'2877675787',
 'Bai Cao Quan Yu':'2877657694',
 'Wedderburn':'2877677989',
 'Shenzhen Kingcolor Paper Co., Ltd.':'2877675790',
 'MCC Labels':'2877677988'
};
export function supplierCompany(label:string,companies:Ref[]):Ref|undefined {
 const id=supplierCompanies[label];
 if(id)return companies.find(c=>c.id===id);
 const exact=companies.filter(c=>c.name===label);
 return exact.length===1?exact[0]:undefined;
}
export function supplierOptions(labels:string[],companies:Ref[]):Ref[]{return labels.map(label=>({id:label,name:supplierCompany(label,companies)?.name??label}));}
