-- =====================================================
-- SEED 100+ GLOBAL HIGH-DEMAND TEMPLATES
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Ensure Categories Exist
INSERT INTO template_categories (name, icon, color, display_order) VALUES
  ('real_estate', 'Home', '#059669', 6),
  ('legal', 'Scale', '#dc2626', 7),
  ('business', 'Briefcase', '#2563eb', 8),
  ('personal', 'User', '#db2777', 9),
  ('education', 'GraduationCap', '#d97706', 10),
  ('tech', 'Cpu', '#7c3aed', 11)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Templates
INSERT INTO signature_templates (
    user_id, name, description, category, document_url,
    is_system_template, is_public, usage_count, page_count, created_at
) VALUES 

-- === REAL ESTATE (20) ===
('system', 'Residential Lease Agreement', 'Standard residential rental contract for landlords and tenants.', 'real_estate', 'https://placeholder.com/re_lease.pdf', true, true, 5420, 8, NOW()),
('system', 'Commercial Lease Agreement', 'Lease agreement for office, retail, or industrial space.', 'real_estate', 'https://placeholder.com/comm_lease.pdf', true, true, 3100, 15, NOW()),
('system', 'Real Estate Purchase Agreement', 'Contract for the sale and purchase of real estate property.', 'real_estate', 'https://placeholder.com/purchase_agree.pdf', true, true, 4200, 10, NOW()),
('system', 'Sublease Agreement', 'Agreement to sublet a rental property to a new tenant.', 'real_estate', 'https://placeholder.com/sublease.pdf', true, true, 1200, 6, NOW()),
('system', 'Roommate Agreement', 'Agreement between roommates sharing a living space.', 'real_estate', 'https://placeholder.com/roommate.pdf', true, true, 1800, 4, NOW()),
('system', 'Eviction Notice (Notice to Quit)', 'Formal notice to a tenant to vacate the property.', 'real_estate', 'https://placeholder.com/eviction.pdf', true, true, 950, 1, NOW()),
('system', 'Rental Application Form', 'Form for prospective tenants to apply for a rental property.', 'real_estate', 'https://placeholder.com/rental_app.pdf', true, true, 6500, 2, NOW()),
('system', 'Property Management Agreement', 'Contract between owner and property manager.', 'real_estate', 'https://placeholder.com/prop_mgmt.pdf', true, true, 890, 7, NOW()),
('system', 'Lead-Based Paint Disclosure', 'Required disclosure for homes built before 1978.', 'real_estate', 'https://placeholder.com/lead_paint.pdf', true, true, 2100, 1, NOW()),
('system', 'Move-In/Move-Out Inspection Checklist', 'Checklist for documenting property condition.', 'real_estate', 'https://placeholder.com/inspection.pdf', true, true, 3400, 3, NOW()),
('system', 'Mortgage Deed', 'Legal document securing a loan with real property.', 'real_estate', 'https://placeholder.com/mortgage.pdf', true, true, 1100, 12, NOW()),
('system', 'Quitclaim Deed', 'Deed transferring interest in property without warranty.', 'real_estate', 'https://placeholder.com/quitclaim.pdf', true, true, 1500, 2, NOW()),
('system', 'Warranty Deed', 'Deed guaranteeing clear title to the property.', 'real_estate', 'https://placeholder.com/warranty.pdf', true, true, 1300, 2, NOW()),
('system', 'Option to Purchase Agreement', 'Agreement giving exclusive right to buy property.', 'real_estate', 'https://placeholder.com/option.pdf', true, true, 600, 5, NOW()),
('system', 'Short Sale Addendum', 'Addendum for selling property for less than mortgage balance.', 'real_estate', 'https://placeholder.com/short_sale.pdf', true, true, 400, 3, NOW()),
('system', 'Estoppel Certificate', 'Tenant verification of lease terms for buyer/lender.', 'real_estate', 'https://placeholder.com/estoppel.pdf', true, true, 750, 2, NOW()),
('system', 'Intent to Vacate Notice', 'Tenant notice to landlord of moving out.', 'real_estate', 'https://placeholder.com/intent_vacate.pdf', true, true, 2200, 1, NOW()),
('system', 'Rent Increase Notice', 'Official notice of rent adjustment.', 'real_estate', 'https://placeholder.com/rent_increase.pdf', true, true, 1400, 1, NOW()),
('system', 'Parking Space Lease', 'Agreement for renting a dedicated parking spot.', 'real_estate', 'https://placeholder.com/parking.pdf', true, true, 900, 2, NOW()),
('system', 'Vacation Rental Agreement', 'Short-term rental contract for vacation properties.', 'real_estate', 'https://placeholder.com/vacation.pdf', true, true, 2800, 5, NOW()),

