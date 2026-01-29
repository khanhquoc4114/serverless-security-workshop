# Module 1: Add Authentication and Authorization

## Overview

The serverless app deployed in Module 0 is now open to anyone in the world to access. Attackers can submit any number of unicorn customizations and we have no way of knowing who really made the request.

To lock down access to the API to only trusted partners, we must add authentication and authorization to the API.

In this module, we will use **OAuth Client Credentials flow** with **Amazon Cognito** as the authorization server, and leverage **Lambda Authorizer** for API Gateway to inspect tokens and determine access policies based on token claims.

## Architecture
By the end of this module, your architecture will look like this:

![](../img/module-1-authentication-authorization/2026-01-27-20-17-39.png)

---

## Module 1A: Cognito User Pool Setup

1. Review the Cognito User Pool in the Resources section of `src/template.yaml`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-20-19.png)

2. Go to the [AWS Cognito Console](https://console.aws.amazon.com/cognito/home)

   ![](../img/module-1-authentication-authorization/2026-01-27-20-22-05.png)

3. Click on the user pool created by the SAM Template named `CustomizeUnicorns-users`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-22-41.png)

4. Under **Branding** left navigation menu, click on **Domain** to set up a unique Cognito domain. Click **Actions**, then select **Create Cognito domain**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-23-28.png)

5. Enter a unique domain name (e.g., `custom-unicorn-domain`) and click **Create Cognito domain**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-29-27.png)

6. Note down the full domain name in the format `https://<your-custom-name>.auth.<aws-region>.amazoncognito.com`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-31-38.png)

---

## Module 1B: Authorization Scopes

1. Go to **Branding > Domain** on the left navigation menu

2. Click **Resource servers** section and select **Create Resource Server**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-34-50.png)

3. Enter the following details:
   - **Resource Server Name**: `WildRydes`
   - **Resource Server Identifier**: `WildRydes`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-36-20.png)

4. In the **Scopes** section, add two scopes:
   - **Scope name**: `CustomizeUnicorn` (for 3rd party partners to customize unicorns)
   - **Scope name**: `ManagePartners` (for internal apps/admin to register partner companies)

   ![](../img/module-1-authentication-authorization/2026-01-27-20-36-36.png)

5. Click **Create resource server**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-36-57.png)

---

## Module 1C: Admin Account

1. In the Cognito console, go to **Applications > App clients**. Click **Create app client**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-39-45.png)

2. Select **Machine-to-machine application** as the Application Type. Enter `Admin` for the app client name and click **Create app client**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-40-50.png)

3. On the **Admin** client detail page, click on the **Login pages** tab. Click **Edit**

   ![](../img/module-1-authentication-authorization/2026-01-27-20-42-07.png)

4. Under **Managed login pages**, click **add callback url** and enter `https://aws.amazon.com`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-44-28.png)

5. Verify **Client Credentials** OAuth 2.0 grant type is selected

   ![](../img/module-1-authentication-authorization/2026-01-27-20-45-03.png)

6. Under **Custom scopes**, select `WildRydes/ManagePartners`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-45-17.png)

7.  Scroll down and click **Save Changes**

    ![](../img/module-1-authentication-authorization/2026-01-27-20-46-05.png)

8.  Under the **App client information** section, click the radio button **Show client secret**

    ![](../img/module-1-authentication-authorization/2026-01-27-20-46-59.png)

9.  Copy the **Client ID** and **Client secret** for later use

    ![](../img/module-1/1c-copy-credentials.png)

---

## Module 1D: Lambda Authorizer

1. Review the Lambda authorizer workflow diagram

   ![](../img/module-1-authentication-authorization/2026-01-27-20-50-37.png)

2. Review the DynamoDB table for ClientID to Company ID mapping in `src/template.yaml`

   ![](../img/module-1-authentication-authorization/2026-01-27-20-52-27.png)

3. Review the Lambda authorizer code in `src/authorizer/index.js`

4. Install Node.js dependencies in the `src/authorizer` folder:

   ```bash
   cd /Workshop/src/authorizer
   npm install
   ```

   ![](../img/module-1-authentication-authorization/2026-01-27-20-54-31.png)

5. Add the Custom Authorizer Function to the Resources section of `src/template.yaml`

   ```yaml
   CustomAuthorizerFunction:
    Type: AWS::Serverless::Function
    Properties:
     CodeUri: authorizer/
     Runtime: nodejs22.x
     Handler: index.handler
     Policies:
      - Statement:
        - Effect: Allow
          Action:
            - "dynamodb:*"
          Resource: "*"
     Environment:
      Variables:
       USER_POOL_ID: !Ref CognitoUserPool
       PARTNER_DDB_TABLE: !Ref PartnerDDBTable
   ```

   ![](../img/module-1-authentication-authorization/2026-01-27-20-57-35.png)

