-- ============================================
-- STEP 1: DELETE OLD CATEGORY-BASED QUESTIONS
-- ============================================
DELETE FROM "Question" WHERE "questionSetId" IS NULL;

-- ============================================
-- STEP 2: UPSERT FIELDS
-- ============================================
INSERT INTO "Field" ("id", "name", "slug", "sortOrder", "isActive", "createdAt")
VALUES
  ('fld_frontend', 'Frontend', 'frontend', 1, true, NOW()),
  ('fld_backend', 'Backend', 'backend', 2, true, NOW()),
  ('fld_sysdesign', 'System Design', 'system-design', 3, true, NOW()),
  ('fld_dsa', 'DSA', 'dsa', 4, true, NOW()),
  ('fld_devops', 'DevOps', 'devops', 5, true, NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name", "sortOrder" = EXCLUDED."sortOrder";

-- ============================================
-- STEP 3: UPSERT TOP-LEVEL CATEGORIES
-- ============================================
INSERT INTO "Category" ("id", "name", "slug", "parentId", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_hiring', 'Hiring', 'hiring', NULL, 1, true, NOW(), NOW()),
  ('cat_library', 'Library', 'library', NULL, 2, true, NOW(), NOW()),
  ('cat_aiml', 'AI and Machine Learning', 'ai-ml', NULL, 3, true, NOW(), NOW()),
  ('cat_sysdesign', 'System Design', 'system-design', NULL, 4, true, NOW(), NOW()),
  ('cat_fundamentals', 'Fundamentals', 'fundamentals', NULL, 5, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- ============================================
-- STEP 4: UPSERT CHILD CATEGORIES
-- ============================================

-- Hiring children
INSERT INTO "Category" ("id", "name", "slug", "parentId", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_alljobs', 'All Jobs', 'all-jobs', (SELECT "id" FROM "Category" WHERE "slug" = 'hiring'), 1, true, NOW(), NOW()),
  ('cat_intern', 'Internships', 'internships', (SELECT "id" FROM "Category" WHERE "slug" = 'hiring'), 2, true, NOW(), NOW()),
  ('cat_companies', 'Companies', 'companies', (SELECT "id" FROM "Category" WHERE "slug" = 'hiring'), 3, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- Library children
INSERT INTO "Category" ("id", "name", "slug", "parentId", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_iq', 'Interview Questions', 'interview-questions', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 1, true, NOW(), NOW()),
  ('cat_dsa', 'DSA', 'dsa', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 2, true, NOW(), NOW()),
  ('cat_projects', 'Projects', 'projects', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 3, true, NOW(), NOW()),
  ('cat_hr', 'HR Questions', 'hr-questions', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 4, true, NOW(), NOW()),
  ('cat_scenario', 'Scenario Based Questions', 'scenario-based', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 5, true, NOW(), NOW()),
  ('cat_aptitude', 'Aptitude Questions', 'aptitude', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 6, true, NOW(), NOW()),
  ('cat_corecs', 'Core CS Subjects', 'core-cs', (SELECT "id" FROM "Category" WHERE "slug" = 'library'), 7, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- AI & ML children
INSERT INTO "Category" ("id", "name", "slug", "parentId", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_agentic', 'Agentic AI', 'agentic-ai', (SELECT "id" FROM "Category" WHERE "slug" = 'ai-ml'), 1, true, NOW(), NOW()),
  ('cat_aiml_q', 'AI & ML Questions', 'ai-ml-questions', (SELECT "id" FROM "Category" WHERE "slug" = 'ai-ml'), 2, true, NOW(), NOW()),
  ('cat_sql', 'SQL Questions', 'sql', (SELECT "id" FROM "Category" WHERE "slug" = 'ai-ml'), 3, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- System Design children
INSERT INTO "Category" ("id", "name", "slug", "parentId", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_hld', 'High Level Design', 'high-level-design', (SELECT "id" FROM "Category" WHERE "slug" = 'system-design'), 1, true, NOW(), NOW()),
  ('cat_lld', 'Low Level Design', 'low-level-design', (SELECT "id" FROM "Category" WHERE "slug" = 'system-design'), 2, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- Fundamentals children
INSERT INTO "Category" ("id", "name", "slug", "parentId", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  ('cat_oops', 'OOPs Concepts', 'oops', (SELECT "id" FROM "Category" WHERE "slug" = 'fundamentals'), 1, true, NOW(), NOW()),
  ('cat_cn', 'Computer Network', 'computer-network', (SELECT "id" FROM "Category" WHERE "slug" = 'fundamentals'), 2, true, NOW(), NOW()),
  ('cat_os', 'Operating System', 'operating-system', (SELECT "id" FROM "Category" WHERE "slug" = 'fundamentals'), 3, true, NOW(), NOW()),
  ('cat_dbms', 'DBMS', 'dbms', (SELECT "id" FROM "Category" WHERE "slug" = 'fundamentals'), 4, true, NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- ============================================
-- STEP 5: UPSERT COMPANIES
-- ============================================
INSERT INTO "Company" ("id", "name", "slug", "createdAt", "updatedAt")
VALUES
  ('comp_google', 'Google', 'google', NOW(), NOW()),
  ('comp_ms', 'Microsoft', 'microsoft', NOW(), NOW()),
  ('comp_amazon', 'Amazon', 'amazon', NOW(), NOW()),
  ('comp_meta', 'Meta', 'meta', NOW(), NOW()),
  ('comp_apple', 'Apple', 'apple', NOW(), NOW())
ON CONFLICT ("slug") DO UPDATE SET "name" = EXCLUDED."name";

-- ============================================
-- STEP 6: CREATE QUESTIONS WITH fieldId
-- ============================================

-- Interview Questions (6)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_iq1', 'What is a closure?', 'A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned. Closures are created every time a function is created.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'interview-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, '{}', NOW()),
  ('q_iq2', 'Explain the event loop', 'The event loop is a mechanism that allows Node.js to perform non-blocking I/O operations. Despite JavaScript being single-threaded, the event loop offloads operations to the system kernel.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'interview-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, '{}', NOW()),
  ('q_iq3', 'What is hoisting?', 'Hoisting is JavaScripts behavior of moving declarations to the top of their scope during compilation. var declarations are hoisted with undefined initialization, while let/const are not.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'interview-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 3, '{}', NOW()),
  ('q_iq4', 'Explain Promise and async/await', 'Promises represent the eventual completion or failure of an async operation. async/await is syntactic sugar over promises that makes asynchronous code look synchronous.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'interview-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 4, '{}', NOW()),
  ('q_iq5', 'What is middleware in Express?', 'Middleware functions have access to the request object, response object, and the next middleware function. They can execute code, modify request/response, and end the cycle.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'interview-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 5, '{}', NOW()),
  ('q_iq6', 'How does React Virtual DOM work?', 'React creates a lightweight copy of the real DOM. When state changes, a new Virtual DOM tree is created, compared with the previous one, and only minimal changes are applied to the real DOM.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'interview-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 6, '{}', NOW());

-- DSA (4)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_dsa1', 'Explain Big O notation', 'Big O notation describes the upper bound of an algorithms time or space complexity. It gives the worst-case scenario for how an algorithm scales.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'dsa'), (SELECT "id" FROM "Field" WHERE "slug" = 'dsa'), 1, '{}', NOW()),
  ('q_dsa2', 'Implement a binary search tree', 'A BST is a tree where left child < parent < right child. Operations like search, insert, and delete take O(log n) average time.', 'HARD', (SELECT "id" FROM "Category" WHERE "slug" = 'dsa'), (SELECT "id" FROM "Field" WHERE "slug" = 'dsa'), 2, '{}', NOW()),
  ('q_dsa3', 'What is a hash map?', 'A hash map uses a hash function to map keys to array indices, allowing O(1) average time for insert, delete, and lookup.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'dsa'), (SELECT "id" FROM "Field" WHERE "slug" = 'dsa'), 3, '{}', NOW()),
  ('q_dsa4', 'Explain graph traversal algorithms', 'BFS explores nodes level by level using a queue. DFS explores as deep as possible along each branch before backtracking.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'dsa'), (SELECT "id" FROM "Field" WHERE "slug" = 'dsa'), 4, '{}', NOW());

-- HR Questions (3)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_hr1', 'Tell me about yourself', 'Start with your background, then mention relevant experience and skills, and end with why you are interested in this role.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'hr-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, '{}', NOW()),
  ('q_hr2', 'Why should we hire you?', 'Highlight your skills that match the job requirements, give examples of past achievements, and show enthusiasm.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'hr-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 2, '{}', NOW()),
  ('q_hr3', 'Where do you see yourself in 5 years?', 'Focus on growth and learning. Show that you want to develop your skills and take on more responsibility.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'hr-questions'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 3, '{}', NOW());

-- Scenario Based (3)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_sb1', 'How would you design a URL shortener?', 'Use a hash function to generate short URLs. Store mappings in a database with TTL for expiration.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'scenario-based'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 1, '{}', NOW()),
  ('q_sb2', 'Design a real-time chat application', 'Use WebSockets for real-time bidirectional communication. Store messages in a database with timestamps.', 'HARD', (SELECT "id" FROM "Category" WHERE "slug" = 'scenario-based'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 2, '{}', NOW()),
  ('q_sb3', 'How would you handle 1 million concurrent users?', 'Use load balancing, horizontal scaling, caching (Redis), CDN for static assets, and database sharding.', 'HARD', (SELECT "id" FROM "Category" WHERE "slug" = 'scenario-based'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 3, '{}', NOW());

-- OOPs (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_oops1', 'What is polymorphism?', 'Polymorphism allows objects of different types to be treated as objects of a common parent type.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'oops'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, '{}', NOW()),
  ('q_oops2', 'Explain SOLID principles', 'S - Single Responsibility, O - Open/Closed, L - Liskov Substitution, I - Interface Segregation, D - Dependency Inversion.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'oops'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, '{}', NOW());

-- Computer Network (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_cn1', 'What is the difference between TCP and UDP?', 'TCP is connection-oriented, reliable, and ordered. UDP is connectionless, faster, and does not guarantee delivery.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'computer-network'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 1, '{}', NOW()),
  ('q_cn2', 'What is DNS?', 'DNS translates domain names to IP addresses. It works like a phone book for the internet.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'computer-network'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, '{}', NOW());

-- OS (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_os1', 'What is a deadlock?', 'A deadlock occurs when two or more processes are unable to proceed because each is waiting for the other to release a resource.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'operating-system'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 1, '{}', NOW()),
  ('q_os2', 'Explain process vs thread', 'A process is an independent program with its own memory space. A thread is a lightweight process that shares memory.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'operating-system'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, '{}', NOW());

-- DBMS (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_dbms1', 'What is normalization?', 'Normalization is the process of organizing database tables to reduce data redundancy and improve data integrity.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'dbms'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 1, '{}', NOW()),
  ('q_dbms2', 'What is an index in databases?', 'An index is a data structure that improves the speed of data retrieval operations on a database table.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'dbms'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, '{}', NOW());

-- SQL (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_sql1', 'What is the difference between DELETE and TRUNCATE?', 'DELETE removes rows one by one with WHERE clause support. TRUNCATE removes all rows at once and is faster.', 'EASY', (SELECT "id" FROM "Category" WHERE "slug" = 'sql'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 1, '{}', NOW()),
  ('q_sql2', 'Explain JOIN types in SQL', 'INNER JOIN returns matching rows. LEFT JOIN returns all rows from left table. RIGHT JOIN from right. FULL JOIN from both.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'sql'), (SELECT "id" FROM "Field" WHERE "slug" = 'backend'), 2, '{}', NOW());

-- HLD (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_hld1', 'Design a chat application', 'Use WebSockets for real-time messaging, Redis for pub/sub, message queue for offline messages, and database sharding.', 'HARD', (SELECT "id" FROM "Category" WHERE "slug" = 'high-level-design'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 1, '{}', NOW()),
  ('q_hld2', 'Design a notification system', 'Use message queues for async processing, multiple delivery channels, and a priority system for different notification types.', 'HARD', (SELECT "id" FROM "Category" WHERE "slug" = 'high-level-design'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 2, '{}', NOW());

-- LLD (2)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_lld1', 'Design a parking lot system', 'Use OOP principles with classes for Vehicle, ParkingSpot, ParkingLot. Implement strategy pattern for different vehicle sizes.', 'HARD', (SELECT "id" FROM "Category" WHERE "slug" = 'low-level-design'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 1, '{}', NOW()),
  ('q_lld2', 'Design a library management system', 'Use design patterns like Factory for book creation, Observer for due date notifications, and Strategy for membership types.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'low-level-design'), (SELECT "id" FROM "Field" WHERE "slug" = 'system-design'), 2, '{}', NOW());

-- Agentic AI (1)
INSERT INTO "Question" ("id", "content", "answer", "difficulty", "categoryId", "fieldId", "order", "tags", "createdAt")
VALUES
  ('q_agentic1', 'What is an AI agent?', 'An AI agent is an autonomous entity that perceives its environment through sensors and acts upon it through actuators.', 'MEDIUM', (SELECT "id" FROM "Category" WHERE "slug" = 'agentic-ai'), (SELECT "id" FROM "Field" WHERE "slug" = 'frontend'), 1, '{}', NOW());