-- === BUSINESS & SALES (20) ===
('system', 'General Service Agreement', 'Standard contract for service providers.', 'business', 'https://placeholder.com/service_gen.pdf', true, true, 8900, 6, NOW()),
('system', 'Sales Contract', 'Agreement for the sale of goods.', 'sales', 'https://placeholder.com/sales_contract.pdf', true, true, 7200, 4, NOW()),
('system', 'Partnership Agreement', 'Formal agreement between business partners.', 'business', 'https://placeholder.com/partnership.pdf', true, true, 3100, 10, NOW()),
('system', 'LLC Operating Agreement', 'Governing document for Limited Liability Companies.', 'business', 'https://placeholder.com/llc_operating.pdf', true, true, 4500, 12, NOW()),
('system', 'Business Plan Template', 'Structured template for business planning.', 'business', 'https://placeholder.com/business_plan.pdf', true, true, 6700, 15, NOW()),
('system', 'Meeting Minutes', 'Template for recording board or team meeting notes.', 'business', 'https://placeholder.com/minutes.pdf', true, true, 5100, 2, NOW()),
('system', 'Purchase Order', 'Formal request for goods or services.', 'sales', 'https://placeholder.com/po.pdf', true, true, 9200, 1, NOW()),
('system', 'Invoice Template', 'Professional invoice for billing clients.', 'sales', 'https://placeholder.com/invoice.pdf', true, true, 12000, 1, NOW()),
('system', 'Quote/Estimate Template', 'Professional price estimate for clients.', 'sales', 'https://placeholder.com/quote.pdf', true, true, 8500, 1, NOW()),
('system', 'Memorandum of Understanding (MOU)', 'Preliminary agreement between parties.', 'business', 'https://placeholder.com/mou.pdf', true, true, 2300, 4, NOW()),
('system', 'Joint Venture Agreement', 'Agreement for short-term partnership project.', 'business', 'https://placeholder.com/joint_venture.pdf', true, true, 1100, 8, NOW()),
('system', 'Franchise Agreement', 'Contract granting rights to open a franchise.', 'business', 'https://placeholder.com/franchise.pdf', true, true, 600, 25, NOW()),
('system', 'Asset Purchase Agreement', 'Agreement to buy business assets.', 'business', 'https://placeholder.com/asset_purchase.pdf', true, true, 900, 14, NOW()),
('system', 'Shareholder Agreement', 'Agreement among company shareholders.', 'business', 'https://placeholder.com/shareholder.pdf', true, true, 1400, 12, NOW()),
('system', 'Non-Compete Agreement', 'Agreement preventing employee from working for competitors.', 'business', 'https://placeholder.com/non_compete.pdf', true, true, 4800, 3, NOW()),
('system', 'Consulting Agreement', 'Contract for professional consulting services.', 'business', 'https://placeholder.com/consulting.pdf', true, true, 5600, 6, NOW()),
('system', 'Vendor Agreement', 'Contract with a supplier or vendor.', 'business', 'https://placeholder.com/vendor.pdf', true, true, 3400, 5, NOW()),
('system', 'Insertion Order', 'Advertising placement order.', 'sales', 'https://placeholder.com/insertion.pdf', true, true, 800, 2, NOW()),
('system', 'Affiliate Agreement', 'Contract for affiliate marketing program.', 'sales', 'https://placeholder.com/affiliate.pdf', true, true, 2900, 5, NOW()),
('system', 'Reseller Agreement', 'Agreement authorizing resale of products.', 'sales', 'https://placeholder.com/reseller.pdf', true, true, 1500, 8, NOW()),

