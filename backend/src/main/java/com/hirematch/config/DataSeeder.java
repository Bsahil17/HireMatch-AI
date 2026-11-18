package com.hirematch.config;

import com.hirematch.entity.*;
import com.hirematch.enums.AnalysisStatus;
import com.hirematch.enums.ApplicationStatus;
import com.hirematch.enums.EmploymentType;
import com.hirematch.enums.JobStatus;
import com.hirematch.enums.Role;
import com.hirematch.repository.*;
import com.hirematch.security.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        System.out.println(">>> SEEDING REALISTIC DEMO DATA FOR HIRE MATCH AI <<<");
        String defaultHashedPassword = PasswordUtils.hashPassword("Password@123");

        // 1. Admin
        User admin = new User("System Administrator", "admin@hirematch.ai", defaultHashedPassword, Role.ADMIN);
        userRepository.save(admin);

        // 2. Recruiters
        User recruiter1 = new User("Sarah Jenkins", "sarah.recruiter@hirematch.ai", defaultHashedPassword, Role.RECRUITER);
        userRepository.save(recruiter1);
        recruiterProfileRepository.save(new RecruiterProfile(recruiter1, "CloudScale Solutions", "VP of Talent Acquisition", "+1 (555) 432-1098"));

        User recruiter2 = new User("David Chen", "david.chen@hirematch.ai", defaultHashedPassword, Role.RECRUITER);
        userRepository.save(recruiter2);
        recruiterProfileRepository.save(new RecruiterProfile(recruiter2, "FinTech Innovations", "Technical Hiring Lead", "+1 (555) 876-5432"));

        // 3. Candidates (10 Candidates)
        List<User> candidates = new ArrayList<>();
        String[][] candidateData = {
                {"Alex Rivera", "alex.rivera@example.com", "4.5", "B.Tech Computer Science", "Java, Spring Boot, MySQL, REST APIs, Hibernate, Docker, AWS", "Austin, TX"},
                {"Priya Sharma", "priya.sharma@example.com", "3.0", "B.E. Information Technology", "Java, Spring Boot, Microservices, PostgreSQL, Kafka, Redis", "Seattle, WA"},
                {"Marcus Vance", "marcus.vance@example.com", "5.0", "M.S. Software Engineering", "React, TypeScript, Node.js, Next.js, Tailwind CSS, GraphQL", "San Francisco, CA"},
                {"Elena Rostova", "elena.rostova@example.com", "2.0", "B.S. Computer Science", "Python, FastAPI, Django, PostgreSQL, Docker, Machine Learning", "New York, NY"},
                {"Liam O'Connor", "liam.oconnor@example.com", "6.0", "B.Tech Information Systems", "Java, Spring Boot, AWS, Kubernetes, Terraform, CI/CD, MySQL", "Chicago, IL"},
                {"Aisha Patel", "aisha.patel@example.com", "1.5", "Bachelor of Computer Applications", "JavaScript, React, HTML5, CSS3, Redux, Git", "Boston, MA"},
                {"Carlos Mendez", "carlos.mendez@example.com", "3.5", "B.S. Computer Engineering", "Java, Spring Security, Hibernate, MySQL, Docker, JUnit", "Denver, CO"},
                {"Samantha Wu", "samantha.wu@example.com", "4.0", "M.S. Data Science", "Python, PyTorch, Scikit-Learn, Pandas, SQL, NLP, LLMs", "San Jose, CA"},
                {"Jordan Miller", "jordan.miller@example.com", "0.5", "B.S. Graphic Design", "Figma, Adobe XD, UI/UX Design, HTML5, CSS3", "Los Angeles, CA"},
                {"Vikram Malhotra", "vikram.malhotra@example.com", "7.0", "M.Tech Computer Science", "Java, Spring Boot, Distributed Systems, Kafka, MySQL, Kubernetes", "Dallas, TX"}
        };

        for (String[] cd : candidateData) {
            User c = new User(cd[0], cd[1], defaultHashedPassword, Role.CANDIDATE);
            userRepository.save(c);
            candidates.add(c);

            CandidateProfile cp = new CandidateProfile(c);
            cp.setExperienceYears(Double.parseDouble(cd[2]));
            cp.setDegree(cd[3]);
            cp.setCollege("State University");
            cp.setSkills(cd[4]);
            cp.setLocation(cd[5]);
            cp.setPhone("+1 (555) " + (100 + (int)(Math.random() * 899)) + "-" + (1000 + (int)(Math.random() * 8999)));
            candidateProfileRepository.save(cp);

            // Create initial Resume
            Resume res = new Resume(
                    c,
                    cd[0].replace(" ", "_") + "_Resume.pdf",
                    UUID.randomUUID() + ".pdf",
                    "pdf",
                    "./uploads/resumes/" + cd[0].replace(" ", "_") + ".pdf",
                    "Candidate: " + cd[0] + "\nEmail: " + cd[1] + "\nLocation: " + cd[5] + "\nExperience: " + cd[2] + " years.\nEducation: " + cd[3] + "\nSkills: " + cd[4]
            );
            resumeRepository.save(res);
        }

        // 4. Job Openings (5 Jobs)
        Job jobJava = new Job();
        jobJava.setRecruiter(recruiter1);
        jobJava.setTitle("Senior Java Backend Engineer");
        jobJava.setCompanyName("CloudScale Solutions");
        jobJava.setDepartment("Platform Engineering");
        jobJava.setDescription("We are seeking an experienced Java Backend Engineer to design and implement highly scalable microservices, manage transactional databases, and integrate distributed event systems.");
        jobJava.setRequiredSkills("Java, Spring Boot, MySQL, REST APIs, Hibernate");
        jobJava.setPreferredSkills("Docker, AWS, Kafka, Microservices");
        jobJava.setMinExperience(3.0);
        jobJava.setMaxExperience(7.0);
        jobJava.setEducation("Bachelor of Science / Technology");
        jobJava.setLocation("Austin, TX (Hybrid)");
        jobJava.setEmploymentType(EmploymentType.FULL_TIME);
        jobJava.setSalaryRange("$130,000 - $165,000");
        jobJava.setOpenings(3);
        jobJava.setDeadline(LocalDate.now().plusDays(45));
        jobJava.setStatus(JobStatus.OPEN);
        jobRepository.save(jobJava);

        Job jobFrontend = new Job();
        jobFrontend.setRecruiter(recruiter1);
        jobFrontend.setTitle("Lead Frontend React Developer");
        jobFrontend.setCompanyName("CloudScale Solutions");
        jobFrontend.setDepartment("User Experience");
        jobFrontend.setDescription("Join our frontend team to architect modern, responsive UI applications using React, TypeScript, and modern state management.");
        jobFrontend.setRequiredSkills("React, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS");
        jobFrontend.setPreferredSkills("Next.js, GraphQL, Redux");
        jobFrontend.setMinExperience(3.0);
        jobFrontend.setMaxExperience(6.0);
        jobFrontend.setEducation("Bachelor's Degree");
        jobFrontend.setLocation("Remote");
        jobFrontend.setEmploymentType(EmploymentType.FULL_TIME);
        jobFrontend.setSalaryRange("$120,000 - $150,000");
        jobFrontend.setOpenings(2);
        jobFrontend.setDeadline(LocalDate.now().plusDays(30));
        jobFrontend.setStatus(JobStatus.OPEN);
        jobRepository.save(jobFrontend);

        Job jobAi = new Job();
        jobAi.setRecruiter(recruiter2);
        jobAi.setTitle("AI / NLP Research Engineer");
        jobAi.setCompanyName("FinTech Innovations");
        jobAi.setDepartment("Applied AI & ML");
        jobAi.setDescription("Lead the development of semantic parsing engines, LLM agent workflows, and quantitative analytics.");
        jobAi.setRequiredSkills("Python, PyTorch, NLP, Large Language Models, FastAPI");
        jobAi.setPreferredSkills("Docker, Scikit-Learn, Pandas, PostgreSQL");
        jobAi.setMinExperience(2.0);
        jobAi.setMaxExperience(5.0);
        jobAi.setEducation("Master's or Ph.D");
        jobAi.setLocation("New York, NY");
        jobAi.setEmploymentType(EmploymentType.FULL_TIME);
        jobAi.setSalaryRange("$145,000 - $185,000");
        jobAi.setOpenings(2);
        jobAi.setDeadline(LocalDate.now().plusDays(60));
        jobAi.setStatus(JobStatus.OPEN);
        jobRepository.save(jobAi);

        Job jobDevOps = new Job();
        jobDevOps.setRecruiter(recruiter2);
        jobDevOps.setTitle("Cloud & DevOps Architect");
        jobDevOps.setCompanyName("FinTech Innovations");
        jobDevOps.setDepartment("Infrastructure & Reliability");
        jobDevOps.setDescription("Orchestrate multi-region AWS infrastructure, Kubernetes deployments, and automated CI/CD pipelines.");
        jobDevOps.setRequiredSkills("AWS, Kubernetes, Docker, Terraform, CI/CD");
        jobDevOps.setPreferredSkills("Linux, Python, Java, Monitoring");
        jobDevOps.setMinExperience(4.0);
        jobDevOps.setEducation("Bachelor's Degree");
        jobDevOps.setLocation("San Francisco, CA");
        jobDevOps.setEmploymentType(EmploymentType.FULL_TIME);
        jobDevOps.setSalaryRange("$150,000 - $190,000");
        jobDevOps.setOpenings(1);
        jobDevOps.setDeadline(LocalDate.now().plusDays(40));
        jobDevOps.setStatus(JobStatus.OPEN);
        jobRepository.save(jobDevOps);

        Job jobFullStack = new Job();
        jobFullStack.setRecruiter(recruiter1);
        jobFullStack.setTitle("Full Stack Java & React Developer");
        jobFullStack.setCompanyName("CloudScale Solutions");
        jobFullStack.setDepartment("Digital Core");
        jobFullStack.setDescription("Build end-to-end web applications combining robust Spring Boot backends with sleek React client experiences.");
        jobFullStack.setRequiredSkills("Java, Spring Boot, React, MySQL, REST APIs");
        jobFullStack.setPreferredSkills("Docker, TypeScript, Tailwind CSS");
        jobFullStack.setMinExperience(2.0);
        jobFullStack.setLocation("Seattle, WA / Hybrid");
        jobFullStack.setEmploymentType(EmploymentType.FULL_TIME);
        jobFullStack.setSalaryRange("$115,000 - $145,000");
        jobFullStack.setOpenings(4);
        jobFullStack.setDeadline(LocalDate.now().plusDays(50));
        jobFullStack.setStatus(JobStatus.OPEN);
        jobRepository.save(jobFullStack);

        // 5. Seed Applications & Real Match Scores (20+ Applications)
        List<Job> allJobs = Arrays.asList(jobJava, jobFrontend, jobAi, jobDevOps, jobFullStack);

        class AppSeed {
            int candIdx;
            int jobIdx;
            int score;
            int statusIdx;
            String strengths;
            String gaps;

            AppSeed(int candIdx, int jobIdx, int score, int statusIdx, String strengths, String gaps) {
                this.candIdx = candIdx;
                this.jobIdx = jobIdx;
                this.score = score;
                this.statusIdx = statusIdx;
                this.strengths = strengths;
                this.gaps = gaps;
            }
        }

        List<AppSeed> appSeeds = Arrays.asList(
                new AppSeed(0, 0, 94, 2, "100% Core Skills match, 4.5 yrs exp", "Minor gap in Kafka"),
                new AppSeed(9, 0, 96, 3, "Architect level Java & distributed systems", "None"),
                new AppSeed(4, 0, 91, 1, "Strong AWS & Docker infrastructure background", "None"),
                new AppSeed(1, 0, 86, 1, "Good microservices and database track record", "Lacks Hibernate specific keyword"),
                new AppSeed(6, 0, 88, 2, "Spring Security & Hibernate specialist", "None"),
                new AppSeed(3, 0, 48, 5, "Python background; lacking Java/Spring Boot", "Missing Java, Spring Boot, Hibernate"),
                new AppSeed(8, 0, 24, 5, "Design background without backend engineering", "Missing all Java stack competencies"),

                new AppSeed(2, 1, 95, 3, "Mastery of React, Next.js and TypeScript", "None"),
                new AppSeed(5, 1, 78, 1, "Solid modern JavaScript & React fundamentals", "Lacks TypeScript depth, lower experience"),
                new AppSeed(0, 1, 72, 1, "Has React & UI skills; primarily backend", "TypeScript not demonstrated"),
                new AppSeed(8, 1, 62, 1, "Exceptional UI design sense", "Needs deeper TypeScript/state engineering"),

                new AppSeed(7, 2, 97, 4, "Top-tier NLP & LLM research acumen", "None"),
                new AppSeed(3, 2, 89, 2, "FastAPI & Python deep practitioner", "Junior on production LLM deployment"),
                new AppSeed(1, 2, 42, 5, "Java enterprise background", "Missing PyTorch, NLP stack"),

                new AppSeed(4, 3, 98, 4, "Extensive AWS, Kubernetes, and Terraform mastery", "None"),
                new AppSeed(9, 3, 85, 2, "Senior systems architect with container chops", "None"),
                new AppSeed(0, 3, 68, 1, "Developer with Docker & AWS basics", "Lacks Terraform & advanced K8s"),

                new AppSeed(0, 4, 93, 2, "Excellent dual proficiency in Java and React", "None"),
                new AppSeed(2, 4, 82, 1, "World-class React; backend in Node rather than Java", "Java/Spring Boot is secondary"),
                new AppSeed(1, 4, 89, 1, "High proficiency across Java and relational databases", "None"),
                new AppSeed(6, 4, 87, 2, "Solid full-stack engineering portfolio", "None")
        );

        ApplicationStatus[] statuses = ApplicationStatus.values();

        for (AppSeed entry : appSeeds) {
            User cand = candidates.get(entry.candIdx);
            Job j = allJobs.get(entry.jobIdx);
            int score = entry.score;
            ApplicationStatus st = statuses[entry.statusIdx];
            String strength = entry.strengths;
            String gap = entry.gaps;

            Resume res = resumeRepository.findFirstByCandidateIdOrderByUploadDateDesc(cand.getId()).orElse(null);
            if (res != null) {
                Application app = new Application(cand, j, res);
                app.setStatus(st);
                app = applicationRepository.save(app);

                ResumeAnalysis ra = new ResumeAnalysis(app);
                ra.setOverallMatchScore(score);
                if (score >= 85) ra.setRecommendation("Strong Match");
                else if (score >= 70) ra.setRecommendation("Good Match");
                else if (score >= 50) ra.setRecommendation("Moderate Match");
                else ra.setRecommendation("Low Match");

                ra.setMatchedSkills(j.getRequiredSkills());
                ra.setMissingSkills(score < 70 ? gap : "");
                ra.setPreferredSkills(j.getPreferredSkills());
                ra.setRequiredSkillsScore(score >= 80 ? 95.0 : 60.0);
                ra.setExperienceScore(score >= 80 ? 95.0 : 65.0);
                ra.setExperienceMatch(score >= 60);
                ra.setEducationMatch(true);
                ra.setCandidateExperienceYears(Double.parseDouble(candidateData[entry.candIdx][2]));
                ra.setCandidateStrengths(strength);
                ra.setCandidateGaps(gap);
                ra.setExplanation("Candidate scored " + score + "% suitability. " + strength + ".");
                ra.setSemanticSummary("Executive Summary for " + cand.getFullName() + ": Evaluated as " + ra.getRecommendation() + ". Matches critical requirements for " + j.getTitle() + ".");
                ra.setAnalysisStatus(AnalysisStatus.COMPLETED);
                resumeAnalysisRepository.save(ra);
            }
        }

        // 6. Notifications
        notificationRepository.save(new Notification(recruiter1, "AI Resume Screening Ready", "AI analysis completed for Senior Java Backend Engineer applicants. 5 candidates ranked as Strong Match."));
        notificationRepository.save(new Notification(candidates.get(0), "Application Shortlisted", "Your application for Senior Java Backend Engineer has been shortlisted by Sarah Jenkins."));
        notificationRepository.save(new Notification(candidates.get(9), "Interview Scheduled", "Interview scheduled for Senior Java Backend Engineer on Monday at 10:00 AM."));

        System.out.println(">>> SEEDING COMPLETE: 1 ADMIN, 2 RECRUITERS, 10 CANDIDATES, 5 JOBS, 21 REAL-MATCH APPLICATIONS <<<");
    }
}
