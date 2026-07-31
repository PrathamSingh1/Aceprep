-- ============================================
-- SEED COMPANIES
-- ============================================
INSERT INTO "Company" ("id", "name", "slug", "website", "createdAt", "updatedAt")
VALUES
  ('comp_flipkart', 'Flipkart', 'flipkart', 'https://flipkart.com', NOW(), NOW()),
  ('comp_swiggy', 'Swiggy', 'swiggy', 'https://swiggy.com', NOW(), NOW()),
  ('comp_razorpay', 'Razorpay', 'razorpay', 'https://razorpay.com', NOW(), NOW()),
  ('comp_phonepe', 'PhonePe', 'phonepe', 'https://phonepe.com', NOW(), NOW()),
  ('comp_cred', 'CRED', 'cred', 'https://cred.com', NOW(), NOW()),
  ('comp_zerodha', 'Zerodha', 'zerodha', 'https://zerodha.com', NOW(), NOW()),
  ('comp_databricks', 'Databricks', 'databricks', 'https://databricks.com', NOW(), NOW()),
  ('comp_nutanix', 'Nutanix', 'nutanix', 'https://nutanix.com', NOW(), NOW()),
  ('comp_atlassian', 'Atlassian', 'atlassian', 'https://atlassian.com', NOW(), NOW())
ON CONFLICT ("slug") DO NOTHING;

-- ============================================
-- SEED FULL-TIME JOBS
-- ============================================
INSERT INTO "Job" ("id", "title", "companyId", "type", "location", "description", "applyUrl", "isActive", "createdAt", "updatedAt", "salaryMin", "salaryMax", "isRemote", "isStartup", "isHFT", "tags", "postedAt")
VALUES
  ('job1', 'Senior Frontend Engineer', (SELECT "id" FROM "Company" WHERE "slug" = 'google'), 'FULL_TIME', 'Bangalore', 'Build next-gen web experiences for Google Search. React, TypeScript.', NULL, true, NOW(), NOW(), 2500000, 5500000, false, false, false, ARRAY['Frontend', 'React'], NOW() - INTERVAL '1 day'),
  ('job2', 'Backend Engineer - Cloud', (SELECT "id" FROM "Company" WHERE "slug" = 'microsoft'), 'FULL_TIME', 'Hyderabad', 'Design and build scalable cloud services for Azure. Go, Rust.', NULL, true, NOW(), NOW(), 2000000, 4500000, false, false, false, ARRAY['Backend', 'Cloud'], NOW() - INTERVAL '2 days'),
  ('job3', 'ML Engineer', (SELECT "id" FROM "Company" WHERE "slug" = 'amazon'), 'FULL_TIME', 'Chennai', 'Build ML models for Amazon recommendation systems. PyTorch.', NULL, true, NOW(), NOW(), 1800000, 4000000, false, false, false, ARRAY['ML', 'AI'], NOW() - INTERVAL '3 days'),
  ('job4', 'Full Stack Developer', (SELECT "id" FROM "Company" WHERE "slug" = 'flipkart'), 'FULL_TIME', 'Bangalore', 'Build end-to-end features. React + Node.js stack.', NULL, true, NOW(), NOW(), 1200000, 2800000, false, false, false, ARRAY['Full Stack', 'React'], NOW() - INTERVAL '4 days'),
  ('job5', 'DevOps Engineer', (SELECT "id" FROM "Company" WHERE "slug" = 'swiggy'), 'FULL_TIME', 'Bangalore', 'Manage CI/CD pipelines and Kubernetes infrastructure.', NULL, true, NOW(), NOW(), 1500000, 3000000, true, false, false, ARRAY['DevOps', 'Kubernetes'], NOW() - INTERVAL '5 days'),
  ('job6', 'Software Engineer', (SELECT "id" FROM "Company" WHERE "slug" = 'razorpay'), 'FULL_TIME', 'Bangalore', 'Build payment infrastructure. Java, Kotlin.', NULL, true, NOW(), NOW(), 1400000, 3200000, false, true, false, ARRAY['Backend', 'Java'], NOW() - INTERVAL '6 days'),
  ('job7', 'Frontend Lead', (SELECT "id" FROM "Company" WHERE "slug" = 'phonepe'), 'FULL_TIME', 'Bangalore', 'Lead frontend team. React, GraphQL, micro-frontends.', NULL, true, NOW(), NOW(), 2200000, 4200000, false, false, false, ARRAY['Frontend', 'React'], NOW() - INTERVAL '7 days'),
  ('job8', 'Quant Developer', (SELECT "id" FROM "Company" WHERE "slug" = 'zerodha'), 'FULL_TIME', 'Bangalore', 'Build high-frequency trading systems. C++, low-latency.', NULL, true, NOW(), NOW(), 3000000, 6000000, false, false, true, ARRAY['Quant', 'C++', 'HFT'], NOW() - INTERVAL '1 day'),
  ('job9', 'Data Engineer', (SELECT "id" FROM "Company" WHERE "slug" = 'cred'), 'FULL_TIME', 'Bangalore', 'Design data pipelines. Spark, Kafka, BigQuery.', NULL, true, NOW(), NOW(), 1600000, 3500000, false, true, false, ARRAY['Data', 'Spark'], NOW() - INTERVAL '8 days'),
  ('job10', 'Platform Engineer', (SELECT "id" FROM "Company" WHERE "slug" = 'databricks'), 'FULL_TIME', 'Remote - India', 'Build internal developer platform. Kubernetes, Go.', NULL, true, NOW(), NOW(), 2500000, 5000000, true, false, false, ARRAY['Platform', 'Go'], NOW() - INTERVAL '3 days'),
  ('job11', 'SRE', (SELECT "id" FROM "Company" WHERE "slug" = 'atlassian'), 'FULL_TIME', 'Bangalore', 'Ensure reliability of Atlassian cloud. Linux, Python.', NULL, true, NOW(), NOW(), 2000000, 4000000, false, false, false, ARRAY['SRE', 'Linux'], NOW() - INTERVAL '9 days'),
  ('job12', 'Backend Engineer - Fintech', (SELECT "id" FROM "Company" WHERE "slug" = 'phonepe'), 'FULL_TIME', 'Bangalore', 'Build UPI payment systems at scale. Java, Go.', NULL, true, NOW(), NOW(), 1800000, 3800000, false, false, false, ARRAY['Backend', 'Java'], NOW() - INTERVAL '2 days');

