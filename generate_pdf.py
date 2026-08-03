import os

def create_resume_pdf(filename="Shahroz_Nasir_Resume.pdf"):
    content = """Md. Shahroz Nasir
Software Engineer | Backend • AI • Full Stack
Email: mdshahroznasir@gmail.com | Phone: +91 9876543210
GitHub: https://github.com/shahroznasir | Location: Bengaluru, India

================================================================================
EXECUTIVE SUMMARY
================================================================================
Computer Science Engineering graduate (2025) specializing in scalable Python 
FastAPI backends, Generative AI / LLM pipeline integration, and modern web software. 
Demonstrated engineering discipline across 37+ GitHub repositories, RESTful API 
architecture, database schema optimization, and Docker containerization.

================================================================================
TECHNICAL COMPETENCIES
================================================================================
• Languages: Python (Expert), C++, JavaScript (ES6+), SQL, HTML5/CSS3
• Frameworks: FastAPI, Node.js, Express, React, SQLAlchemy, Streamlit, LangChain
• AI & ML: OpenAI API, LLM RAG Pipelines, Prompt Engineering, OpenCV, Vector DBs
• Databases & Caching: PostgreSQL, Redis, SQLite, Database Indexing & Query Profiling
• Cloud & DevOps: Docker, AWS (S3, EC2), Git, GitHub Actions CI/CD, Linux CLI

================================================================================
FEATURED PROJECTS
================================================================================
1. ADCB Card AI Intelligence Platform (Python, FastAPI, OpenAI API, Docker)
   • Engineered an intelligent credit profiling engine querying card reward metrics 
     and approval limits dynamically using LLMs and RAG pipelines.
   • Designed async API endpoints with sub-60ms response latencies.

2. YouTube Video Summarizer & Transcript Pipeline (Python, Streamlit, LangChain)
   • Built automated transcript extraction and LLM summarization pipeline.
   • Delivered structured executive bullet highlights from multi-hour video lectures.

3. Social Media Scalable RESTful API (Python, FastAPI, PostgreSQL, JWT Auth)
   • Production-grade RESTful API featuring JWT authentication, password hashing,
     transactional post handling, and Pydantic request validation middleware.

================================================================================
EDUCATION
================================================================================
Bachelor of Technology in Computer Science & Engineering (2021 - 2025)
Focus: Data Structures & Algorithms, OS, DBMS, Software Engineering, AI/ML
    """

    # Pure PDF generator implementation
    pdf_text = content.strip().encode('latin-1', 'replace')
    lines = pdf_text.split(b'\n')
    
    # PDF Objects
    objects = []
    
    # Obj 1: Catalog
    objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj")
    # Obj 2: Pages
    objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj")
    # Obj 3: Page
    objects.append(b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj")
    # Obj 4: Font
    objects.append(b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj")
    
    # Obj 5: Contents (Stream)
    stream_lines = [b"BT", b"/F1 9 Tf", b"11 TL", b"36 750 Td"]
    for l in lines:
        escaped_line = l.replace(b'\\', b'\\\\').replace(b'(', b'\\(').replace(b')', b'\\)')
        stream_lines.append(b"(" + escaped_line + b") '")
    stream_lines.append(b"ET")
    
    stream_data = b"\n".join(stream_lines)
    stream_obj = b"5 0 obj\n<< /Length " + str(len(stream_data)).encode('ascii') + b" >>\nstream\n" + stream_data + b"\nendstream\nendobj"
    objects.append(stream_obj)

    # Write PDF File
    with open(filename, "wb") as f:
        f.write(b"%PDF-1.4\n")
        offsets = []
        offset = 9  # len("%PDF-1.4\n")
        for obj in objects:
            offsets.append(offset)
            f.write(obj + b"\n")
            offset += len(obj) + 1
            
        xref_start = offset
        f.write(b"xref\n0 " + str(len(objects) + 1).encode('ascii') + b"\n")
        f.write(b"0000000000 65535 f \n")
        for off in offsets:
            f.write(f"{off:010d} 00000 n \n".encode('ascii'))
            
        f.write(b"trailer\n<< /Size " + str(len(objects) + 1).encode('ascii') + b" /Root 1 0 R >>\n")
        f.write(b"startxref\n" + str(xref_start).encode('ascii') + b"\n%%EOF\n")

    print(f"Successfully generated {filename}")

if __name__ == "__main__":
    create_resume_pdf()
