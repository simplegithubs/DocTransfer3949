const fs = require('fs');
const path = require('path');

const seoPagesDir = path.resolve(__dirname, '../src/data/seo-pages');

// Map of page slugs to clean, distinct, non-overlapping target keywords
const slugKeywordMap = {
  // Accounting Alternatives & Comparisons
  'intuit-link-alternative-accounting': 'intuit link alternative, intuit link competitor, accounting client portal alternative, cpa document portal',
  'smartvault-alternative-accounting': 'smartvault alternative, smartvault competitor, tax document sharing portal, secure cpa file transfer',
  'citrix-sharefile-alternative-accounting': 'citrix sharefile alternative, sharefile competitor for accounting, encrypted tax client portal',
  'taxdome-alternative-accounting': 'taxdome alternative, taxdome competitor, accounting firm workflow portal, cpa client intake',
  'canopy-alternative-accounting': 'canopy alternative, canopy competitor, tax preparation client portal, accounting file transfer',
  'intuit-link-vs-doctransfer-accounting': 'intuit link vs doctransfer, intuit link comparison, cpa portal features',
  'smartvault-vs-doctransfer-accounting': 'smartvault vs doctransfer, smartvault comparison accounting, secure cpa data room',
  'citrix-sharefile-vs-doctransfer-accounting': 'citrix sharefile vs doctransfer, sharefile comparison accounting',
  'taxdome-vs-doctransfer-accounting': 'taxdome vs doctransfer, taxdome comparison cpa portal',
  'canopy-vs-doctransfer-accounting': 'canopy vs doctransfer, canopy accounting software comparison',

  // Healthcare Alternatives & Comparisons
  'docusign-alternative-healthcare': 'docusign alternative healthcare, hipaa compliant docusign alternative, medical e-signature platform',
  'pandadoc-alternative-healthcare': 'pandadoc alternative healthcare, hipaa pandadoc competitor, medical consent form software',
  'adobe-sign-alternative-healthcare': 'adobe sign alternative healthcare, hipaa adobe sign competitor, patient intake signing',
  'signnow-alternative-healthcare': 'signnow alternative healthcare, hipaa signnow competitor, electronic medical record signing',
  'hellosign-alternative-healthcare': 'hellosign alternative healthcare, hipaa dropbox sign competitor, patient form transfer',
  'zoho-sign-alternative-healthcare': 'zoho sign alternative healthcare, hipaa zoho sign competitor, medical consent e-sign',
  'onespan-alternative-healthcare': 'onespan alternative healthcare, hipaa onespan competitor, clinical trial e-signatures',
  'docusign-vs-doctransfer-healthcare': 'docusign vs doctransfer healthcare, hipaa docusign comparison',
  'pandadoc-vs-doctransfer-healthcare': 'pandadoc vs doctransfer healthcare, hipaa pandadoc comparison',
  'adobe-sign-vs-doctransfer-healthcare': 'adobe sign vs doctransfer healthcare, hipaa adobe sign comparison',
  'signnow-vs-doctransfer-healthcare': 'signnow vs doctransfer healthcare, hipaa signnow comparison',
  'hellosign-vs-doctransfer-healthcare': 'hellosign vs doctransfer healthcare, hipaa hellosign comparison',
  'zoho-sign-vs-doctransfer-healthcare': 'zoho sign vs doctransfer healthcare, hipaa zoho sign comparison',
  'onespan-vs-doctransfer-healthcare': 'onespan vs doctransfer healthcare, hipaa onespan comparison',

  // Legal Alternatives & Comparisons
  'clio-alternative-legal': 'clio alternative, clio grow competitor, law firm document portal, attorney client file sharing',
  'netdocuments-alternative-legal': 'netdocuments alternative, netdocuments competitor, legal document management system',
  'imanage-alternative-legal': 'imanage alternative, imanage competitor, law firm cloud storage, legal document security',
  'mycase-alternative-legal': 'mycase alternative, mycase competitor, legal client intake portal',
  'smokeball-alternative-legal': 'smokeball alternative, smokeball competitor, small law firm document portal',
  'clio-vs-doctransfer-legal': 'clio vs doctransfer, clio comparison legal portal',
  'netdocuments-vs-doctransfer-legal': 'netdocuments vs doctransfer, netdocuments comparison',
  'imanage-vs-doctransfer-legal': 'imanage vs doctransfer, imanage comparison law firm',
  'mycase-vs-doctransfer-legal': 'mycase vs doctransfer, mycase comparison attorney portal',
  'smokeball-vs-doctransfer-legal': 'smokeball vs doctransfer, smokeball comparison legal',

  // HR Alternatives & Comparisons
  'bamboohr-alternative-hr': 'bamboohr alternative, bamboohr competitor, employee onboarding document portal',
  'gusto-alternative-hr': 'gusto alternative, gusto hr competitor, remote hiring document transfer',
  'rippling-alternative-hr': 'rippling alternative, rippling competitor, HR onboarding signature tool',
  'workday-alternative-hr': 'workday alternative, workday hr competitor, enterprise hr file sharing',
  'zenefits-alternative-hr': 'zenefits alternative, zenefits competitor, employee record management',
  'bamboohr-vs-doctransfer-hr': 'bamboohr vs doctransfer, bamboohr comparison hr',
  'gusto-vs-doctransfer-hr': 'gusto vs doctransfer, gusto hr comparison',
  'rippling-vs-doctransfer-hr': 'rippling vs doctransfer, rippling comparison hr',
  'workday-vs-doctransfer-hr': 'workday vs doctransfer, workday hr comparison',
  'zenefits-vs-doctransfer-hr': 'zenefits vs doctransfer, zenefits comparison hr',

  // Construction Alternatives & Comparisons
  'procore-alternative-construction': 'procore alternative, procore competitor, construction document management',
  'plangrid-alternative-construction': 'plangrid alternative, plangrid competitor, blueprint sharing platform',
  'buildertrend-alternative-construction': 'buildertrend alternative, buildertrend competitor, contractor lien waiver portal',
  'coconstruct-alternative-construction': 'coconstruct alternative, coconstruct competitor, construction change order signing',
  'fieldwire-alternative-construction': 'fieldwire alternative, fieldwire competitor, jobsite safety plan distribution',
  'procore-vs-doctransfer-construction': 'procore vs doctransfer, procore comparison construction',
  'plangrid-vs-doctransfer-construction': 'plangrid vs doctransfer, plangrid comparison blueprints',
  'buildertrend-vs-doctransfer-construction': 'buildertrend vs doctransfer, buildertrend comparison contractor',
  'coconstruct-vs-doctransfer-construction': 'coconstruct vs doctransfer, coconstruct comparison change orders',
  'fieldwire-vs-doctransfer-construction': 'fieldwire vs doctransfer, fieldwire comparison safety plans',

  // Education Alternatives & Comparisons
  'parchment-alternative-education': 'parchment alternative, parchment competitor, university transcript sharing portal',
  'naviance-alternative-education': 'naviance alternative, naviance competitor, student record transfer system',
  'blackboard-alternative-education': 'blackboard alternative, blackboard competitor education file transfer',
  'canvas-alternative-education': 'canvas alternative, canvas competitor course material distribution',
  'google-classroom-alternative-education': 'google classroom alternative, secure homework document submission',
  'parchment-vs-doctransfer-education': 'parchment vs doctransfer, parchment transcript comparison',
  'naviance-vs-doctransfer-education': 'naviance vs doctransfer, naviance comparison education',
  'blackboard-vs-doctransfer-education': 'blackboard vs doctransfer, blackboard comparison education',
  'canvas-vs-doctransfer-education': 'canvas vs doctransfer, canvas comparison education',
  'google-classroom-vs-doctransfer-education': 'google classroom vs doctransfer, google classroom comparison',

  // Insurance Alternatives & Comparisons
  'applied-epic-alternative-insurance': 'applied epic alternative, applied epic competitor, insurance agency document portal',
  'vertafore-alternative-insurance': 'vertafore alternative, vertafore competitor, insurance policy document sharing',
  'hawksoft-alternative-insurance': 'hawksoft alternative, hawksoft competitor, independent insurance agent portal',
  'ezlynx-alternative-insurance': 'ezlynx alternative, ezlynx competitor, commercial insurance proposal portal',
  'agencyzoom-alternative-insurance': 'agencyzoom alternative, agencyzoom competitor, insurance onboarding e-signatures',
  'applied-epic-vs-doctransfer-insurance': 'applied epic vs doctransfer, applied epic comparison insurance',
  'vertafore-vs-doctransfer-insurance': 'vertafore vs doctransfer, vertafore comparison insurance',
  'hawksoft-vs-doctransfer-insurance': 'hawksoft vs doctransfer, hawksoft comparison insurance',
  'ezlynx-vs-doctransfer-insurance': 'ezlynx vs doctransfer, ezlynx comparison insurance',
  'agencyzoom-vs-doctransfer-insurance': 'agencyzoom vs doctransfer, agencyzoom comparison insurance',

  // Nonprofit Alternatives & Comparisons
  'bloomerang-alternative-nonprofit': 'bloomerang alternative, bloomerang competitor, donor agreement portal',
  'little-green-light-alternative-nonprofit': 'little green light alternative, LGL competitor, nonprofit grant document sharing',
  'submittable-alternative-nonprofit': 'submittable alternative, submittable competitor, grant application collection platform',
  'fluxx-alternative-nonprofit': 'fluxx alternative, fluxx competitor, foundation grant management system',
  'foundant-alternative-nonprofit': 'foundant alternative, foundant competitor, community foundation file transfer',
  'bloomerang-vs-doctransfer-nonprofit': 'bloomerang vs doctransfer, bloomerang comparison donor portal',
  'little-green-light-vs-doctransfer-nonprofit': 'little green light vs doctransfer, LGL comparison nonprofit',
  'submittable-vs-doctransfer-nonprofit': 'submittable vs doctransfer, submittable grant comparison',
  'fluxx-vs-doctransfer-nonprofit': 'fluxx vs doctransfer, fluxx comparison foundation',
  'foundant-vs-doctransfer-nonprofit': 'foundant vs doctransfer, foundant comparison foundation'
};

