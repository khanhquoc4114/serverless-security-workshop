# Resource Cleanup

## Overview

Congratulations on completing the AWS Serverless Security Workshop!

This page provides instructions for cleaning up the resources created during the workshop. This is important to ensure you don't accrue charges in your AWS account.

> **Important for AWS Event Participants**: If you are running this workshop at an AWS event where accounts have been provided for you, you do not need to go through these cleanup steps as this will be automatically taken care of for you.

---

## Why Cleanup is Important

**Cost Prevention:**
- Running resources incur ongoing charges
- Lambda, API Gateway, RDS, and other services charge per usage or per hour
- Unused resources can accumulate significant costs over time

**Account Hygiene:**
- Keep your AWS account organized and clutter-free
- Easier to identify and manage active resources
- Better security posture with fewer attack surfaces
- Simplifies compliance and auditing

---

## Cleanup Checklist

Follow these steps in order to cleanly remove all workshop resources:

### Step 1: Delete Cognito User Pool Domain

If you created a Cognito User Pool domain in Module 1 (Authentication), delete it first:

**Using AWS Console:**

1. Navigate to [Amazon Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select **User pools** from the left navigation
3. Click on your workshop user pool
4. Go to **App integration** tab
5. Under **Domain**, click **Actions** → **Delete domain**
6. Confirm deletion

**Using AWS CLI:**

```bash
aws cognito-idp delete-user-pool-domain \
  --domain your-domain-name \
  --user-pool-id your-user-pool-id \
  --region $REGION
```

**What This Does:**
- Removes the custom domain associated with Cognito
- Prevents domain-related charges
- Required before deleting the user pool itself

---

### Step 2: Delete API Gateway Usage Plan

If you created a Usage Plan in Module 9 (Usage Plans), delete it:

**Using AWS Console:**

1. Navigate to [API Gateway Console](https://console.aws.amazon.com/apigateway/)
2. Select **Usage Plans** from the left navigation
3. Select the usage plan you created (e.g., "Basic")
4. Click **Actions** → **Delete Usage Plan**
5. Confirm deletion

**Using AWS CLI:**

```bash
# List usage plans
aws apigateway get-usage-plans --region $REGION

# Delete usage plan
aws apigateway delete-usage-plan \
  --usage-plan-id your-usage-plan-id \
  --region $REGION
```

**What This Does:**
- Removes rate limiting and quota configurations
- Deletes associated API keys
- Cleans up usage plan metrics

---

### Step 3: Delete AWS Secrets Manager Secret

If you created a secret in Module 4 (Secrets), delete it:

**Using AWS Console:**

1. Navigate to [Secrets Manager Console](https://console.aws.amazon.com/secretsmanager/)
2. Select the secret you created (e.g., "db-credentials")
3. Click **Actions** → **Delete secret**
4. Choose **Disable automatic rotation** if enabled
5. Set recovery window (minimum 7 days, or immediate deletion)
6. Confirm deletion

**Using AWS CLI:**

```bash
# List secrets
aws secretsmanager list-secrets --region $REGION

# Delete secret (with recovery window)
aws secretsmanager delete-secret \
  --secret-id db-credentials \
  --recovery-window-in-days 7 \
  --region $REGION

# Or force immediate deletion (no recovery)
aws secretsmanager delete-secret \
  --secret-id db-credentials \
  --force-delete-without-recovery \
  --region $REGION
```

**What This Does:**
- Removes stored database credentials
- Stops rotation schedules
- Prevents secret storage charges

---

### Step 4: Delete AWS WAF

If you created a WAF ACL in Module 10 (WAF), delete it:

**Using AWS Console:**

1. Navigate to [AWS WAF Console](https://console.aws.amazon.com/wafv2/)
2. Select **Web ACLs** from the left navigation
3. Select your region
4. Select the ACL you created (e.g., "ProtectUnicorn")
5. Go to **Associated AWS resources** tab
6. **Disassociate** the ACL from API Gateway first
7. Click **Delete** and confirm

**Using AWS CLI:**

```bash
# List Web ACLs
aws wafv2 list-web-acls \
  --scope REGIONAL \
  --region $REGION

# Disassociate from API Gateway
aws wafv2 disassociate-web-acl \
  --resource-arn arn:aws:apigateway:region::/restapis/api-id/stages/stage-name \
  --region $REGION

# Delete Web ACL
aws wafv2 delete-web-acl \
  --name ProtectUnicorn \
  --scope REGIONAL \
  --id your-web-acl-id \
  --lock-token your-lock-token \
  --region $REGION
```

**What This Does:**
- Removes WAF protection rules
- Stops WAF request inspection charges
- Disassociates from API Gateway

---

### Step 5: Delete CustomizeUnicorns CloudFormation Stack

Delete the main application CloudFormation stack:

**Using AWS Console:**

1. Navigate to [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. Select the **CustomizeUnicorns** stack
3. Click **Delete**
4. Confirm deletion
5. Wait for deletion to complete (5-10 minutes)

**Using AWS CLI:**

```bash
# Delete the stack
aws cloudformation delete-stack \
  --stack-name CustomizeUnicorns \
  --region $REGION

# Wait for deletion to complete
aws cloudformation wait stack-delete-complete \
  --stack-name CustomizeUnicorns \
  --region $REGION
```

**What This Deletes:**
- Lambda functions
- API Gateway REST API
- IAM roles and policies
- DynamoDB tables (if any)
- CloudWatch log groups (partial)

---

### Step 6: Empty the Deployment S3 Bucket

Before deleting the infrastructure stack, empty the S3 bucket:

**Using AWS Console:**

1. Navigate to [S3 Console](https://console.aws.amazon.com/s3/)
2. Find your deployment bucket (e.g., "secure-serverless-deploymentbucket-*")
3. Select the bucket
4. Click **Empty**
5. Type "permanently delete" to confirm
6. Click **Empty**

**Using AWS CLI:**

```bash
# List buckets to find the deployment bucket
aws s3 ls

# Empty the bucket
aws s3 rm s3://your-deployment-bucket-name --recursive --region $REGION
```

**What This Does:**
- Removes all Lambda deployment packages
- Removes CloudFormation templates
- Prepares bucket for deletion

---

### Step 7: Delete Secure-Serverless CloudFormation Stack

Delete the infrastructure CloudFormation stack:

**Using AWS Console:**

1. Navigate to [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. Select the **Secure-Serverless** stack
3. Click **Delete**
4. Confirm deletion
5. Wait for deletion to complete (10-15 minutes)

**Using AWS CLI:**

```bash
# Delete the stack
aws cloudformation delete-stack \
  --stack-name Secure-Serverless \
  --region $REGION

# Wait for deletion
aws cloudformation wait stack-delete-complete \
  --stack-name Secure-Serverless \
  --region $REGION
```

**What This Deletes:**
- VPC and networking components
- RDS Aurora database cluster
- S3 deployment bucket
- Security groups
- Subnet configurations

---

### Step 8: Delete CloudWatch Log Groups

Delete remaining Lambda CloudWatch log groups:

**Using AWS Console:**

1. Navigate to [CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
2. Select **Log groups** from the left navigation
3. Filter for `/aws/lambda/` prefix
4. Select workshop-related log groups
5. Click **Actions** → **Delete log group(s)**
6. Confirm deletion

**Using AWS CLI:**

```bash
# List Lambda log groups
aws logs describe-log-groups \
  --log-group-name-prefix /aws/lambda/ \
  --region $REGION

# Delete specific log group
aws logs delete-log-group \
  --log-group-name /aws/lambda/CustomizeUnicorns-GetFunction \
  --region $REGION

# Delete all workshop log groups (use carefully)
for log_group in $(aws logs describe-log-groups \
  --log-group-name-prefix /aws/lambda/CustomizeUnicorns \
  --query 'logGroups[].logGroupName' \
  --output text \
  --region $REGION); do
  aws logs delete-log-group \
    --log-group-name $log_group \
    --region $REGION
  echo "Deleted $log_group"
done
```

**What This Does:**
- Removes Lambda execution logs
- Frees up CloudWatch log storage
- Stops log storage charges

---

### Step 9: Delete RDS Snapshot

Delete the Aurora database snapshot created during the workshop:

**Using AWS Console:**

1. Navigate to [RDS Console](https://console.aws.amazon.com/rds/)
2. Select **Snapshots** from the left navigation
3. Find workshop-related snapshots
4. Select the snapshot
5. Click **Actions** → **Delete snapshot**
6. Confirm deletion

**Using AWS CLI:**

```bash
# List DB cluster snapshots
aws rds describe-db-cluster-snapshots \
  --region $REGION

# Delete snapshot
aws rds delete-db-cluster-snapshot \
  --db-cluster-snapshot-identifier your-snapshot-id \
  --region $REGION
```

**What This Does:**
- Removes database backup snapshots
- Frees up RDS snapshot storage
- Stops snapshot storage charges

---

### Step 10: Delete Amazon Verified Permissions Resources

If you completed Module 3 (Verified Permissions), delete AVP resources:

**Delete Policy Store:**

**Using AWS Console:**

1. Navigate to [Amazon Verified Permissions Console](https://console.aws.amazon.com/verifiedpermissions/)
2. Select your policy store
3. Click **Delete**
4. Confirm deletion

**Using AWS CLI:**

```bash
# List policy stores
aws verifiedpermissions list-policy-stores --region $REGION

# Delete policy store
aws verifiedpermissions delete-policy-store \
  --policy-store-id your-policy-store-id \
  --region $REGION
```

**Delete Policy Template (if created):**

```bash
# List policy templates
aws verifiedpermissions list-policy-templates \
  --policy-store-id your-policy-store-id \
  --region $REGION

# Delete policy template
aws verifiedpermissions delete-policy-template \
  --policy-store-id your-policy-store-id \
  --policy-template-id your-template-id \
  --region $REGION
```

**What This Does:**
- Removes authorization policies
- Deletes policy templates
- Stops AVP service charges

---

## Verification Checklist

After completing cleanup steps, verify all resources are deleted:

**CloudFormation:**
- [ ] No CustomizeUnicorns stack
- [ ] No Secure-Serverless stack
- [ ] No VS-Code-Server stack

**Lambda:**
- [ ] No workshop Lambda functions
- [ ] No workshop-related log groups

**API Gateway:**
- [ ] No CustomizeUnicorns API
- [ ] No usage plans
- [ ] No API keys

**RDS:**
- [ ] No Aurora database clusters
- [ ] No database instances
- [ ] No snapshots

**Cognito:**
- [ ] No workshop user pools
- [ ] No custom domains

**Secrets Manager:**
- [ ] No db-credentials secret
- [ ] No workshop-related secrets

**WAF:**
- [ ] No ProtectUnicorn Web ACL
- [ ] No custom WAF rules

**S3:**
- [ ] No deployment buckets
- [ ] No workshop-related objects

**Amazon Verified Permissions:**
- [ ] No policy stores
- [ ] No policy templates

**CloudWatch:**
- [ ] No workshop log groups
- [ ] No custom dashboards

**EC2:**
- [ ] No bastion instances (if created)
- [ ] No workshop security groups (may be retained in VPC)

---

## Cost Estimation

Approximate costs for running the complete workshop (4-6 hours):

| Service | Estimated Cost |
|---------|---------------|
| Lambda (100K invocations) | $0.50 |
| API Gateway (10K requests) | $0.10 |
| RDS Aurora (6 hours) | $0.90 |
| Secrets Manager | $0.40 |
| Cognito (100 MAU) | Free Tier |
| WAF (1K requests) | $5.00 |
| X-Ray (100K traces) | $0.50 |
| CloudWatch Logs | $0.50 |
| S3 Storage | $0.10 |
| **Total Estimated** | **$8-12** |

> **Note**: Actual costs may vary based on usage patterns and region.

If your bill is significantly higher, you may have:
- Left RDS running overnight
- Generated excessive API traffic
- Missed cleanup of a costly service

---

## Automated Cleanup Script

For convenience, here's a complete cleanup script:

**Create cleanup.sh:**

```bash
#!/bin/bash

REGION=${REGION:-us-east-1}

echo "========================================="
echo "AWS Serverless Security Workshop Cleanup"
echo "========================================="
echo ""

# Step 1: Delete Cognito domain
echo "Step 1: Deleting Cognito user pool domain..."
DOMAIN_NAME=$(aws cognito-idp describe-user-pool --user-pool-id YOUR_POOL_ID --region $REGION --query 'UserPool.Domain' --output text 2>/dev/null)
if [ ! -z "$DOMAIN_NAME" ]; then
  aws cognito-idp delete-user-pool-domain \
    --domain $DOMAIN_NAME \
    --user-pool-id YOUR_POOL_ID \
    --region $REGION
  echo "✓ Deleted domain: $DOMAIN_NAME"
else
  echo "  No domain found"
fi

# Step 2: Delete API Gateway usage plan
echo "Step 2: Deleting API Gateway usage plans..."
USAGE_PLANS=$(aws apigateway get-usage-plans --region $REGION --query 'items[?name==`Basic`].id' --output text)
for plan in $USAGE_PLANS; do
  aws apigateway delete-usage-plan --usage-plan-id $plan --region $REGION
  echo "✓ Deleted usage plan: $plan"
done

# Step 3: Delete secrets
echo "Step 3: Deleting Secrets Manager secrets..."
SECRETS=$(aws secretsmanager list-secrets --region $REGION --query 'SecretList[?contains(Name, `db-credentials`)].ARN' --output text)
for secret in $SECRETS; do
  aws secretsmanager delete-secret \
    --secret-id $secret \
    --force-delete-without-recovery \
    --region $REGION
  echo "✓ Deleted secret: $secret"
done

# Step 4: Delete WAF
echo "Step 4: Deleting WAF Web ACL..."
WEB_ACLS=$(aws wafv2 list-web-acls --scope REGIONAL --region $REGION --query 'WebACLs[?Name==`ProtectUnicorn`].{Id:Id,Name:Name,LockToken:LockToken}' --output json)
echo $WEB_ACLS | jq -c '.[]' | while read acl; do
  ID=$(echo $acl | jq -r '.Id')
  NAME=$(echo $acl | jq -r '.Name')
  LOCK=$(echo $acl | jq -r '.LockToken')
  aws wafv2 delete-web-acl \
    --name $NAME \
    --scope REGIONAL \
    --id $ID \
    --lock-token $LOCK \
    --region $REGION
  echo "✓ Deleted Web ACL: $NAME"
done

# Step 5: Delete CustomizeUnicorns stack
echo "Step 5: Deleting CustomizeUnicorns CloudFormation stack..."
aws cloudformation delete-stack \
  --stack-name CustomizeUnicorns \
  --region $REGION
echo "  Waiting for stack deletion..."
aws cloudformation wait stack-delete-complete \
  --stack-name CustomizeUnicorns \
  --region $REGION
echo "✓ Deleted CustomizeUnicorns stack"

# Step 6: Empty S3 bucket
echo "Step 6: Emptying deployment S3 bucket..."
BUCKET=$(aws s3 ls | grep secure-serverless-deploymentbucket | awk '{print $3}')
if [ ! -z "$BUCKET" ]; then
  aws s3 rm s3://$BUCKET --recursive --region $REGION
  echo "✓ Emptied bucket: $BUCKET"
else
  echo "  No bucket found"
fi

# Step 7: Delete Secure-Serverless stack
echo "Step 7: Deleting Secure-Serverless CloudFormation stack..."
aws cloudformation delete-stack \
  --stack-name Secure-Serverless \
  --region $REGION
echo "  Waiting for stack deletion..."
aws cloudformation wait stack-delete-complete \
  --stack-name Secure-Serverless \
  --region $REGION
echo "✓ Deleted Secure-Serverless stack"

# Step 8: Delete CloudWatch log groups
echo "Step 8: Deleting CloudWatch log groups..."
LOG_GROUPS=$(aws logs describe-log-groups \
  --log-group-name-prefix /aws/lambda/CustomizeUnicorns \
  --region $REGION \
  --query 'logGroups[].logGroupName' \
  --output text)
for log_group in $LOG_GROUPS; do
  aws logs delete-log-group \
    --log-group-name $log_group \
    --region $REGION
  echo "✓ Deleted log group: $log_group"
done

# Step 9: Delete RDS snapshots
echo "Step 9: Deleting RDS snapshots..."
SNAPSHOTS=$(aws rds describe-db-cluster-snapshots \
  --region $REGION \
  --query 'DBClusterSnapshots[?contains(DBClusterSnapshotIdentifier, `unicorn`)].DBClusterSnapshotIdentifier' \
  --output text)
for snapshot in $SNAPSHOTS; do
  aws rds delete-db-cluster-snapshot \
    --db-cluster-snapshot-identifier $snapshot \
    --region $REGION
  echo "✓ Deleted snapshot: $snapshot"
done

# Step 10: Delete Verified Permissions
echo "Step 10: Deleting Amazon Verified Permissions resources..."
POLICY_STORES=$(aws verifiedpermissions list-policy-stores --region $REGION --query 'policyStores[].policyStoreId' --output text)
for store in $POLICY_STORES; do
  aws verifiedpermissions delete-policy-store \
    --policy-store-id $store \
    --region $REGION
  echo "✓ Deleted policy store: $store"
done

echo ""
echo "========================================="
echo "Cleanup complete!"
echo "========================================="
echo ""
echo "Please manually verify in AWS Console:"
echo "  - CloudFormation: No workshop stacks"
echo "  - RDS: No databases or snapshots"
echo "  - Lambda: No workshop functions"
echo "  - API Gateway: No CustomizeUnicorns API"
echo ""
```

**Run the script:**

```bash
chmod +x cleanup.sh
./cleanup.sh
```

---

## Troubleshooting Cleanup

**CloudFormation Stack Stuck in DELETE_FAILED:**
- Check stack events for error details
- Manually delete blocking resources (e.g., non-empty S3 bucket)
- Retry stack deletion

**Cannot Delete RDS Database:**
- Disable deletion protection first
- Delete read replicas before primary instance
- Use `--skip-final-snapshot` flag

**WAF Cannot Be Deleted:**
- First disassociate from all AWS resources
- Wait 5 minutes for disassociation to complete
- Retry deletion

**S3 Bucket Cannot Be Deleted:**
- Ensure bucket is completely empty (including versioned objects)
- Delete lifecycle policies
- Remove bucket policies

---

## What You Learned

During this workshop, you implemented comprehensive security across:

1. **Identity & Access Management**
   - Amazon Cognito authentication
   - Lambda authorizers
   - IAM least privilege
   - Amazon Verified Permissions

2. **Code Security**
   - Secrets Manager integration
   - Input validation
   - Dependency vulnerability scanning
   - Amazon Inspector code analysis

3. **Data Protection**
   - Encryption in transit with TLS/SSL
   - Secure database connections

4. **Infrastructure Security**
   - API Gateway usage plans and rate limiting
   - AWS WAF protection
   - GuardDuty threat detection

5. **Logging & Monitoring**
   - AWS X-Ray distributed tracing
   - CloudWatch monitoring
   - Security incident investigation

These skills will help you build secure serverless applications in production!

---

## Additional Resources

**AWS Documentation:**
- [AWS Well-Architected Framework - Security Pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html)
- [AWS Serverless Applications Lens](https://docs.aws.amazon.com/wellarchitected/latest/serverless-applications-lens/welcome.html)
- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)

**Security Standards:**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Serverless Top 10](https://owasp.org/www-project-serverless-top-10/)
- [CIS AWS Foundations Benchmark](https://www.cisecurity.org/benchmark/amazon_web_services)

**Continued Learning:**
- [AWS Builder Center - Security Training](https://builder.aws.com/)
- [AWS Workshop Studio](https://catalog.workshops.aws/)
- [AWS Security Hub](https://aws.amazon.com/security-hub/)

---

## Next Steps

**1. Review Your Learning:**
- Revisit modules to reinforce key concepts
- Document lessons learned for your organization
- Share knowledge with your team

**2. Apply to Production:**
- Implement security measures in your own serverless applications
- Establish secure development practices
- Create security baselines and standards

**3. Continue Learning:**
- Take additional AWS security certifications
- Practice with AWS Security workshops
- Stay updated on security best practices

**4. Set Up Billing Alerts:**

Prevent unexpected charges in the future:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name monthly-billing-alert \
  --alarm-description "Alert if monthly bill exceeds $100" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --region us-east-1
```

---

**Thank you for completing the AWS Serverless Security Workshop!**

For more workshops and training resources, visit:
- [AWS Workshop Studio](https://catalog.workshops.aws/)
- [AWS Builder Center](https://builder.aws.com/)
- [AWS Training and Certification](https://aws.amazon.com/training/)

---

**Previous:** [Module 12: X-Ray](./module-12-xray.md)

## Why Cleanup is Important

### Cost Prevention
- Lambda functions incur charges per invocation
- API Gateway incurs charges per request
- RDS instances incur charges per hour
- Unused resources accumulate charges

### Account Hygiene
- Keep your AWS account organized
- Remove clutter from console
- Easier to manage remaining resources
- Better security posture

### Environmental Impact
- Reduce unnecessary AWS resource usage
- Minimize carbon footprint
- Practice sustainable cloud usage

## Cleanup Checklist

### Step 1: Delete CloudFormation Stack
The easiest way to remove most resources:

```bash
aws cloudformation delete-stack \
  --stack-name CustomizeUnicorns \
  --region $REGION
```

**Wait for completion** (can take 5-10 minutes):
```bash
aws cloudformation wait stack-delete-complete \
  --stack-name CustomizeUnicorns \
  --region $REGION
```

This deletes:
- ✓ Lambda functions
- ✓ API Gateway
- ✓ IAM roles and policies
- ✓ CloudWatch log groups (if configured)
- ✓ VPC (if created as part of stack)

### Step 2: Delete RDS Database
Delete the RDS Aurora database:

```bash
# List database instances
aws rds describe-db-clusters --region $REGION

# Delete database cluster (skip backup)
aws rds delete-db-cluster \
  --db-cluster-identifier unicorn-customization \
  --skip-final-snapshot \
  --region $REGION
```

**Important:** The `--skip-final-snapshot` flag deletes without creating backup. Omit if you want to keep a backup.

### Step 3: Delete AWS Secrets Manager Secrets
If you completed Module 4 (Secrets):

```bash
# List secrets
aws secretsmanager list-secrets --region $REGION

# Delete secret
aws secretsmanager delete-secret \
  --secret-id db-credentials \
  --force-delete-without-recovery \
  --region $REGION
```

### Step 4: Delete Cognito User Pool
If you completed Module 1 (Authentication):

```bash
# List user pools
aws cognito-idp list-user-pools --max-results 10 --region $REGION

# Delete user pool
aws cognito-idp delete-user-pool \
  --user-pool-id <pool-id> \
  --region $REGION
```

### Step 5: Delete WAF ACL
If you completed Module 10 (WAF):

```bash
# List WAF ACLs
aws wafv2 list-web-acls \
  --scope REGIONAL \
  --region $REGION

# Delete WAF ACL (must remove associations first)
aws wafv2 delete-web-acl \
  --name <web-acl-name> \
  --scope REGIONAL \
  --id <web-acl-id> \
  --region $REGION
```

### Step 6: Delete GuardDuty (Optional)
If you enabled GuardDuty and want to disable it:

```bash
# Disable GuardDuty
aws guardduty delete-detector \
  --detector-id <detector-id> \
  --region $REGION
```

**Note:** You might want to keep GuardDuty enabled for security monitoring.

### Step 7: Delete S3 Deployment Bucket
If you created an S3 bucket for CloudFormation deployment:

```bash
# List buckets
aws s3 ls

# Remove all objects in bucket
aws s3 rm s3://$DeploymentS3Bucket --recursive

# Delete bucket
aws s3 rb s3://$DeploymentS3Bucket
```

### Step 8: Delete CloudWatch Log Groups
Delete remaining log groups:

```bash
# List log groups
aws logs describe-log-groups --region $REGION

# Delete specific log group
aws logs delete-log-group \
  --log-group-name /aws/lambda/CustomizeUnicornFunction \
  --region $REGION
```

### Step 9: Delete VS Code Server (If Applicable)
If using a cloud-based VS Code Server:
- Follow event-specific instructions for shutdown
- Contact event organizers if unsure

## Automated Cleanup Script

Create a cleanup script (`cleanup.sh`):

```bash
#!/bin/bash

STACK_NAME="CustomizeUnicorns"
REGION=${REGION:-us-east-1}

echo "Starting resource cleanup..."

# Delete CloudFormation stack
echo "Deleting CloudFormation stack..."
aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME --region $REGION

# Delete RDS database
echo "Deleting RDS database..."
aws rds delete-db-cluster \
  --db-cluster-identifier unicorn-customization \
  --skip-final-snapshot \
  --region $REGION

# Delete secrets
echo "Deleting secrets..."
SECRETS=$(aws secretsmanager list-secrets --region $REGION --query 'SecretList[?starts_with(Name, `db-`)].ARN' --output text)
for secret in $SECRETS; do
  aws secretsmanager delete-secret \
    --secret-id $secret \
    --force-delete-without-recovery \
    --region $REGION
done

echo "Cleanup complete!"
echo "Please manually verify all resources are deleted in the AWS Console."
```

Run the script:
```bash
chmod +x cleanup.sh
./cleanup.sh
```

## Manual Verification Checklist

After running cleanup scripts, manually verify in AWS Console:

**Lambda**
- [ ] No CustomizeUnicorn functions remaining
- [ ] No custom Lambda functions remain

**API Gateway**
- [ ] No "CustomizeUnicorns" API remaining
- [ ] All custom APIs deleted

**RDS**
- [ ] No database clusters remaining
- [ ] No database instances running

**Secrets Manager**
- [ ] No db-credentials secret
- [ ] No other workshop secrets

**Cognito**
- [ ] No user pools created for workshop
- [ ] No custom domains remaining

**WAF**
- [ ] No Web ACLs associated with API Gateway
- [ ] No custom rules remaining

**CloudWatch**
- [ ] No /aws/lambda/* log groups for workshop
- [ ] No custom dashboards created for workshop

**S3**
- [ ] No deployment buckets remaining
- [ ] No workshop-related objects in any bucket

**IAM**
- [ ] No workshop-specific roles remaining
- [ ] No workshop-specific policies remaining
- [ ] All session tokens invalidated


## Billing Alerts

For future AWS usage, consider setting up billing alerts:

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name monthly-billing \
  --alarm-description "Alert if monthly bill exceeds $100" \
  --metric-name EstimatedCharges \
  --namespace AWS/Billing \
  --statistic Maximum \
  --period 86400 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

## Support and Questions

If you have questions about cleanup:
- Check [AWS Documentation](https://docs.aws.amazon.com/)
- Review CloudFormation stack events for errors
- Check CloudTrail for API call details
- Contact AWS Support for account-related issues

## Additional Resources

- [AWS Well-Architected Security Pillar](https://d1.awsstatic.com/whitepapers/architecture/AWS-Serverless-Applications-Lens.pdf)
- [AWS Security Best Practices](https://aws.amazon.com/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Builder Center - Security Training](https://builder.aws.com/)