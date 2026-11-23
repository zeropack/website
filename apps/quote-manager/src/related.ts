import type {Ref} from './adapter.ts';

export function projectMatchesCompany(project:Ref,companyId:string):boolean {
 return !!companyId&&project.companyIds?.length===1&&project.companyIds[0]===companyId;
}

export function dealMatchesCompany(deal:Ref,companyId:string,contacts:Ref[],projects:Ref[]):boolean {
 if(!companyId)return false;
 const linkedContacts=contacts.filter(c=>deal.contactIds?.includes(c.id));
 const linkedProjects=projects.filter(p=>deal.projectIds?.includes(p.id));
 const companyIds=[...linkedContacts.flatMap(c=>c.companyIds??[]),...linkedProjects.flatMap(p=>p.companyIds??[])];
 // An unlinked or conflicting record cannot establish a single relevant company.
 return companyIds.length>0&&companyIds.every(id=>id===companyId);
}

export function relatedDeals(companyId:string,deals:Ref[],contacts:Ref[],projects:Ref[]):Ref[] {
 return deals.filter(deal=>dealMatchesCompany(deal,companyId,contacts,projects));
}

export function relatedProjects(companyId:string,projects:Ref[]):Ref[] {
 return projects.filter(project=>projectMatchesCompany(project,companyId));
}
