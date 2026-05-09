import { PrismaClient, Lead } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Import Lead enums for type-safe assignments
import { LeadSource, LeadStatus, Priority } from '@prisma/client';

async function main() {
  console.log('Seeding database...');

  // ─── Users ───────────────────────────────────────────────────────────────

  const adminHash = await bcrypt.hash('password123', 10);
  const managerHash = await bcrypt.hash('password123', 10);
  const rep1Hash = await bcrypt.hash('password123', 10);
  const rep2Hash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      passwordHash: managerHash,
      name: 'Sarah Johnson',
      role: 'SALES_MANAGER',
    },
  });

  const rep1 = await prisma.user.upsert({
    where: { email: 'rep1@example.com' },
    update: {},
    create: {
      email: 'rep1@example.com',
      passwordHash: rep1Hash,
      name: 'James Mitchell',
      role: 'SALES_REP',
    },
  });

  const rep2 = await prisma.user.upsert({
    where: { email: 'rep2@example.com' },
    update: {},
    create: {
      email: 'rep2@example.com',
      passwordHash: rep2Hash,
      name: 'Emily Chen',
      role: 'SALES_REP',
    },
  });

  console.log('✓ Users created');
  const leadsData = [
    {
      name: 'Michael Torres',
      company: 'Nexus Technologies',
      email: 'michael.torres@nexustech.com',
      phone: '+1 (555) 201-4321',
      source: LeadSource.LINKEDIN,
      status: LeadStatus.WON,
      priority: Priority.HIGH,
      dealValue: 48000,
      assignedToId: rep1.id,
      createdById: rep1.id,
    },
    {
      name: 'Rachel Kim',
      company: 'Orbit Solutions',
      email: 'rachel.kim@orbitsolutions.io',
      phone: '+1 (555) 302-8765',
      source: LeadSource.REFERRAL,
      status: LeadStatus.PROPOSAL_SENT,
      priority: Priority.HIGH,
      dealValue: 72000,
      assignedToId: rep1.id,
      createdById: rep1.id,
    },
    {
      name: 'David Patel',
      company: 'Apex Analytics',
      email: 'd.patel@apexanalytics.com',
      phone: '+1 (555) 403-5678',
      source: LeadSource.WEBSITE,
      status: LeadStatus.QUALIFIED,
      priority: Priority.HIGH,
      dealValue: 35000,
      assignedToId: rep2.id,
      createdById: rep2.id,
    },
    {
      name: 'Laura Bennett',
      company: 'Stellar Media Group',
      email: 'laura.b@stellarmedia.com',
      phone: '+1 (555) 504-9012',
      source: LeadSource.COLD_EMAIL,
      status: LeadStatus.CONTACTED,
      priority: Priority.MEDIUM,
      dealValue: 18000,
      assignedToId: rep2.id,
      createdById: rep2.id,
    },
    {
      name: 'Chris Wagner',
      company: 'Pinnacle Logistics',
      email: 'cwagner@pinnaclelogistics.com',
      phone: '+1 (555) 605-3456',
      source: LeadSource.EVENT,
      status: LeadStatus.NEW,
      priority: Priority.MEDIUM,
      dealValue: 22000,
      assignedToId: rep1.id,
      createdById: manager.id,
    },
    {
      name: 'Sophia Nguyen',
      company: 'BlueWave Consulting',
      email: 'sophia@bluewaveconsulting.com',
      phone: '+1 (555) 706-7890',
      source: LeadSource.LINKEDIN,
      status: LeadStatus.LOST,
      priority: Priority.LOW,
      dealValue: 9500,
      assignedToId: rep2.id,
      createdById: rep2.id,
    },
    {
      name: 'Ethan Brooks',
      company: 'CoreBuild Systems',
      email: 'ebrooks@corebuildsystems.com',
      phone: '+1 (555) 807-2345',
      source: LeadSource.WEBSITE,
      status: LeadStatus.QUALIFIED,
      priority: Priority.HIGH,
      dealValue: 61000,
      assignedToId: rep1.id,
      createdById: rep1.id,
    },
    {
      name: 'Olivia Marsh',
      company: 'Greenfield Enterprises',
      email: 'olivia.marsh@greenfield.co',
      phone: '+1 (555) 908-6789',
      source: LeadSource.REFERRAL,
      status: LeadStatus.NEW,
      priority: Priority.MEDIUM,
      dealValue: 14000,
      assignedToId: rep2.id,
      createdById: manager.id,
    },
    {
      name: 'Nathan Scott',
      company: 'TechForge Inc',
      email: 'nscott@techforge.com',
      phone: '+1 (555) 109-4321',
      source: LeadSource.COLD_EMAIL,
      status: LeadStatus.CONTACTED,
      priority: Priority.LOW,
      dealValue: 8000,
      assignedToId: rep1.id,
      createdById: rep1.id,
    },
    {
      name: 'Isabella Clarke',
      company: 'Visionary Partners',
      email: 'i.clarke@visionarypartners.com',
      phone: '+1 (555) 210-8765',
      source: LeadSource.EVENT,
      status: LeadStatus.PROPOSAL_SENT,
      priority: Priority.HIGH,
      dealValue: 95000,
      assignedToId: rep2.id,
      createdById: rep2.id,
    },
    {
      name: 'Liam Foster',
      company: 'Quantum Dynamics',
      email: 'lfoster@quantumdynamics.net',
      phone: '+1 (555) 311-5432',
      source: LeadSource.WEBSITE,
      status: LeadStatus.WON,
      priority: Priority.HIGH,
      dealValue: 52000,
      assignedToId: rep1.id,
      createdById: rep1.id,
    },
    {
      name: 'Ava Thompson',
      company: 'Redline Marketing',
      email: 'ava.t@redlinemarketing.com',
      phone: '+1 (555) 412-2109',
      source: LeadSource.LINKEDIN,
      status: LeadStatus.LOST,
      priority: Priority.LOW,
      dealValue: 7500,
      assignedToId: rep2.id,
      createdById: rep2.id,
    },
    {
      name: 'Mason Rivera',
      company: 'SkyBridge Capital',
      email: 'mrivera@skybridgecapital.com',
      phone: '+1 (555) 513-9876',
      source: LeadSource.REFERRAL,
      status: LeadStatus.QUALIFIED,
      priority: Priority.MEDIUM,
      dealValue: 41000,
      assignedToId: rep1.id,
      createdById: manager.id,
    },
    {
      name: 'Chloe Adams',
      company: 'IronPath Manufacturing',
      email: 'cadams@ironpath.com',
      phone: '+1 (555) 614-6543',
      source: LeadSource.COLD_EMAIL,
      status: LeadStatus.NEW,
      priority: Priority.LOW,
      dealValue: 11000,
      assignedToId: rep2.id,
      createdById: rep2.id,
    },
    {
      name: 'Lucas White',
      company: 'Meridian Software',
      email: 'lwhite@meridiansoftware.com',
      phone: '+1 (555) 715-3210',
      source: LeadSource.WEBSITE,
      status: LeadStatus.CONTACTED,
      priority: Priority.MEDIUM,
      dealValue: 29000,
      assignedToId: rep1.id,
      createdById: rep1.id,
    },
  ];

  const createdLeads: Lead[] = [];
  for (const lead of leadsData) {
    const created = await prisma.lead.create({ data: lead });
    createdLeads.push(created);
  }

  console.log(`✓ ${createdLeads.length} leads created`);

  // ─── Notes ───────────────────────────────────────────────────────────────

  const notesData = [
    {
      leadIndex: 0,
      content: 'Had a great discovery call. Michael is very interested in our enterprise plan. Decision maker confirmed.',
      createdById: rep1.id,
    },
    {
      leadIndex: 0,
      content: 'Contract signed and payment received. Onboarding scheduled for next Monday.',
      createdById: rep1.id,
    },
    {
      leadIndex: 1,
      content: 'Sent detailed proposal covering 3 pricing tiers. Rachel asked for a 10% discount — escalating to manager.',
      createdById: rep1.id,
    },
    {
      leadIndex: 1,
      content: 'Follow-up call scheduled for Thursday. They have a board meeting next week and want to present our solution.',
      createdById: manager.id,
    },
    {
      leadIndex: 2,
      content: 'Technical demo went well. David wants to involve their CTO in the next meeting.',
      createdById: rep2.id,
    },
    {
      leadIndex: 2,
      content: 'CTO meeting confirmed for next week. Preparing technical documentation.',
      createdById: rep2.id,
    },
    {
      leadIndex: 3,
      content: 'Initial email response received. Laura is interested but needs internal approval first.',
      createdById: rep2.id,
    },
    {
      leadIndex: 4,
      content: 'Met Chris at the SaaS Summit conference. Strong interest in our logistics module.',
      createdById: manager.id,
    },
    {
      leadIndex: 5,
      content: 'Lead went cold after second follow-up. Competitor offered a lower price point.',
      createdById: rep2.id,
    },
    {
      leadIndex: 6,
      content: 'Ethan reached out via website chat. Has a team of 50+ and needs enterprise features.',
      createdById: rep1.id,
    },
    {
      leadIndex: 6,
      content: 'Qualification call done. Budget confirmed at $60k. Moving to proposal stage next week.',
      createdById: rep1.id,
    },
    {
      leadIndex: 7,
      content: 'Referred by Michael Torres. Olivia is evaluating 3 vendors. We are the frontrunner.',
      createdById: manager.id,
    },
    {
      leadIndex: 8,
      content: 'Cold email reply received. Nathan wants a product walkthrough demo.',
      createdById: rep1.id,
    },
    {
      leadIndex: 9,
      content: 'Proposal submitted for $95k annual contract. Isabella confirmed the timeline is Q3.',
      createdById: rep2.id,
    },
    {
      leadIndex: 9,
      content: 'Legal team reviewing contract. Expect signature by end of month.',
      createdById: rep2.id,
    },
    {
      leadIndex: 10,
      content: 'Liam came inbound from our blog post. Closed deal in just 3 weeks — fastest close this quarter.',
      createdById: rep1.id,
    },
    {
      leadIndex: 11,
      content: 'Ava decided to go with a competitor after price negotiation failed. Adding to nurture list.',
      createdById: rep2.id,
    },
    {
      leadIndex: 12,
      content: 'Mason was referred by a board member. High priority. Needs custom enterprise pricing.',
      createdById: manager.id,
    },
    {
      leadIndex: 13,
      content: 'Responded to cold email. Chloe is in early research phase, not ready to buy for 3 months.',
      createdById: rep2.id,
    },
    {
      leadIndex: 14,
      content: 'Lucas filled out a demo request form. Scheduled intro call for next Tuesday.',
      createdById: rep1.id,
    },
  ];

  for (const note of notesData) {
    await prisma.note.create({
      data: {
        content: note.content,
        leadId: createdLeads[note.leadIndex].id,
        createdById: note.createdById,
      },
    });
  }

  console.log(`✓ ${notesData.length} notes created`);

  console.log('\n✅ Seed complete!\n');
  console.log('Test credentials:');
  console.log('  Admin:   admin@example.com    / password123');
  console.log('  Manager: manager@example.com  / password123');
  console.log('  Rep 1:   rep1@example.com     / password123');
  console.log('  Rep 2:   rep2@example.com     / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());