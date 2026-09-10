// Built-in starter templates. These are generic drafting starting points,
// not legal advice — see the disclaimer surfaced throughout the app.
// Noncompete enforceability varies a lot by state (some states, like
// California, Minnesota, North Dakota, and Oklahoma, void them almost
// entirely for employees) so the noncompete template leans on a
// user-supplied governing state and warns accordingly.

const NDA_FIELDS = [
  { key: 'effective_date', label: 'Effective date', type: 'date', required: true },
  { key: 'party_a_name', label: 'Your business/entity name', type: 'text', required: true },
  { key: 'party_a_address', label: 'Your business address', type: 'text', required: true },
  { key: 'party_b_name', label: 'Other party\'s name', type: 'text', required: true },
  { key: 'party_b_address', label: 'Other party\'s address', type: 'text', required: false },
  { key: 'purpose', label: 'Purpose of disclosure (why info is being shared)', type: 'textarea', required: true },
  { key: 'term_years', label: 'Confidentiality term (years)', type: 'number', required: true, default: '2' },
  { key: 'governing_state', label: 'Governing state/jurisdiction', type: 'text', required: true },
];

const MUTUAL_NDA_BODY = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of {{effective_date}} ("Effective Date"), by and between {{party_a_name}}, located at {{party_a_address}} ("Party A"), and {{party_b_name}}, located at {{party_b_address}} ("Party B") (each a "Party" and together the "Parties").

1. PURPOSE
The Parties wish to explore a potential business relationship in connection with: {{purpose}} (the "Purpose"). In connection with the Purpose, each Party may disclose to the other certain confidential and proprietary information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by either Party to the other, whether orally, in writing, or in any other form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure, including but not limited to business plans, financial information, customer lists, technical data, trade secrets, and product designs.

3. EXCLUSIONS
Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the receiving Party; (b) was rightfully known to the receiving Party prior to disclosure; (c) is rightfully received from a third party without breach of any confidentiality obligation; or (d) is independently developed by the receiving Party without use of the disclosing Party's Confidential Information.

4. OBLIGATIONS
Each Party agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) not disclose such Confidential Information to any third party without prior written consent; (c) use the Confidential Information solely for the Purpose; and (d) protect the Confidential Information using at least the same degree of care it uses for its own confidential information, and no less than a reasonable degree of care.

5. TERM
This Agreement shall remain in effect for {{term_years}} year(s) from the Effective Date. The confidentiality obligations under Section 4 shall survive termination of this Agreement for that same period with respect to Confidential Information disclosed during the term.

6. RETURN OF MATERIALS
Upon request of the disclosing Party, the receiving Party shall promptly return or destroy all documents and materials containing Confidential Information.

7. NO LICENSE
Nothing in this Agreement grants either Party any rights to the other Party's Confidential Information beyond the limited right to use it for the Purpose.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of {{governing_state}}, without regard to its conflict of laws principles.

9. REMEDIES
The Parties agree that unauthorized disclosure of Confidential Information may cause irreparable harm for which monetary damages would be an inadequate remedy, and that the non-breaching Party shall be entitled to seek injunctive relief in addition to any other available remedies.

10. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties concerning its subject matter and supersedes all prior discussions or agreements, whether oral or written, relating to the same subject matter.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

PARTY A: {{party_a_name}}
PARTY B: {{party_b_name}}`;

const ONEWAY_NDA_BODY = `NON-DISCLOSURE AGREEMENT (ONE-WAY)

This Non-Disclosure Agreement ("Agreement") is entered into as of {{effective_date}} ("Effective Date"), by and between {{party_a_name}}, located at {{party_a_address}} ("Disclosing Party"), and {{party_b_name}}, located at {{party_b_address}} ("Receiving Party").

1. PURPOSE
The Disclosing Party wishes to disclose certain confidential information to the Receiving Party in connection with: {{purpose}} (the "Purpose").

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or in any other form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

3. EXCLUSIONS
Confidential Information does not include information that: (a) is or becomes publicly available through no fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure; (c) is rightfully received from a third party without breach of any confidentiality obligation; or (d) is independently developed by the Receiving Party without use of the Disclosing Party's Confidential Information.

4. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to: (a) hold the Confidential Information in strict confidence; (b) not disclose it to any third party without the Disclosing Party's prior written consent; (c) use it solely for the Purpose; and (d) protect it using at least a reasonable degree of care.

5. TERM
This Agreement shall remain in effect for {{term_years}} year(s) from the Effective Date. The confidentiality obligations under Section 4 shall survive termination of this Agreement for that same period.

6. RETURN OF MATERIALS
Upon request of the Disclosing Party, the Receiving Party shall promptly return or destroy all documents and materials containing Confidential Information.

7. NO LICENSE
Nothing in this Agreement grants the Receiving Party any rights to the Disclosing Party's Confidential Information beyond the limited right to use it for the Purpose.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of {{governing_state}}, without regard to its conflict of laws principles.