-- === HR & EMPLOYMENT (20) ===
('system', 'Employment Contract (Full-time)', 'Standard agreement for full-time employees.', 'hr', 'https://placeholder.com/employment_ft.pdf', true, true, 11000, 6, NOW()),
('system', 'Employment Offer Letter', 'Formal job offer letter.', 'hr', 'https://placeholder.com/offer_letter.pdf', true, true, 13500, 2, NOW()),
('system', 'Independent Contractor Agreement', 'Contract for freelance/contract work.', 'hr', 'https://placeholder.com/contractor_agree.pdf', true, true, 9800, 5, NOW()),
('system', 'Employee Handbook Acknowledgment', 'Sign-off for receipt of employee handbook.', 'hr', 'https://placeholder.com/handbook_ack.pdf', true, true, 7200, 1, NOW()),
('system', 'Direct Deposit Form', 'Authorization for payroll direct deposit.', 'hr', 'https://placeholder.com/direct_deposit.pdf', true, true, 8100, 1, NOW()),
('system', 'Performance Review Form', 'Template for employee performance evaluation.', 'hr', 'https://placeholder.com/review.pdf', true, true, 5400, 4, NOW()),
('system', 'Termination Letter', 'Formal notice of employment termination.', 'hr', 'https://placeholder.com/termination.pdf', true, true, 3200, 1, NOW()),
('system', 'Resignation Letter', 'Standard letter of resignation.', 'hr', 'https://placeholder.com/resignation.pdf', true, true, 4100, 1, NOW()),
('system', 'Time Off Request', 'Form to request vacation or leave.', 'hr', 'https://placeholder.com/time_off.pdf', true, true, 6000, 1, NOW()),
('system', 'Emergency Contact Form', 'Employee emergency contact information.', 'hr', 'https://placeholder.com/emergency.pdf', true, true, 7500, 1, NOW()),
('system', 'Equipment Loan Agreement', 'Agreement for company lending equipment to employee.', 'hr', 'https://placeholder.com/equipment.pdf', true, true, 2800, 2, NOW()),
('system', 'Confidentiality Agreement (Employee)', 'NDA specifically for employees.', 'hr', 'https://placeholder.com/employee_nda.pdf', true, true, 6700, 3, NOW()),
('system', 'Remote Work Policy', 'Guidelines for working from home.', 'hr', 'https://placeholder.com/remote_policy.pdf', true, true, 4500, 4, NOW()),
('system', 'Stock Option Agreement', 'Granting of employee stock options.', 'hr', 'https://placeholder.com/stock_option.pdf', true, true, 1200, 8, NOW()),
('system', 'Internship Agreement', 'Contract for interns.', 'hr', 'https://placeholder.com/internship.pdf', true, true, 3100, 4, NOW()),
('system', 'Volunteer Agreement', 'Waiver and agreement for volunteers.', 'hr', 'https://placeholder.com/volunteer.pdf', true, true, 1800, 2, NOW()),
('system', 'Background Check Authorization', 'Consent to perform background check.', 'hr', 'https://placeholder.com/bg_check.pdf', true, true, 5900, 1, NOW()),
('system', 'Payroll Deduction Form', 'Authorization for paycheck deductions.', 'hr', 'https://placeholder.com/payroll_deduct.pdf', true, true, 2400, 1, NOW()),
('system', 'Exit Interview Form', 'Questionnaire for departing employees.', 'hr', 'https://placeholder.com/exit_interview.pdf', true, true, 3300, 3, NOW()),
('system', 'Expense Reimbursement Form', 'Form for claiming business expenses.', 'hr', 'https://placeholder.com/expenses.pdf', true, true, 7100, 1, NOW()),

