import { PurchaseDomain, TenderClause } from '../types';

const createClause = (id: string, title: string, content: string): TenderClause => ({
  id,
  title,
  content,
  mandatory: true
});

export const CLAUSE_LIBRARY: Record<string, TenderClause[]> = {
  [PurchaseDomain.IT]: [
    createClause(
      'IT-SEC-001',
      'Standard Security Requirements (Schedule A)',
      `## 1. Account and Access Control
1.1 The Contractor shall ensure that support personnel are granted access based on the Principle of Least Privilege. Shared accounts are strictly prohibited.
1.2 All user access shall be authenticated using Multi-Factor Authentication (MFA) or an equivalent secure mechanism.
1.3 The Contractor shall conduct monthly reviews of all privileged accounts and provide usage and validity reports.
1.4 Creation, modification, or deletion of accounts shall be completed within 24 hours of request and properly logged.

## 2. Data Protection and Privacy
2.1 The Contractor shall ensure that all personal data handling complies with the Personal Data Protection Act (PDPA) or other applicable regulatory requirements.
2.2 Sensitive data, both at rest and in transit, shall be encrypted using industry-accepted standards (e.g., AES-256, TLS 1.2 or above).
2.3 Production data shall not be stored on Contractor premises. If testing requires data, data masking or anonymization techniques shall be applied, and the Contractor shall provide the data masking plan.

## 3. Secure Change Management
3.1 All changes shall follow a formal change management process, including risk assessment, security impact review, and rollback plan.
3.2 Changes affecting security (e.g., access controls, configuration changes, logging policies) shall require prior approval from the Client’s authorized representatives.
3.3 System patches shall be evaluated and deployed within 30 days of release. Critical security vulnerabilities shall be remediated within 72 hours where feasible.

## 4. Vulnerability and Threat Management
4.1 The Contractor shall perform quarterly vulnerability scans and submit reports including:
* Identified vulnerabilities and severity ratings
* Recommended remediation
* Rectification timelines
4.2 In the event of a security incident or system compromise, the Contractor shall notify the Client within 2 hours and submit a preliminary investigation report within 24 hours.
4.3 The Contractor shall support penetration testing performed by the Client or third-party assessors and provide an action plan with follow-through remediation.

## 5. Logging and Audit
5.1 The system shall generate logs for the following, at minimum:
* User login/logout
* Privilege or role changes
* Configuration or system modifications
* System errors and abnormal activities
5.2 Audit logs shall be retained for a minimum of 12 months and made available for audit upon request.
5.3 Logs shall be secured against deletion and tampering and, where applicable, support integration with centralized log or SIEM platforms.

## 6. Personnel and Security Training
6.1 All Contractor staff assigned to the project shall undergo background checks, confirming no history of system misuse or security violations.
6.2 Support staff shall receive at least one cybersecurity awareness or role-based security training session annually.

## 7. Operational and Support Security
7.1 Access to production environments, whether remote or on-site, shall be conducted via secure encrypted channels (e.g., VPN, SSH) and shall be logged for audit purposes.
7.2 The Contractor shall not store source code or client data on unauthorized third-party platforms (e.g., personal Git repositories, cloud storage services).
7.3 Upon contract ending or personnel departure, the Contractor shall:
* Revoke system and network access privileges
* Return all client data, system artifacts, and documents
* Remove all copies and backups from contractor systems (with signed destruction declaration)

## 8. Deliverables and Documentation
The Contractor shall provide and maintain up-to-date documentation including but not limited to:
* Security configuration and system baselines
* Access control matrix
* Incident response process
* Audit and log retention procedures
* Patch and vulnerability management policy`
    ),
    createClause(
      'IT-SLA-001',
      'Service Level Agreement (SLA)',
      'The Solution must maintain a minimum uptime of 99.9% during business hours. Critical Priority issues (System Down) must be acknowledged within 15 minutes and resolved within 4 hours.'
    )
  ],
  [PurchaseDomain.Furniture]: [
    createClause(
      'FURN-01',
      'Warranty Against Defects',
      'All supplied items shall carry a comprehensive warranty of not less than five (5) years against manufacturing defects, material failure, and workmanship errors.'
    ),
    createClause(
      'FURN-02',
      'Installation & Debris Removal',
      'The Vendor includes delivery, assembly, and placement of furniture at the designated site. The Vendor is solely responsible for the removal and environmentally friendly disposal of all packaging materials and debris.'
    ),
    createClause(
      'FURN-03',
      'Material Safety',
      'All fabric and foam materials must comply with local Fire Safety Regulations (e.g., BS 5852 or equivalent) and be certified free of harmful VOCs.'
    )
  ],
  [PurchaseDomain.Logistics]: [
    createClause(
      'LOG-01',
      'Goods in Transit Insurance',
      'The Transporter must maintain valid Goods in Transit insurance coverage for at least 110% of the cargo value against loss, theft, or damage.'
    ),
    createClause(
      'LOG-02',
      'Chain of Custody',
      'The Vendor must provide a digital proof of delivery (POD) and maintain a verifiable chain of custody log for all shipments from pickup to final delivery.'
    )
  ],
  [PurchaseDomain.Medical]: [
    createClause(
      'MED-01',
      'Regulatory Certification',
      'All quoted medical devices must possess valid regulatory approval for the target market (e.g., FDA 510(k) clearance, CE Mark under MDR). Certificates must be submitted with the bid.'
    ),
    createClause(
      'MED-02',
      'Biomedical Calibration',
      'The Vendor shall provide initial calibration certificates for all equipment. The proposal must include a maintenance schedule ensuring calibration validity for the first 24 months.'
    )
  ],
  [PurchaseDomain.Construction]: [
    createClause(
      'CON-01',
      'HSE Compliance',
      'The Contractor and all subcontractors must strictly adhere to the Site Health, Safety, and Environment (HSE) Plan. Zero-tolerance policy for safety violations.'
    ),
    createClause(
      'CON-02',
      'Defect Liability Period',
      'A Defect Liability Period of twelve (12) months shall apply from the date of Practical Completion, during which the Contractor must rectify any defects at their own cost.'
    )
  ],
  [PurchaseDomain.General]: [
    createClause(
      'GEN-01',
      'Anti-Corruption & Bribery',
      'The Vendor certifies that no form of bribe, gift, or inducement has been offered to any employee of the Purchaser to influence the award of this contract.'
    ),
    createClause(
      'GEN-02',
      'Right to Audit',
      'The Purchaser reserves the right to audit the Vendor’s records related to this contract with 7 days prior notice to ensure compliance with pricing and scope.'
    )
  ]
};

export const getStandardClauses = (domain: PurchaseDomain): TenderClause[] => {
  // Return specific clauses + General clauses if the domain isn't General itself
  const specificClauses = CLAUSE_LIBRARY[domain] || [];
  const generalClauses = domain !== PurchaseDomain.General ? CLAUSE_LIBRARY[PurchaseDomain.General] : [];
  
  // If no specific clauses found and it's not General, strictly use General
  if (specificClauses.length === 0 && domain !== PurchaseDomain.General) {
     return CLAUSE_LIBRARY[PurchaseDomain.General];
  }

  return [...specificClauses, ...generalClauses];
};