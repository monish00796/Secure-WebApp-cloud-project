# Secure-WebApp-cloud-project
Secure Web Application Cloud Architecture
Overview

This project demonstrates a secure multi-tier web application architecture deployed in a cloud environment. The primary focus is on understanding how public-facing services securely communicate with internal backend systems.

The project emphasizes network isolation, TLS-based communication, and secure configuration of cloud resources.

Architecture:
The environment consists of:
1) A public web application exposed to the internet
2) Backend services hosted on private instances
3) A Virtual Private Cloud (VPC) with public and private subnets
4) Security groups controlling access between layers
5) TLS-enabled communication between services

Refer to the /architecture folder for the diagram.

Implementation & Testing

The following activities were performed:
1) Deployment of public and private web applications
2) Configuration of network access controls (security groups)
3) Testing connectivity between services using curl
4) TLS handshake validation and debugging using OpenSSL
5) Troubleshooting communication issues between public and private services

Tools & Technologies

1) AWS EC2, VPC
2) curl
3) OpenSSL
4) Linux networking tools

Key Learning Outcomes
1) Importance of isolating backend services in private subnets
2) How TLS ensures secure service-to-service communication
3) Common causes of connectivity failures in cloud environments
4) Debugging techniques using curl and OpenSSL
5) Designing secure multi-tier architectures

Academic Context

This project was completed as part of coursework at the University of Maryland. The base application code was provided, while the focus of this work was on deployment, security analysis, and cloud configuration.

Security Best Practices Highlighted
1) Restrict backend access to internal traffic only
2) Use trusted TLS certificates and enforce validation
3) Apply strict security group rules
4) Monitor internal communication patterns