-- ============================================
-- SEED INTERNSHIPS
-- ============================================
INSERT INTO "Job" ("id", "title", "companyId", "type", "location", "description", "applyUrl", "isActive", "createdAt", "updatedAt", "salaryMin", "salaryMax", "isRemote", "isStartup", "isHFT", "tags", "postedAt")
VALUES
  ('int1', 'Frontend Development Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'flipkart'), 'INTERNSHIP', 'Bangalore', 'Work on Flipkart web app. React, TypeScript.', NULL, true, NOW(), NOW(), 25000, 40000, false, false, false, ARRAY['Frontend', 'React'], NOW() - INTERVAL '1 day'),
  ('int2', 'Backend Engineering Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'swiggy'), 'INTERNSHIP', 'Bangalore', 'Build APIs for delivery partner app. Node.js.', NULL, true, NOW(), NOW(), 20000, 35000, false, false, false, ARRAY['Backend', 'Node.js'], NOW() - INTERVAL '2 days'),
  ('int3', 'ML Research Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'google'), 'INTERNSHIP', 'Bangalore', 'Research and implement ML models. PyTorch.', NULL, true, NOW(), NOW(), 50000, 80000, false, false, false, ARRAY['ML', 'Research'], NOW() - INTERVAL '3 days'),
  ('int4', 'SDE Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'razorpay'), 'INTERNSHIP', 'Bangalore', 'Build payment features. Java, microservices.', NULL, true, NOW(), NOW(), 30000, 50000, false, true, false, ARRAY['Backend', 'Java'], NOW() - INTERVAL '4 days'),
  ('int5', 'Product Design Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'cred'), 'INTERNSHIP', 'Bangalore', 'Design user experiences. Figma, prototyping.', NULL, true, NOW(), NOW(), 25000, 40000, false, true, false, ARRAY['Design', 'Figma'], NOW() - INTERVAL '5 days'),
  ('int6', 'Data Science Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'phonepe'), 'INTERNSHIP', 'Bangalore', 'Analyze user data for growth insights. Python, SQL.', NULL, true, NOW(), NOW(), 20000, 35000, false, false, false, ARRAY['Data', 'Python'], NOW() - INTERVAL '6 days'),
  ('int7', 'Cloud Engineering Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'microsoft'), 'INTERNSHIP', 'Hyderabad', 'Work on Azure cloud services. Python.', NULL, true, NOW(), NOW(), 40000, 60000, false, false, false, ARRAY['Cloud', 'Azure'], NOW() - INTERVAL '7 days'),
  ('int8', 'Full Stack Intern', (SELECT "id" FROM "Company" WHERE "slug" = 'nutanix'), 'INTERNSHIP', 'Pune', 'Build internal tools. React, Go.', NULL, true, NOW(), NOW(), 25000, 40000, false, false, false, ARRAY['Full Stack', 'React'], NOW() - INTERVAL '8 days');