console.log('🧹 Executing Keyword Deduping across all 13 SEO vertical data files...\n');

let totalFilesUpdated = 0;
let totalKeywordsUpdated = 0;

const files = fs.readdirSync(seoPagesDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(seoPagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;

  for (const [slug, cleanKeywords] of Object.entries(slugKeywordMap)) {
    if (content.includes(`'${slug}'`) || content.includes(`"${slug}"`)) {
      const slugIndex = content.indexOf(`'${slug}'`) !== -1 ? content.indexOf(`'${slug}'`) : content.indexOf(`"${slug}"`);
      const keywordsMatch = content.substring(slugIndex, slugIndex + 800).match(/keywords:\s*['"]([^'"]+)['"]/);
      
      if (keywordsMatch) {
        const oldKeywords = keywordsMatch[1];
        if (oldKeywords !== cleanKeywords) {
          const targetStr = keywordsMatch[0];
          const replacementStr = `keywords: '${cleanKeywords}'`;
          content = content.replace(targetStr, replacementStr);
          fileModified = true;
          totalKeywordsUpdated++;
          console.log(`  - [${file}] Updated keywords for "${slug}"`);
        }
      }
    }
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFilesUpdated++;
  }
}

console.log(`\n✅ Keyword Deduping Complete! Updated ${totalKeywordsUpdated} slug keyword entries across ${totalFilesUpdated} files.`);
