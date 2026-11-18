import re
from typing import Dict, List, Set, Tuple

# Canonical skills and their known aliases/synonyms
SKILL_MAP: Dict[str, List[str]] = {
    # Programming Languages
    "Java": ["java", "core java", "java 8", "java 11", "java 17", "java 21"],
    "Python": ["python", "python3", "py"],
    "JavaScript": ["javascript", "js", "ecmascript", "es6", "es6+"],
    "TypeScript": ["typescript", "ts"],
    "C++": ["c++", "cpp"],
    "C#": ["c#", "csharp", "c sharp", ".net c#"],
    "Go": ["golang", "go language", "go lang"],
    "Rust": ["rust", "rustlang"],
    "PHP": ["php", "php7", "php8"],
    "Ruby": ["ruby", "ruby on rails"],
    "Kotlin": ["kotlin"],
    "Swift": ["swift", "swiftui"],
    "SQL": ["sql", "structured query language", "transact-sql", "t-sql", "pl/sql"],

    # Frameworks & Libraries
    "Spring Boot": ["spring boot", "springboot", "spring-boot", "spring framework", "spring"],
    "Spring Security": ["spring security", "spring-security"],
    "Hibernate": ["hibernate", "jpa", "spring data jpa", "hibernate orm", "hibernate/jpa"],
    "React": ["react", "react.js", "reactjs", "react native"],
    "Next.js": ["next.js", "nextjs", "next"],
    "Angular": ["angular", "angularjs", "angular 2+"],
    "Vue.js": ["vue", "vue.js", "vuejs"],
    "Node.js": ["node.js", "nodejs", "node"],
    "Express.js": ["express", "express.js", "expressjs"],
    "Django": ["django", "django rest framework", "drf"],
    "FastAPI": ["fastapi", "fast-api"],
    "Flask": ["flask"],
    "ASP.NET": ["asp.net", ".net core", "dotnet", "dotnet core", ".net"],
    
    # Databases
    "MySQL": ["mysql", "my sql"],
    "PostgreSQL": ["postgresql", "postgres", "psql"],
    "MongoDB": ["mongodb", "mongo"],
    "Redis": ["redis"],
    "Oracle": ["oracle", "oracle db", "oracle database"],
    "Microsoft SQL Server": ["sql server", "mssql", "ms sql server"],
    "Cassandra": ["cassandra", "apache cassandra"],
    "Elasticsearch": ["elasticsearch", "elastic search", "elk"],
    "DynamoDB": ["dynamodb", "aws dynamodb"],
    "SQLite": ["sqlite", "sqlite3"],

    # Cloud & DevOps
    "Docker": ["docker", "containerization", "containers", "dockerfile", "docker compose"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda"],
    "GCP": ["gcp", "google cloud", "google cloud platform"],
    "Azure": ["azure", "microsoft azure"],
    "CI/CD": ["ci/cd", "ci cd", "continuous integration", "continuous delivery", "github actions", "gitlab ci", "jenkins"],
    "Terraform": ["terraform", "iac", "infrastructure as code"],
    "Linux": ["linux", "unix", "ubuntu", "bash", "shell scripting", "shell"],

    # APIs & Architecture
    "REST APIs": ["rest", "rest api", "rest apis", "restful", "restful apis", "rest web services"],
    "GraphQL": ["graphql"],
    "Microservices": ["microservices", "microservice architecture", "distributed systems"],
    "Kafka": ["kafka", "apache kafka", "event streaming", "message broker"],
    "RabbitMQ": ["rabbitmq", "amqp"],
    "gRPC": ["grpc"],

    # Web & UI
    "HTML5": ["html", "html5"],
    "CSS3": ["css", "css3"],
    "Tailwind CSS": ["tailwind", "tailwindcss", "tailwind css"],
    "Bootstrap": ["bootstrap", "bootstrap 5"],
    "Sass": ["sass", "scss"],
    "Redux": ["redux", "redux toolkit", "rtk"],

    # AI / ML & Data Science
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning", "neural networks"],
    "NLP": ["nlp", "natural language processing", "text mining"],
    "Computer Vision": ["computer vision", "cv", "opencv"],
    "TensorFlow": ["tensorflow", "tf"],
    "PyTorch": ["pytorch", "torch"],
    "Scikit-Learn": ["scikit-learn", "sklearn"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Large Language Models": ["llm", "llms", "large language models", "prompt engineering", "langchain", "rag"],

    # Tools, Testing & Methodologies
    "Git": ["git", "github", "gitlab", "bitbucket"],
    "Maven": ["maven", "apache maven"],
    "Gradle": ["gradle"],
    "JUnit": ["junit", "junit 5", "mockito", "testing", "unit testing"],
    "Jest": ["jest", "cypress", "playwright"],
    "Agile": ["agile", "scrum", "kanban", "jira"],
    "Data Structures & Algorithms": ["data structures", "algorithms", "dsa", "problem solving"]
}

SKILL_CATEGORIES = {
    "programming_languages": ["Java", "Python", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "PHP", "Ruby", "Kotlin", "Swift", "SQL"],
    "frameworks": ["Spring Boot", "Spring Security", "Hibernate", "React", "Next.js", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "FastAPI", "Flask", "ASP.NET", "Redux"],
    "databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle", "Microsoft SQL Server", "Cassandra", "Elasticsearch", "DynamoDB", "SQLite"],
    "cloud_devops": ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Terraform", "Linux"],
    "tools_other": ["REST APIs", "GraphQL", "Microservices", "Kafka", "RabbitMQ", "HTML5", "CSS3", "Tailwind CSS", "Git", "Maven", "Gradle", "JUnit", "Agile", "Data Structures & Algorithms", "Machine Learning", "NLP"]
}

def normalize_skill(skill: str) -> str:
    """Normalize a raw skill text into standard canonical form."""
    clean = skill.strip().lower()
    for canonical, aliases in SKILL_MAP.items():
        if clean == canonical.lower():
            return canonical
        for alias in aliases:
            if clean == alias.lower():
                return canonical
    # Title-case if unknown
    return skill.strip().title()

def find_matched_skill(target_skill: str, candidate_skills: Set[str]) -> Tuple[bool, str]:
    """
    Checks if a target required/preferred skill is present among candidate skills,
    accounting for aliases and normalizations.
    """
    normalized_target = normalize_skill(target_skill)
    target_aliases = SKILL_MAP.get(normalized_target, [normalized_target.lower()])
    
    for candidate_skill in candidate_skills:
        normalized_cand = normalize_skill(candidate_skill)
        if normalized_cand.lower() == normalized_target.lower():
            return True, normalized_target
        cand_aliases = SKILL_MAP.get(normalized_cand, [normalized_cand.lower()])
        if any(a.lower() in [t.lower() for t in target_aliases] for a in cand_aliases):
            return True, normalized_target
            
    return False, normalized_target
