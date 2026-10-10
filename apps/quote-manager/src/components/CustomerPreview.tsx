import {customerQuotation} from '../customer.ts';
import type {Draft} from '../schema.ts';
export function CustomerPreview({draft}:{draft:Draft}) {
 const quote=customerQuotation(draft);
 return <section className="customer-preview" aria-label="Customer quotation preview"><div className="eyebrow">CUSTOMER DESCRIPTION PREVIEW</div><h2>{quote.reference||'Untitled quotation'}</h2><p className="preserve-lines">{quote.description||'Add the customer description.'}</p><dl><div><dt>Quantity</dt><dd>{quote.quantity||'—'}</dd></div><div><dt>Product price / unit (AUD)</dt><dd>{quote.unitPriceAUD||'—'}</dd></div><div><dt>Artwork reference</dt><dd>{quote.artwork||'—'}</dd></div></dl><small>Internal draft review · No customer access or issuance</small></section>;
}