6. Add the API Gateway Authorizer IAM Role to `src/template.yaml`

   ```yaml
   ApiGatewayAuthorizerRole:
    Type: AWS::IAM::Role
    Properties:
     AssumeRolePolicyDocument:
      Version: "2012-10-17"
      Statement:
       - Effect: "Allow"
         Principal:
          Service:
           - "apigateway.amazonaws.com"
         Action:
          - sts:AssumeRole
     Policies:
      - PolicyName: "InvokeAuthorizerFunction"
        PolicyDocument:
         Version: "2012-10-17"
         Statement:
          - Effect: "Allow"
            Action:
             - lambda:InvokeAsync
             - lambda:InvokeFunction
            Resource: !Sub ${CustomAuthorizerFunction.Arn}
   ```

   ![](../img/module-1-authentication-authorization/2026-01-27-20-58-46.png)

7. Find the Swagger definition in `src/template.yaml` and locate the `### TODO: add authorizer` section

8. Replace the `### TODO: add authorizer` section with the security definitions:

   ```yaml
   securityDefinitions:
    CustomAuthorizer:
     type: apiKey
     name: Authorization
     in: header
     x-amazon-apigateway-authtype: custom
     x-amazon-apigateway-authorizer:
      type: token
      authorizerUri:
       Fn::Sub: arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${CustomAuthorizerFunction.Arn}/invocations
      authorizerCredentials:
       Fn::Sub: ${ApiGatewayAuthorizerRole.Arn}
      authorizerResultTtlInSeconds: 60
   ```

   ![](../img/module-1-authentication-authorization/2026-01-27-21-01-58.png)

9. Uncomment the security lines in each API method in the `paths` section. Change the comment lines to active code:

   ```yaml
   security:
    - CustomAuthorizer: []
   ```

   ![](../img/module-1-authentication-authorization/2026-01-27-21-03-20.png)

10. Save the `src/template.yaml` file

    ![](../img/module-1/1d-save-template.png)

11. Navigate back to the `src` folder and validate the template:

    ```bash
    cd ..
    sam validate -t template.yaml --region $REGION
    ```

    ![](../img/module-1-authentication-authorization/2026-01-27-21-09-54.png)

12. Deploy the updates using CloudFormation:

    ```bash
    aws cloudformation package --output-template-file packaged.yaml --template-file template.yaml --s3-bucket $DeploymentS3Bucket --s3-prefix securityworkshop --region $REGION && aws cloudformation deploy --template-file packaged.yaml --stack-name CustomizeUnicorns --region $REGION --capabilities CAPABILITY_IAM
    ```

    ![](../img/module-1-authentication-authorization/2026-01-27-21-24-09.png)

13. After deployment completes, go to the [AWS API Gateway Console](https://console.aws.amazon.com/apigateway/home). Click into the `CustomizeUnicorns` API and verify the Authorization is set to `CustomAuthorizer` in Method Request

   ![](../img/module-1-authentication-authorization/2026-01-29-19-40-35.png)

14. Test the API using the VS Code Server API Client. You should now receive **401 Unauthorized** errors

   ![](../img/module-1-authentication-authorization/2026-01-27-21-54-05.png)

---

## Module 1E: Partner Companies

1. Open the API Client preview (Show Preview on `src/apiclient/index.html`)

   ![](../img/module-1/1e-open-apiclient.png)

2. Expand "Module 1E: Partner Companies" in the client

   ![](../img/module-1-authentication-authorization/2026-01-27-22-01-48.png)

3. Ensure the base URL is your API Gateway endpoint. Fill Access Token URL (`<cognito-domain>/oauth2/token`), paste Admin `Client ID` and `Client Secret`

   ![](../img/module-1-authentication-authorization/2026-01-27-22-07-56.png)

5. Click "Get Access Token" and verify token is returned

   ![](../img/module-1-authentication-authorization/2026-01-27-22-09-40.png)

6. In "Register Partner", keep URL path `/partners`, set body, then Send

   ```json
   { "name": "Cherry Company" }
   ```

7. Copy the returned `ClientId` and `ClientSecret` for the new partner

   ![](../img/module-1-authentication-authorization/2026-01-27-22-48-41.png)

---

## Module 1F: Customize Unicorns

1. Expand "Module 1F: Customize Unicorns" in the API Client

2. Copy the partner company's `Client ID` and `Client Secret` from Module 1E into the textboxes


3. Click "Get Access Token" to request a token for the partner company

   ![](../img/module-1-authentication-authorization/2026-01-27-22-56-56.png)

4. Verify the new Access Token is returned in the Response section

   ![](../img/module-1-authentication-authorization/2026-01-27-22-57-41.png)

5. Scroll down to the "Create Customization" POST request (path `/customizations`)

6. Enter the following JSON in the Body JSON textbox:

   ```json
   {
     "name": "Cherry-themed unicorn",
     "imageUrl": "https://en.wikipedia.org/wiki/Cherry#/media/File:Cherry_Stella444.jpg",
     "sock": "1",
     "horn": "2",
     "glasses": "3",
     "cape": "4"
   }
   ```

7. Click the "Send" button to create the customization

8. Verify the response contains the `customUnicornId`

   ![](../img/module-1-authentication-authorization/2026-01-27-23-20-41.png)

---