-- === LEGAL & PERSONAL (20) ===
('system', 'Mutual Non-Disclosure Agreement (NDA)', 'Standard bidirectional NDA.', 'nda', 'https://placeholder.com/mutual_nda.pdf', true, true, 18000, 3, NOW()),
('system', 'Last Will and Testament', 'Legal document outlining asset distribution.', 'legal', 'https://placeholder.com/will.pdf', true, true, 6200, 8, NOW()),
('system', 'Power of Attorney (General)', 'Granting broad legal authority to an agent.', 'legal', 'https://placeholder.com/poa_gen.pdf', true, true, 4800, 4, NOW()),
('system', 'Medical Power of Attorney', 'Designating a healthcare proxy.', 'legal', 'https://placeholder.com/poa_med.pdf', true, true, 3500, 4, NOW()),
('system', 'Living Will (Advance Directive)', 'Instructions for end-of-life care.', 'legal', 'https://placeholder.com/living_will.pdf', true, true, 3100, 5, NOW()),
('system', 'Promissory Note (Secured)', 'Loan agreement with collateral.', 'legal', 'https://placeholder.com/promissory_sec.pdf', true, true, 2900, 3, NOW()),
('system', 'Promissory Note (Unsecured)', 'Simple loan agreement without collateral.', 'legal', 'https://placeholder.com/promissory_unsec.pdf', true, true, 3800, 2, NOW()),
('system', 'Hold Harmless (Indemnity) Agreement', 'Liability waiver agreement.', 'legal', 'https://placeholder.com/indemnity.pdf', true, true, 5100, 3, NOW()),
('system', 'Release of Liability (Waiver)', 'General waiver for events or activities.', 'legal', 'https://placeholder.com/waiver.pdf', true, true, 7400, 2, NOW()),
('system', 'Cease and Desist Letter', 'Formal demand to stop specific activity.', 'legal', 'https://placeholder.com/cease_desist.pdf', true, true, 2600, 1, NOW()),
('system', 'Affidavit of Residence', 'Sworn statement of address.', 'legal', 'https://placeholder.com/affidavit_res.pdf', true, true, 4100, 1, NOW()),
('system', 'Bill of Sale (Car)', 'Document for selling a vehicle.', 'personal', 'https://placeholder.com/bos_car.pdf', true, true, 8900, 1, NOW()),
('system', 'Bill of Sale (General)', 'Document for selling general items.', 'personal', 'https://placeholder.com/bos_gen.pdf', true, true, 5600, 1, NOW()),
('system', 'Child Medical Consent', 'Authorizing medical care for a minor.', 'personal', 'https://placeholder.com/child_med.pdf', true, true, 2200, 1, NOW()),
('system', 'Travel Consent for Minor', 'Permission for child to travel with one parent/others.', 'personal', 'https://placeholder.com/travel_consent.pdf', true, true, 1900, 1, NOW()),
('system', 'Demand Letter', 'Formal demand for payment or action.', 'legal', 'https://placeholder.com/demand.pdf', true, true, 3300, 1, NOW()),
('system', 'Letter of Recommendation', 'Reference letter template.', 'personal', 'https://placeholder.com/recommendation.pdf', true, true, 5800, 1, NOW()),
('system', 'Loan Agreement (Personal)', 'Contract for loan between friends/family.', 'personal', 'https://placeholder.com/loan_personal.pdf', true, true, 4400, 3, NOW()),
('system', 'Pet Sitter Agreement', 'Instructions and agreement for pet care.', 'personal', 'https://placeholder.com/pet_sitter.pdf', true, true, 1200, 2, NOW()),
('system', 'House Sitting Agreement', 'Agreement for house sitting services.', 'personal', 'https://placeholder.com/house_sit.pdf', true, true, 800, 2, NOW()),

