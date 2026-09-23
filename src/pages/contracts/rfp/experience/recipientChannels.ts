import { validateEmail, validateChannelValue } from '@/utils/validation/contactValidation';
import { countries } from '@/utils/constants/countries';

export interface RecipientChannels { email: string; mobile?: string; mobileCountryCode?: string }
// Contacts may store international (+91...) or national digits with an ISO country.
// Strip only an explicit, matching international prefix; never infer a country.
export function normalizedMobile(value = '', countryCode = '') {
 const country = countries.find(c => c.code === countryCode);
 const dial = (country?.phoneCode || '').replace(/\D/g, '');
 const compact = value.trim().replace(/[\s().-]/g, '');
 if (dial && compact.startsWith('+' + dial)) return compact.slice(dial.length + 1);
 return value.trim();
}
export function validRecipientChannel(v: RecipientChannels) {
 return validateEmail(v.email || '').isValid || (!!v.mobile && validateChannelValue('mobile', normalizedMobile(v.mobile,v.mobileCountryCode),v.mobileCountryCode).isValid);
}
export function recipientChannels(contact: any): RecipientChannels {
 const channels=contact.contact_channels || [];
 const emails=channels.filter((c:any)=>c.channel_type==='email');
 const mobiles=channels.filter((c:any)=>c.channel_type==='mobile');
 const email=emails.find((c:any)=>validateEmail(c.value||'').isValid)?.value || contact.primaryEmail || '';
 const mobile=mobiles.find((c:any)=>validRecipientChannel({email:'',mobile:c.value,mobileCountryCode:c.country_code})) || mobiles[0];
 return {email,mobile:normalizedMobile(mobile?.value,mobile?.country_code),mobileCountryCode:mobile?.country_code||''};
}
export function mobileIdentity(v: RecipientChannels) {
 if(!v.mobile)return '';
 const dial=countries.find(c=>c.code===v.mobileCountryCode)?.phoneCode || v.mobileCountryCode || '';
 return dial.replace(/\D/g,'')+':'+normalizedMobile(v.mobile,v.mobileCountryCode).replace(/\D/g,'');
}