9. REMEDIES
The Parties agree that unauthorized disclosure of Confidential Information may cause irreparable harm for which monetary damages would be an inadequate remedy, and that the Disclosing Party shall be entitled to seek injunctive relief in addition to any other available remedies.

10. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties concerning its subject matter and supersedes all prior discussions or agreements, whether oral or written, relating to the same subject matter.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

DISCLOSING PARTY: {{party_a_name}}
RECEIVING PARTY: {{party_b_name}}`;

const NONCOMPETE_FIELDS = [
  { key: 'effective_date', label: 'Effective date', type: 'date', required: true },
  { key: 'company_name', label: 'Company name', type: 'text', required: true },
  { key: 'company_address', label: 'Company address', type: 'text', required: true },
  { key: 'individual_name', label: 'Employee/contractor name', type: 'text', required: true },
  { key: 'role_title', label: 'Role/title', type: 'text', required: true },
  { key: 'restricted_activities', label: 'Restricted activities/business', type: 'textarea', required: true },
  { key: 'geographic_scope', label: 'Geographic scope', type: 'text', required: true },
  { key: 'duration_months', label: 'Restriction duration (months)', type: 'number', required: true, default: '12' },
  { key: 'consideration', label: 'Consideration (what they receive for agreeing)', type: 'textarea', required: true },
  { key: 'governing_state', label: 'Governing state/jurisdiction', type: 'text', required: true },
];

const NONCOMPETE_BODY = `NON-COMPETITION AGREEMENT

This Non-Competition Agreement ("Agreement") is entered into as of {{effective_date}} ("Effective Date"), by and between {{company_name}}, located at {{company_address}} ("Company"), and {{individual_name}}, serving in the role of {{role_title}} ("Individual").

IMPORTANT: Noncompete enforceability varies significantly by state and is banned or heavily restricted for many workers in a number of states (including California, Minnesota, North Dakota, and Oklahoma, among others with more limited restrictions). This document is a general drafting template only and is not legal advice. Confirm enforceability with a licensed attorney in the governing jurisdiction before relying on it.

1. CONSIDERATION
In consideration of {{consideration}}, and other good and valuable consideration, the receipt and sufficiency of which is acknowledged, the Individual agrees to the restrictions set forth in this Agreement.

2. RESTRICTED ACTIVITIES
During the Restricted Period (defined below), the Individual agrees not to, directly or indirectly, engage in, own, manage, operate, control, be employed by, consult for, or otherwise participate in any business that involves: {{restricted_activities}}.

3. GEOGRAPHIC SCOPE
The restrictions in Section 2 apply within the following geographic area: {{geographic_scope}}.

4. RESTRICTED PERIOD
The restrictions in this Agreement apply for {{duration_months}} month(s) following the Effective Date, or, if later, following the termination of the Individual's relationship with the Company (the "Restricted Period").

5. REASONABLENESS
The Parties agree that the restrictions in this Agreement are reasonable in scope, geography, and duration given the Company's legitimate business interests, and are no broader than necessary to protect those interests.

6. SEVERABILITY / REFORMATION
If any restriction in this Agreement is found by a court to be unenforceable as written, the Parties intend for the court to reform or narrow the restriction to the maximum extent enforceable under applicable law, rather than voiding it entirely, to the extent permitted by that law.

7. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of {{governing_state}}, without regard to its conflict of laws principles. The Parties acknowledge that some jurisdictions restrict or prohibit noncompete agreements for certain categories of workers, and nothing in this Agreement is intended to require an unlawful restriction in any jurisdiction where it would not be enforceable.

8. REMEDIES
The Parties agree that a breach of this Agreement may cause irreparable harm for which monetary damages would be an inadequate remedy, and that the Company shall be entitled to seek injunctive relief in addition to any other available remedies.

9. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the Parties concerning its subject matter and supersedes all prior discussions or agreements, whether oral or written, relating to the same subject matter.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

COMPANY: {{company_name}}
INDIVIDUAL: {{individual_name}}`;

function seedTemplates(db) {
  const existing = db.prepare('SELECT COUNT(*) AS c FROM templates WHERE is_builtin = 1').get();
  if (existing.c > 0) return;

  const insert = db.prepare(`
    INSERT INTO templates (user_id, type, name, description, body, fields, is_builtin)
    VALUES (NULL, ?, ?, ?, ?, ?, 1)
  `);

  insert.run(
    'nda',
    'Mutual NDA',
    'Both sides may disclose confidential information to each other.',
    MUTUAL_NDA_BODY,
    JSON.stringify(NDA_FIELDS)
  );

  insert.run(
    'nda',
    'One-Way NDA',
    'Only your side is disclosing confidential information to the other party.',
    ONEWAY_NDA_BODY,
    JSON.stringify(NDA_FIELDS)
  );

  insert.run(
    'noncompete',
    'Standard Noncompete',
    'Restricts an employee/contractor from competing for a period after the relationship ends.',
    NONCOMPETE_BODY,
    JSON.stringify(NONCOMPETE_FIELDS)
  );
}

module.exports = { seedTemplates };