-- === TECH & CREATIVE (20) ===
('system', 'Software Development Agreement', 'Contract for custom software dev.', 'tech', 'https://placeholder.com/sw_dev.pdf', true, true, 2700, 12, NOW()),
('system', 'SaaS Service Agreement', 'Terms of service for SaaS products.', 'tech', 'https://placeholder.com/saas.pdf', true, true, 3400, 15, NOW()),
('system', 'Website Privacy Policy', 'Standard GDPR/CCPA compliant privacy policy.', 'tech', 'https://placeholder.com/privacy.pdf', true, true, 8900, 5, NOW()),
('system', 'Website Terms of Use', 'Terms and conditions for website usage.', 'tech', 'https://placeholder.com/terms.pdf', true, true, 8500, 6, NOW()),
('system', 'End User License Agreement (EULA)', 'Software license agreement.', 'tech', 'https://placeholder.com/eula.pdf', true, true, 2100, 8, NOW()),
('system', 'Freelance Web Design Contract', 'Agreement for web design services.', 'tech', 'https://placeholder.com/web_design.pdf', true, true, 5600, 5, NOW()),
('system', 'SEO Service Agreement', 'Contract for SEO marketing services.', 'tech', 'https://placeholder.com/seo.pdf', true, true, 1800, 4, NOW()),
('system', 'Social Media Management Contract', 'Agreement for SMM services.', 'tech', 'https://placeholder.com/smm.pdf', true, true, 2500, 4, NOW()),
('system', 'Influencer Marketing Agreement', 'Contract between brand and influencer.', 'tech', 'https://placeholder.com/influencer.pdf', true, true, 3200, 5, NOW()),
('system', 'Graphic Design Quote', 'Quote template for design work.', 'tech', 'https://placeholder.com/design_quote.pdf', true, true, 4100, 1, NOW()),
('system', 'Photography Release Form', 'Model or property release for photography.', 'tech', 'https://placeholder.com/photo_release.pdf', true, true, 5200, 1, NOW()),
('system', 'Video Production Agreement', 'Contract for video services.', 'tech', 'https://placeholder.com/video.pdf', true, true, 1400, 6, NOW()),
('system', 'Mobile App Development Contract', 'Agreement for app development.', 'tech', 'https://placeholder.com/app_dev.pdf', true, true, 1900, 10, NOW()),
('system', 'Maintenance & Support Agreement', 'Ongoing software support contract.', 'tech', 'https://placeholder.com/maintenance.pdf', true, true, 1600, 5, NOW()),
('system', 'Data Processing Agreement (DPA)', 'GDPR required data handling agreement.', 'tech', 'https://placeholder.com/dpa.pdf', true, true, 2300, 8, NOW()),
('system', 'IP Assignment Agreement', 'Transferring intellectual property rights.', 'tech', 'https://placeholder.com/ip_assign.pdf', true, true, 1700, 3, NOW()),
('system', 'Beta Testing Agreement', 'Agreement for software beta testers.', 'tech', 'https://placeholder.com/beta.pdf', true, true, 900, 3, NOW()),
('system', 'Domain Name Transfer Agreement', 'Sale of internet domain name.', 'tech', 'https://placeholder.com/domain.pdf', true, true, 600, 2, NOW()),
('system', 'Hosting Agreement', 'Web hosting service contract.', 'tech', 'https://placeholder.com/hosting.pdf', true, true, 1100, 5, NOW()),
('system', 'Code of Conduct', 'Community or company behavior guidelines.', 'tech', 'https://placeholder.com/code_conduct.pdf', true, true, 3500, 4, NOW())

ON CONFLICT DO NOTHING;
 