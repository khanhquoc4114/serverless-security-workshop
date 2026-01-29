# Module 8: Encryption in Transit

## Overview
Although traffic within your VPC is private, some regulations or compliance requirements mandate encryption of data in transit.

## Module 8A: Enable SSL in-Transit for DB Connections

1. Open a terminal and navigate to the app directory

  ```bash
  cd /Workshop/src/app
  ```

2. Download the RDS CA certificate bundle

  ```bash
  wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
  ```

   ![](../img/module-8-encryption/2026-01-28-06-21-02.png)

3. Verify the certificate file was downloaded

  ```bash
  ls -la global-bundle.pem
  ```
   ![](../img/module-8-encryption/2026-01-28-06-22-18.png)

4. Open `dbUtils.js` file in your text editor

5. Locate the import statements at the top of the file

6. Add the following import after the mysql import:

  ```javascript
  import fs from 'fs';
  ```

  ![](../img/module-8-encryption/2026-01-28-09-43-26.png)

7. Locate the `getDbConfig()` method in the file

8. Within the connection configuration object, add the SSL property:

  ```javascript
  ssl: {
    ca: fs.readFileSync('global-bundle.pem')
  },
  ```

  ![](../img/module-8-encryption/2026-01-28-09-55-39.png)

9. Save the file

10. Navigate to the src directory

  ```bash
  cd /Workshop/src
  ```

11. Package and deploy the CloudFormation template and wait for the deployment to complete

  ```bash
  aws cloudformation package --output-template-file packaged.yaml --template-file template.yaml --s3-bucket $DeploymentS3Bucket --s3-prefix securityworkshop --region $REGION && aws cloudformation deploy --template-file packaged.yaml --stack-name CustomizeUnicorns --region $REGION --capabilities CAPABILITY_IAM --parameter-overrides InitResourceStack=Secure-Serverless
  ```

  ![](../img/module-8-encryption/2026-01-28-10-05-24.png)

12. Verify the stack update was successful

   ![](../img/module-8-encryption/2026-01-28-10-06-42.png)

13. Test database connectivity by invoking an API endpoint to confirm SSL connection works

  ![](../img/module-8-encryption/2026-01-28-10-11-03.png)

## Module 8B: Optional - Require SSL for Database Users

1. Get password

  ```bash
  SECRET_NAME=$(aws cloudformation describe-stacks --stack-name $stack_name --query 'Stacks[].Outputs[?OutputKey==`SecretArn`].OutputValue' --output text --region us-east-1 | awk -F: '{print $NF}')

  aws secretsmanager get-secret-value --secret-id $SECRET_NAME --query SecretString --output text --region us-east-1
  ```

2. Open a terminal to connect to the MySQL database

  ```bash
  mysql -h 127.0.0.1 -P 3307 -u admin -p<Password>
  ```

  ![](../img/module-8-encryption/2026-01-29-19-42-54.png)

  > **Note:** If you have gone through Module 4 and your DB password may have been rotated by Secrets Manager, you can retrieve the new password by going to Secrets Manager and clicking the **Retrieve secret value** button.

3. Check your Aurora MySQL version in the RDS console

   ![](../img/module-8-encryption/2026-01-28-10-22-30.png)

4. Create 'encrypted_user' for next step

  ```sql
  CREATE USER 'encrypted_user'@'%' IDENTIFIED BY '>b&>d#3C~fLs)DpIR)rOy3$5?lEqlq9b';
  ```

5. For MySQL version 8.0, require SSL connections with:

  ```sql
  ALTER USER 'encrypted_user'@'%' REQUIRE SSL;
  ```

6. For MySQL 5.6 and earlier, use instead:

  ```sql
  GRANT USAGE ON *.* TO 'encrypted_user'@'%' REQUIRE SSL;
  ```

   ![](../img/module-8-encryption/2026-01-28-10-39-42.png)

7. Verify the user has SSL requirement enabled

  ```sql
  SHOW CREATE USER 'encrypted_user'@'%';
  ```

8. Exit the MySQL connection

  ```sql
  EXIT;
  ```

## Module 8C: Encryption at Rest

1. Note that data in the RDS Aurora MySQL database is **not encrypted at rest** in this workshop

2. Understand that encryption can only be enabled when creating a new RDS instance, not on existing instances

3. To add encryption to an existing unencrypted database, you must:

  - Create a snapshot of the existing DB instance
  - Create an encrypted copy of that snapshot
  - Restore a new DB instance from the encrypted snapshot

  ![](../img/module-8-encryption/2026-01-28-05-35-45.png)

4. For new deployments, enable encryption at creation time:

  - Select "Enable encryption" during database creation
  - Choose AWS managed key or customer managed CMK
  - Test encryption before production deployment

  ![](../img/module-8-encryption/2026-01-28-05-36-00.png)

5. Reference the AWS Prescriptive Guidance for detailed encryption migration steps

  ![](../img/module-8-encryption/2026-01-28-05-36-15.png)

---
