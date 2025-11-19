import { PurchaseDomain, TenderTemplateConfig } from '../types';

export const TENDER_TEMPLATES: Record<string, TenderTemplateConfig> = {
  [PurchaseDomain.IT]: {
    domain: PurchaseDomain.IT,
    focusArea: "Technical feasibility, data security, SLA (Service Level Agreements), and licensing.",
    complianceKeywords: ["GDPR", "ISO 27001", "Uptime Guarantee", "Data Privacy"],
    sections: [
      `1. Executive Summary
   1.1 Project Background
      1.1.1 Current Challenges & Drivers
      1.1.2 Strategic Goals
   1.2 Scope Overview
      1.2.1 In-Scope Systems
      1.2.2 Out-of-Scope Items`,
      `2. Technical Architecture & Scope
   2.1 Proposed Solution Architecture
      2.1.1 High-Level Component Diagram
      2.1.2 Data Flow & Interoperability
      2.1.3 Technology Stack Specifications
   2.2 Infrastructure Requirements
      2.2.1 Cloud/On-Premise Hosting Specs
      2.2.2 Network Connectivity & Bandwidth
      2.2.3 Disaster Recovery Strategy`,
      `3. Functional Requirements
   3.1 User Experience (UX)
      3.1.1 Interface Accessibility Standards
      3.1.2 Mobile vs Desktop Responsiveness
   3.2 Core Features Modules
      3.2.1 User Authentication & Role Management
      3.2.2 Reporting & Analytics Dashboard
      3.2.3 Workflow Automation Engine`,
      `4. Non-Functional Requirements
   4.1 Security Standards
      4.1.1 Encryption (At Rest & In Transit)
      4.1.2 Identity & Access Management (IAM)
   4.2 Performance Metrics
      4.2.1 Maximum Latency Thresholds
      4.2.2 Concurrent User Capacity`,
      `5. Implementation Roadmap
   5.1 Project Phases
      5.1.1 Requirement Analysis Phase
      5.1.2 Development & Testing Phase
      5.1.3 UAT & Go-Live Phase`,
      `6. Service Level Agreement (SLA) & Support
   6.1 Support Tiers
      6.1.1 L1/L2/L3 Support Definitions
      6.1.2 Incident Response Times
   6.2 Maintenance Policies
      6.2.1 Scheduled Downtime Protocols
      6.2.2 Patch Management Procedures`,
      `7. Vendor Qualifications & References
   7.1 Corporate Profile
      7.1.1 Years in Business & Financial Stability
      7.1.2 Relevant Industry Certifications
   7.2 Project References
      7.2.1 Case Studies of Similar Scale
      7.2.2 Client Contact Details for Verification`,
      `8. Commercial Proposal Structure
   8.1 Pricing Model
      8.1.1 One-time Implementation Costs
      8.1.2 Recurring Licensing/Support Fees
   8.2 Payment Terms
      8.2.1 Milestone-based Payment Schedule
      8.2.2 Retainage & Penalties`
    ]
  },
  [PurchaseDomain.Furniture]: {
    domain: PurchaseDomain.Furniture,
    focusArea: "Ergonomics, durability, materials, warranty, and installation services.",
    complianceKeywords: ["ISO 9001", "Fire Safety Standards", "Ergonomic Certification", "Warranty"],
    sections: [
      `1. Project Overview
   1.1 Introduction
      1.1.1 Purpose of Procurement
      1.1.2 Site Locations`,
      `2. Design & Aesthetic Requirements
   2.1 Design Language
      2.1.1 Color Palette & Branding
      2.1.2 Texture & Finish Requirements
   2.2 Space Planning
      2.2.1 Layout Optimization
      2.2.2 Accessibility Considerations`,
      `3. Item Specifications
   3.1 Workstations & Desks
      3.1.1 Dimensions & Adjustability Ranges
      3.1.2 Cable Management Solutions
      3.1.3 Surface Durability Standards
   3.2 Seating Solutions
      3.2.1 Ergonomic Certification Levels
      3.2.2 Weight Capacity & Mechanism Warranty
      3.2.3 Fabric Abrasion Resistance (Martindale Rubs)`,
      `4. Quality & Standards
   4.1 Material Compliance
      4.1.1 Low VOC Emissions (GreenGuard)
      4.1.2 Fire Retardancy Certifications
      4.1.3 Sustainable Sourcing (FSC Wood)`,
      `5. Delivery & Installation Logistics
   5.1 Site Access & Staging
      5.1.1 Loading Dock Restrictions
      5.1.2 Elevator Usage Protocols
   5.2 Installation Services
      5.2.1 Assembly Procedures
      5.2.2 Debris Removal & Recycling`,
      `6. Warranty & After-Sales Service
   6.1 Warranty Coverage
      6.1.1 Structural Components Warranty (Min 5 Years)
      6.1.2 Mechanism & Moving Parts Warranty
   6.2 Maintenance Support
      6.2.1 Spare Parts Availability
      6.2.2 Repair Response Timelines`,
      `7. Pricing Schedule
   7.1 Bill of Materials
      7.1.1 Unit Costs per Item
      7.1.2 Volume Discounts
   7.2 Services Costs
      7.2.1 Delivery & Installation Fees
      7.2.2 Design & Consultation Fees`
    ]
  },
  [PurchaseDomain.Logistics]: {
    domain: PurchaseDomain.Logistics,
    focusArea: "Route optimization, vehicle standards, insurance, and tracking capabilities.",
    complianceKeywords: ["Vehicle Safety Standards", "Insurance Coverage", "Tracking API", "Timeliness"],
    sections: [
      `1. Operational Scope
   1.1 Service Requirements
      1.1.1 Types of Goods to be Transported
      1.1.2 Geographic Coverage Zones`,
      `2. Fleet & Vehicle Requirements
   2.1 Vehicle Specifications
      2.1.1 Vehicle Age & Condition Limits
      2.1.2 Load Capacity & Dimensions
      2.1.3 Refrigeration/Climate Control (if applicable)
   2.2 Fleet Maintenance
      2.2.1 Preventative Maintenance Schedules
      2.2.2 Breakdown Response Protocols`,
      `3. Tracking & Technology
   3.1 Real-Time Visibility
      3.1.1 GPS Integration Requirements
      3.1.2 Customer Portal Access
   3.2 Reporting Capabilities
      3.2.1 On-Time Delivery (OTD) Metrics
      3.2.2 Electronic Proof of Delivery (ePOD)`,
      `4. Safety & Compliance
   4.1 Driver Qualifications
      4.1.1 License & Certification Verification
      4.1.2 Background Checks & Training
   4.2 Insurance Coverage
      4.2.1 Goods in Transit Liability
      4.2.2 Third-Party Liability Limits`,
      `5. Route & Volume Estimates
   5.1 Volume Projections
      5.1.1 Estimated Monthly Tonnage
      5.1.2 Peak Season Expectations
   5.2 Route Planning
      5.2.1 Fixed Routes vs Ad-Hoc
      5.2.2 Multi-drop Capabilities`,
      `6. Rate Card & Fuel Surcharge Mechanism
   6.1 Pricing Structure
      6.1.1 Base Rate per KM/Zone
      6.1.2 Drop-off Fees
   6.2 Variable Costs
      6.2.1 Fuel Surcharge Indexing
      6.2.2 Waiting Time Penalties`
    ]
  },
  [PurchaseDomain.Medical]: {
    domain: PurchaseDomain.Medical,
    focusArea: "Patient safety, regulatory compliance, training, and maintenance.",
    complianceKeywords: ["FDA Approved", "CE Marking", "ISO 13485", "Clinical Application"],
    sections: [
      `1. Clinical Needs Assessment
   1.1 Purpose of Acquisition
      1.1.1 Target Patient Population
      1.1.2 Clinical Workflow Integration`,
      `2. Technical Specifications
   2.1 Device Performance
      2.1.1 Measurement Accuracy & Range
      2.1.2 Power Supply & Battery Backup
      2.1.3 Connectivity (HL7/DICOM)
   2.2 Physical Characteristics
      2.2.1 Footprint & Weight
      2.2.2 Sterilization Compatibility`,
      `3. Regulatory & Quality Assurance
   3.1 Certification Requirements
      3.1.1 Regulatory Approvals (FDA/CE/TGA)
      3.1.2 ISO 13485 Manufacturing Standards
   3.2 Safety Standards
      3.2.1 Electrical Safety (IEC 60601)
      3.2.2 Radiation Safety (if applicable)`,
      `4. Installation & Implementation
   4.1 Site Preparation
      4.1.1 Electrical & Networking Pre-requisites
      4.1.2 Environmental Controls (HVAC)
   4.2 Application Training
      4.2.1 Clinical User Training
      4.2.2 Biomedical Engineer Technical Training`,
      `5. Maintenance & Lifecycle
   5.1 Warranty & Service
      5.1.1 Preventative Maintenance Schedule
      5.1.2 Spare Parts Availability Guarantee (min 7 years)
   5.2 Software Upgrades
      5.2.1 Patch Management
      5.2.2 Cybersecurity Updates`,
      `6. Total Cost of Ownership
   6.1 Capital Expenditure
      6.1.1 Main Unit Cost
      6.1.2 Accessories & Options
   6.2 Operational Expenditure
      6.2.1 Consumables Cost per Test/Use
      6.2.2 Annual Service Contract Rates`
    ]
  },
  [PurchaseDomain.Construction]: {
    domain: PurchaseDomain.Construction,
    focusArea: "Safety regulations, bill of quantities (BOQ), timeline, and site management.",
    complianceKeywords: ["Building Codes", "HSE Standards", "Contractor All Risk Insurance", "Permits"],
    sections: [
      `1. Project Scope & Site Location
   1.1 Site Overview
      1.1.1 Location Coordinates & Boundary
      1.1.2 Existing Conditions Report`,
      `2. Architectural & Structural Specifications
   2.1 Civil Works
      2.1.1 Foundation & Excavation Standards
      2.1.2 Concrete Mix & Reinforcement Specs
   2.2 Finishes & Fittings
      2.2.1 Flooring & Wall Treatments
      2.2.2 Glazing & Facade Specs`,
      `3. MEP Services (Mechanical, Electrical, Plumbing)
   3.1 Electrical Systems
      3.1.1 Power Distribution & Load Balancing
      3.1.2 Lighting & Emergency Systems
   3.2 HVAC & Plumbing
      3.2.1 Ventilation Requirements
      3.2.2 Water Supply & Drainage`,
      `4. Health, Safety & Environment (HSE)
   4.1 Site Safety Protocols
      4.1.1 Personal Protective Equipment (PPE) Policy
      4.1.2 Emergency Evacuation Plan
   4.2 Environmental Controls
      4.2.1 Waste Management Plan
      4.2.2 Noise & Dust Control Measures`,
      `5. Project Timeline & Milestones
   5.1 Schedule of Works
      5.1.1 Mobilization Phase
      5.1.2 Construction Phase Gantt Chart
   5.2 Handover
      5.2.1 Practical Completion Definition
      5.2.2 Snagging & Defect Rectification`,
      `6. Quality Assurance & Defect Liability
   6.1 QA/QC Procedures
      6.1.1 Inspection Test Plans (ITP)
      6.1.2 Material Approvals & Samples
   6.2 Liability Period
      6.2.1 12-Month Defect Liability Terms
      6.2.2 Retention Sum Release`,
      `7. Bill of Quantities (BOQ) Summary
   7.1 Pricing Breakdown
      7.1.1 Preliminaries & General Items
      7.1.2 Detailed Unit Rates
   7.2 Provisional Sums
      7.2.1 Contingency Allocations
      7.2.2 Daywork Rates`
    ]
  },
  [PurchaseDomain.General]: {
    domain: PurchaseDomain.General,
    focusArea: "Quality, cost-effectiveness, and reliability.",
    complianceKeywords: ["Standard Trade Terms", "Quality Assurance"],
    sections: [
      `1. Introduction
   1.1 Tender Context
      1.1.1 Background of Purchaser
      1.1.2 Objective of Procurement`,
      `2. Scope of Supply
   2.1 Product Specifications
      2.1.1 Material Requirements
      2.1.2 Performance Standards
   2.2 Packaging & Labeling
      2.2.1 Barcoding Requirements
      2.2.2 Protective Packaging Standards`,
      `3. Service Requirements
   3.1 Delivery Terms
      3.1.1 Incoterms (e.g., DDP, FOB)
      3.1.2 Lead Time Commitments
   3.2 Returns & Rejections
      3.2.1 DOA (Dead on Arrival) Process
      3.2.2 Dispute Resolution`,
      `4. Technical Specifications
   4.1 Compliance
      4.1.1 Relevant Industry Standards
      4.1.2 Certifications Required
   4.2 Documentation
      4.2.1 User Manuals
      4.2.2 Safety Data Sheets (SDS)`,
      `5. Inspection & Acceptance
   5.1 Testing Procedures
      5.1.1 Pre-shipment Inspection
      5.1.2 Final Acceptance Test (FAT)
   5.2 Non-Conformance
      5.2.1 Replacement Protocols
      5.2.2 Penalties for Non-Compliance`,
      `6. Commercial Terms
   6.1 Pricing
      6.1.1 Currency & Validity
      6.1.2 Bulk Discount Tiers
   6.2 Terms
      6.2.1 Payment Schedule
      6.2.2 Warranty Period`
    ]
  }
};

export const getTemplateConfig = (domain: PurchaseDomain): TenderTemplateConfig => {
  return TENDER_TEMPLATES[domain] || TENDER_TEMPLATES[PurchaseDomain.General];
};