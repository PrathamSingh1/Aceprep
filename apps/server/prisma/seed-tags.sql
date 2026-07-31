-- ============================================
-- ADD TAGS TO EXISTING QUESTIONS
-- ============================================

UPDATE "Question" SET "tags" = ARRAY['Closures'] WHERE "id" = 'q_iq1';
UPDATE "Question" SET "tags" = ARRAY['Event Loop'] WHERE "id" = 'q_iq2';
UPDATE "Question" SET "tags" = ARRAY['Hoisting'] WHERE "id" = 'q_iq3';
UPDATE "Question" SET "tags" = ARRAY['Promises'] WHERE "id" = 'q_iq4';
UPDATE "Question" SET "tags" = ARRAY['Middleware'] WHERE "id" = 'q_iq5';
UPDATE "Question" SET "tags" = ARRAY['Virtual DOM'] WHERE "id" = 'q_iq6';

UPDATE "Question" SET "tags" = ARRAY['Big O'] WHERE "id" = 'q_dsa1';
UPDATE "Question" SET "tags" = ARRAY['Trees'] WHERE "id" = 'q_dsa2';
UPDATE "Question" SET "tags" = ARRAY['Hashmaps'] WHERE "id" = 'q_dsa3';
UPDATE "Question" SET "tags" = ARRAY['Graphs'] WHERE "id" = 'q_dsa4';

UPDATE "Question" SET "tags" = ARRAY['Personal'] WHERE "id" = 'q_hr1';
UPDATE "Question" SET "tags" = ARRAY['Behavioral'] WHERE "id" = 'q_hr2';
UPDATE "Question" SET "tags" = ARRAY['Personal'] WHERE "id" = 'q_hr3';

UPDATE "Question" SET "tags" = ARRAY['Microservices'] WHERE "id" = 'q_sb1';
UPDATE "Question" SET "tags" = ARRAY['Event-Driven'] WHERE "id" = 'q_sb2';
UPDATE "Question" SET "tags" = ARRAY['Load Balancing'] WHERE "id" = 'q_sb3';

UPDATE "Question" SET "tags" = ARRAY['Polymorphism'] WHERE "id" = 'q_oops1';
UPDATE "Question" SET "tags" = ARRAY['SOLID'] WHERE "id" = 'q_oops2';

UPDATE "Question" SET "tags" = ARRAY['TCP/IP'] WHERE "id" = 'q_cn1';
UPDATE "Question" SET "tags" = ARRAY['DNS'] WHERE "id" = 'q_cn2';

UPDATE "Question" SET "tags" = ARRAY['Deadlocks'] WHERE "id" = 'q_os1';
UPDATE "Question" SET "tags" = ARRAY['Threads'] WHERE "id" = 'q_os2';

UPDATE "Question" SET "tags" = ARRAY['Normalization'] WHERE "id" = 'q_dbms1';
UPDATE "Question" SET "tags" = ARRAY['Indexing'] WHERE "id" = 'q_dbms2';

UPDATE "Question" SET "tags" = ARRAY['Joins'] WHERE "id" = 'q_sql1';
UPDATE "Question" SET "tags" = ARRAY['Joins'] WHERE "id" = 'q_sql2';

UPDATE "Question" SET "tags" = ARRAY['Microservices'] WHERE "id" = 'q_hld1';
UPDATE "Question" SET "tags" = ARRAY['Message Queues'] WHERE "id" = 'q_hld2';

UPDATE "Question" SET "tags" = ARRAY['Singleton'] WHERE "id" = 'q_lld1';
UPDATE "Question" SET "tags" = ARRAY['Factory'] WHERE "id" = 'q_lld2';

UPDATE "Question" SET "tags" = ARRAY['ReAct Pattern'] WHERE "id" = 'q_agentic1';

-- ============================================
-- ADD QUESTIONS FOR HIRING CATEGORIES
-- ============================================

-- All Jobs
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_aj1', 'What are the most in-demand tech roles in 2025?', 'Full-stack developers, AI/ML engineers, cloud architects, and DevOps engineers are among the most in-demand roles.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'all-jobs'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, ARRAY['Career'], NOW()),
  ('q_aj2', 'How to prepare for a technical interview at FAANG companies?', 'Focus on data structures, algorithms, system design, and behavioral questions. Practice daily on LeetCode and mock interviews.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'all-jobs'), (SELECT "id" FROM "Field" WHERE "slug" = 'dsa'), 2, ARRAY['Career'], NOW()),
  ('q_aj3', 'What is the average salary for a software engineer in India?', 'Ranges from 6-12 LPA for freshers at product companies, and 15-40+ LPA for experienced engineers at top companies.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'all-jobs'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 3, ARRAY['Career'], NOW());

-- Internships
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_int1', 'How to find a good software engineering internship?', 'Apply through company career pages, LinkedIn, referral networks, and platforms like Internshala, AngelList. Start preparing 3-4 months in advance.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'internships'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, ARRAY['Career'], NOW()),
  ('q_int2', 'What projects should I build to get a frontend internship?', 'Build a portfolio site, a React app with API integration, a clone of a popular app, and an open-source contribution.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'internships'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 2, ARRAY['Career'], NOW()),
  ('q_int3', 'What to expect in an internship interview?', 'Usually 2-3 rounds: coding test, technical interview on CS fundamentals and projects, and a behavioral/HR round.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'internships'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 3, ARRAY['Career'], NOW());

-- Companies
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_co1', 'What does Google look for in candidates?', 'Google values general cognitive ability, role-related knowledge, leadership, and Googleyness (humility, collaboration).', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'companies'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, ARRAY['Career'], NOW()),
  ('q_co2', 'What is the hiring process at Amazon?', 'Amazon typically has: online assessment, 4-5 rounds of interviews (Leadership Principles focus), and a bar raiser round.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'companies'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, ARRAY['Career'], NOW()),
  ('q_co3', 'How is Microsoft interview different from Google?', 'Microsoft focuses more on collaboration, growth mindset, and impact. They also have a stronger emphasis on system design for senior roles.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'companies'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 3, ARRAY['Career'], NOW());
