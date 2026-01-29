**Authors:** 
- Pham Nguyen Hai Anh 
- Nguyen Dang Khanh Quoc

# AWS Serverless Security Workshop

## Overview

Learn techniques to secure a serverless application built with AWS Lambda, Amazon API Gateway and RDS Aurora. This workshop covers AWS services and features to improve security of serverless applications across 5 security domains:

**Security Domains:**
- **Identity & Access Management**: Authentication, authorization, IAM policies
- **Code**: Secrets management, input validation, dependency scanning
- **Data**: Encryption in transit and at rest
- **Infrastructure**: Rate limiting, WAF, threat detection
- **Logging & Monitoring**: Distributed tracing and security monitoring

**Workshop Details:**
- **Duration**: Approximately 6 hours
- **Intended Audience**: Serverless developers and security engineers
- **Skill Level**: Intermediate
- **Prerequisites**: Basic AWS knowledge, familiarity with serverless concepts

---

## Table of Contents

- [AWS Serverless Security Workshop](#aws-serverless-security-workshop)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Module 0: Initial Setup](#module-0-initial-setup)
  - [Identity \& Access Management](#identity--access-management)
    - [Module 1: Authentication and Authorization](#module-1-authentication-and-authorization)
    - [Module 2: Lambda IAM](#module-2-lambda-iam)
    - [Module 3: Amazon Verified Permissions](#module-3-amazon-verified-permissions)
  - [Code Security](#code-security)
    - [Module 4: Secrets Management](#module-4-secrets-management)
    - [Module 5: Input Validation](#module-5-input-validation)
    - [Module 6: Dependency Vulnerability](#module-6-dependency-vulnerability)
    - [Module 7: Amazon Inspector](#module-7-amazon-inspector)
  - [Data Security](#data-security)
    - [Module 8: Encryption in Transit](#module-8-encryption-in-transit)
  - [Infrastructure Security](#infrastructure-security)
    - [Module 9: Usage Plans](#module-9-usage-plans)
    - [Module 10: WAF](#module-10-waf)
  - [Logging \& Monitoring](#logging--monitoring)
    - [Module 12: X-Ray](#module-12-x-ray)
  - [Resource Cleanup](#resource-cleanup)
  - [Extra Credit](#extra-credit)

---

## Module 0: Initial Setup

**Documentation**: [modules/module-0-initial-setup.md](modules/module-0-initial-setup.md)

**Objective**: Deploy the starter serverless application with a simple architecture using AWS Lambda, API Gateway, and RDS Aurora.

**What You'll Learn:**
- AWS account setup and prerequisites
- CloudFormation stack deployment
- Aurora MySQL database initialization
- API Gateway configuration
- VS Code Server environment setup

**Expected Duration**: 30-45 minutes

**Important Note**: The starter application is intentionally NOT following many security best practices. You will identify security gaps and implement protection measures in subsequent modules.

---

## Identity & Access Management

### Module 1: Authentication and Authorization

**Documentation**: [modules/module-1-authentication-authorization.md](modules/module-1-authentication-authorization.md)

**Objective**: Implement OAuth Client Credentials with Amazon Cognito for API protection.

**What You'll Learn:**
- Amazon Cognito User Pool configuration
- OAuth 2.0 Client Credentials flow
- Lambda authorizer implementation
- Bearer token validation
- API Gateway authorizer integration

**Key Concepts:**
- Authentication vs. Authorization
- OAuth 2.0 grant types
- JWT token validation
- Custom authorizers

**Expected Duration**: 60-90 minutes

---

### Module 2: Lambda IAM

**Documentation**: [modules/module-2-lambda-iam.md](modules/module-2-lambda-iam.md)

**Objective**: Apply least privilege principle with IAM Access Analyzer, ABAC, and permission boundaries.

**What You'll Learn:**
- Principle of least privilege
- IAM Access Analyzer for overprivileged detection
- Attribute-Based Access Control (ABAC)
- Permission boundaries
- Lambda execution role optimization

**Key Concepts:**
- IAM policy evaluation logic
- Resource-based vs. identity-based policies
- Tag-based access control
- Service control policies

**Expected Duration**: 45-60 minutes

---

### Module 3: Amazon Verified Permissions

**Documentation**: [modules/module-3-verified-permissions.md](modules/module-3-verified-permissions.md)

**Objective**: Implement authorization-as-a-service with Amazon Verified Permissions for centralized access control.

**What You'll Learn:**
- Amazon Verified Permissions (AVP) policy store setup
- Cedar policy language
- Fine-grained authorization
- Policy-based access control
- Authorization decision externalization

**Key Concepts:**
- Authorization-as-a-Service
- Policy-based access control (PBAC)
- Separation of concerns
- Zero Trust architecture

**Expected Duration**: 45-60 minutes

**Prerequisites**: Complete Modules 0 and 1 first

---

## Code Security

### Module 4: Secrets Management

**Documentation**: [modules/module-4-secrets.md](modules/module-4-secrets.md)

**Objective**: Securely manage database credentials using AWS Secrets Manager with automatic rotation.

**What You'll Learn:**
- AWS Secrets Manager integration
- Automatic credential rotation
- Secrets retrieval in Lambda
- Database connection management
- Secure credential storage

**Key Concepts:**
- Separation of secrets from code
- Automatic rotation strategies
- Secret versioning
- Least privilege access to secrets

**Expected Duration**: 45-60 minutes

---

### Module 5: Input Validation

**Documentation**: [modules/module-5-input-validation.md](modules/module-5-input-validation.md)

**Objective**: Prevent injection attacks by validating API requests at API Gateway level.

**What You'll Learn:**
- API Gateway request validation
- JSON Schema validation
- Request/response model mapping
- Input sanitization
- Defense against injection attacks

**Key Concepts:**
- Input validation vs. sanitization
- Fail-fast validation
- Schema-driven validation
- Defense in depth

**Expected Duration**: 45-60 minutes

---

### Module 6: Dependency Vulnerability

**Documentation**: [modules/module-6-dependency-vulnerability.md](modules/module-6-dependency-vulnerability.md)

**Objective**: Identify and remediate vulnerable dependencies using npm audit and depcheck.

**What You'll Learn:**
- npm audit for vulnerability scanning
- depcheck for unused dependency detection
- Dependency update strategies
- Software composition analysis
- Vulnerability remediation

**Key Concepts:**
- Supply chain security
- Dependency management
- CVE database integration
- Automated vulnerability scanning

**Expected Duration**: 30-45 minutes

---

### Module 7: Amazon Inspector

**Documentation**: [modules/module-7-amazon-inspector.md](modules/module-7-amazon-inspector.md)

**Objective**: Use Amazon Inspector to continuously scan and identify code vulnerabilities in Lambda functions.

**What You'll Learn:**
- Amazon Inspector activation
- Lambda code scanning
- CodeGuru Detector Library integration
- Vulnerability finding review
- Automated remediation verification

**Key Concepts:**
- Continuous security assessment
- Code vulnerability detection
- Finding severity classification
- Remediation workflows

**Expected Duration**: 45-60 minutes

---

## Data Security

### Module 8: Encryption in Transit

**Documentation**: [modules/module-8-encryption.md](modules/module-8-encryption.md)

**Objective**: Ensure data is encrypted using TLS/SSL for database connections.

**What You'll Learn:**
- TLS/SSL configuration for RDS
- Certificate management
- Secure database connections
- Encryption verification
- MySQL SSL/TLS setup

**Key Concepts:**
- Encryption in transit vs. at rest
- TLS protocol versions
- Certificate validation
- Man-in-the-middle attack prevention

**Expected Duration**: 30-45 minutes

---

## Infrastructure Security

### Module 9: Usage Plans

**Documentation**: [modules/module-9-usage-plans.md](modules/module-9-usage-plans.md)

**Objective**: Implement rate limiting and usage plans to prevent abuse and ensure fair resource utilization.

**What You'll Learn:**
- API Gateway usage plans
- Rate limiting configuration
- Throttling and burst limits
- API key management
- Quota enforcement

**Key Concepts:**
- Rate limiting vs. throttling
- Token bucket algorithm
- API monetization
- DDoS protection

**Expected Duration**: 45-60 minutes

---

### Module 10: WAF

**Documentation**: [modules/module-10-waf.md](modules/module-10-waf.md)

**Objective**: Protect API from common web exploits using AWS Web Application Firewall.

**What You'll Learn:**
- AWS WAF ACL creation
- Managed rule groups
- Custom WAF rules
- SQL injection protection
- XSS attack prevention

**Key Concepts:**
- Web Application Firewall patterns
- OWASP Top 10 protections
- Rate-based rules
- IP reputation lists

**Expected Duration**: 45-60 minutes

---

## Logging & Monitoring

### Module 12: X-Ray

**Documentation**: [modules/module-12-xray.md](modules/module-12-xray.md)

**Objective**: Implement distributed tracing using AWS X-Ray for monitoring and troubleshooting.

**What You'll Learn:**
- X-Ray SDK integration
- Distributed tracing
- Service map visualization
- Performance analysis
- Security incident investigation

**Key Concepts:**
- Observability in serverless
- Trace segments and subsegments
- Anomaly detection
- Root cause analysis

**Expected Duration**: 45-60 minutes

---

## Resource Cleanup

**Documentation**: [modules/resource-cleanup.md](modules/resource-cleanup.md)

**Objective**: Remove all resources created during the workshop to avoid unnecessary AWS charges.

**Important**: If you are using your own AWS account, it's critical to complete this step to avoid incurring additional charges. If you are at an AWS event with provided accounts, this step may not be necessary.

**Resources to Delete:**
- CloudFormation stacks
- RDS Aurora databases
- Cognito user pools
- Lambda functions
- API Gateway
- CloudWatch log groups
- S3 buckets
- EC2 instances
- WAF ACLs

**Expected Duration**: 15-30 minutes

---

## Extra Credit

Due to time constraints, the modules do not cover ALL security best practices that should be applied to your API. What other security measures can you identify that the application setup is missing?

**Suggested Areas to Explore:**

1. **Advanced IAM Patterns**
   - Service control policies (SCPs)
   - Session policies
   - Resource-based policies for cross-account access

2. **Data Protection**
   - Encryption at rest for Aurora
   - Field-level encryption
   - AWS KMS key rotation

3. **Network Security**
   - VPC endpoints for AWS services
   - Private API Gateway
   - Network ACLs

4. **Compliance & Governance**
   - AWS Config rules
   - CloudTrail data events
   - AWS Security Hub integration

5. **Operational Excellence**
   - Automated security testing (CI/CD)
   - Chaos engineering for security
   - Regular security assessments

6. **Cost Optimization**
   - Reserved capacity for predictable workloads
   - Lambda power tuning
   - S3 lifecycle policies

**Additional Resources:**
- [AWS Well-Architected Framework - Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
- [AWS Serverless Applications Lens](https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [OWASP Serverless Top 10](https://owasp.org/www-project-serverless-top-10/)

