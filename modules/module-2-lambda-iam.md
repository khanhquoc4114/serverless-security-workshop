# Module 2: Lambda IAM

## Overview
Lambda functions are an important part of serverless architecture. You can use AWS Identity and Access Management (IAM) to manage access to Lambda and resources such as functions and layers.

Every Lambda function has an IAM role called an **execution role**. In this role, you can attach a policy that defines the permissions your function needs to access other AWS services and resources.

## Module Sections

### Module 2A: Scoped Down Permission using IAM Access Analyzer

1. Open the Lambda Analytics function code in `src/app/customUnicornAnalytics.js`

  ![](../img/module-2-lambda-iam/2026-01-28-02-14-45.png)

2. Open the [AWS Lambda Console](https://console.aws.amazon.com/lambda/home) and search for `CustomUnicornAnalyticsFunction`

  ![](../img/module-2-lambda-iam/2026-01-28-02-16-48.png)

3. Click on the function to open its detail page

  ![](../img/module-2-lambda-iam/2026-01-28-02-19-18.png)

4. Go to **Configuration > Permissions** tab. Click on the **Execution role name** to open the IAM role

5. Review the attached permissions (note: currently has AdministratorAccess)

  ![](../img/module-2-lambda-iam/2026-01-28-02-20-32.png)

6. Scroll down to "Generate policy based on CloudTrail events" and click **Generate Policy**

7. On the Generate policy screen:
   - **Time period**: Select "Last 1 day"
   - **Region**: Select "US East (N. Virginia)"
   - **CloudTrail Trail**: Select "Serverless-Security-Workshop-Trail"
   - **Service role**: Select "Create and use a new service role"

  ![](../img/module-2-lambda-iam/2026-01-28-02-22-28.png)

8. Click **Generate Policy** and wait for completion

9. Wait for the status to show **Success** (may take a few minutes)

  ![](../img/module-2-lambda-iam/2026-01-28-02-30-17.png)

10. Click **View generated policy**

11. Review the generated policy showing DynamoDB and Secrets Manager actions

12. Select the appropriate actions:
    - **DynamoDB**: Select `PutItem`
    - **Secrets Manager**: Select `GetSecretValue` (if Module 4 was completed)

  ![](../img/module-2-lambda-iam/2026-01-28-03-59-02.png)

13. Click **Next** to proceed to customization

    ![](../img/module-2/2a-next-actions.png)

14. On the Customize Permissions page, remove unnecessary policy statements (keep only DynamoDB and Secrets Manager)

    ![](../img/module-2/2a-customize-permissions.png)

15. Set the Resource ARN for DynamoDB table and Secrets Manager secret

  ![](../img/module-2-lambda-iam/2026-01-28-04-01-52.png)
  ![](../img/module-2-lambda-iam/2026-01-28-04-03-52.png)
  ![](../img/module-2-lambda-iam/2026-01-28-04-05-06.png)

16. Click **Next** to continue

17. Enter policy name: `CustomUnicornAnalyticsScopedDownPolicy`

  ![](../img/module-2-lambda-iam/2026-01-28-04-06-15.png)

18. Click **Create and attach policy**

  ![](../img/module-2-lambda-iam/2026-01-28-04-06-43.png)

19. Back on the IAM role page, remove the **AdministratorAccess** policy by clicking **Remove**

  ![](../img/module-2-lambda-iam/2026-01-28-04-07-45.png)

20. Verify in the Lambda console that the execution role is updated

  ![](../img/module-2-lambda-iam/2026-01-28-04-09-10.png)

21. Navigate to the [DynamoDB Console](https://console.aws.amazon.com/dynamodb/home) and verify new records are being inserted into `CustomizeUnicorns-CustomizationDemandAnalytics` table

  ![](../img/module-2-lambda-iam/2026-01-28-04-10-09.png)

  ![](../img/module-2-lambda-iam/2026-01-28-04-11-46.png)

---

### Module 2B: Attribute Based Access Control (ABAC)

#### Part 1: Explore the Infrastructure

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/home)

2. Click on **Users** under Access Management in the left navigation

3. Search for and open **serverless-dev-user**

  ![](../img/module-2-lambda-iam/2026-01-28-04-21-33.png)

4. Review the attached policy allowing `sts:AssumeRole` and `sts:TagSession`

  ![](../img/module-2-lambda-iam/2026-01-28-04-22-20.png)

5. Click on **Roles** in the left navigation. Search for **ServerlessABACDemoRole** and open it

  ![](../img/module-2-lambda-iam/2026-01-28-04-23-19.png)

6. Review the attached managed policies:
   - **ServerlessABACDemoPolicyLambdaInvoke** (GetFunction, InvokeFunction)
   - **ServerlessABACDemoPolicyListLambdaIAM** (List and Get permissions)

  ![](../img/module-2-lambda-iam/2026-01-28-04-24-12.png)

7. Copy the "Link to switch roles in console" URL from the top right (for later use)

   ![](../img/module-2/2b-copy-switch-role-url.png)

#### Part 2: Log In as Developer User and Test Function Invoke

9. Open a new **Incognito/Private window** and navigate to your AWS account login page

   ```
   https://ACCOUNT_ID.signin.aws.amazon.com/console/
   ```

10. Log in with developer credentials:
    - **IAM user name**: `serverless-dev-user`
    - **Password**: `pA$$woRd1`

  ![](../img/module-2-lambda-iam/2026-01-28-04-31-23.png)

11. After login, paste the Switch Role URL copied earlier

12. Verify you've switched to **ServerlessABACDemoRole**

  ![](../img/module-2-lambda-iam/2026-01-28-04-33-40.png)

13. Open the [Lambda Console](https://console.aws.amazon.com/lambda/home) and search for **CustomUnicornAnalyticsFunction**

  ![](../img/module-2-lambda-iam/2026-01-28-04-49-25.png)

14. Click on the function to open it
15. Go to **Configuration > Tags** tab

16. Verify the function is tagged with `application: customizeUnicorn`

  ![](../img/module-2-lambda-iam/2026-01-28-04-49-54.png)

17. Click on the **Test** tab and click **Test** button to invoke the function

18. Verify the function executes successfully

  ![](../img/module-2-lambda-iam/2026-01-28-04-50-17.png)

#### Part 3: Modify Permission to Enforce Tag-Based Access

19. Go back to your original browser window (logged in as IAM Admin)

20. Open **ServerlessABACDemoRole** and go to Permissions policies

21. Expand **ServerlessABACDemoPolicyLambdaInvoke** and click **Edit**

  ![](../img/module-2-lambda-iam/2026-01-28-04-52-59.png)

22. Add the following condition to the policy:

    ```json
    "Condition": {
      "StringEquals": {
        "aws:ResourceTag/application": "${aws:PrincipalTag/application}"
      }
    }
    ```

  ![](../img/module-2-lambda-iam/2026-01-28-04-54-11.png)

23. Click **Next** to review changes

  ![](../img/module-2-lambda-iam/2026-01-28-04-54-38.png)

24.  Click **Save Changes**

#### Part 4: Verify Developer User Cannot Invoke Function

25. Go back to the developer user's browser window

26. In the Lambda Console, click **Test** button again to try invoking the function

27. Verify the execution fails with an access denied error

  ![](../img/module-2-lambda-iam/2026-01-28-05-07-44.png)

#### Part 5: Tag Developer Role with Matching Tag

28. Go back to the IAM Admin browser window

29. Open **ServerlessABACDemoRole** and click on the **Tags** tab

30. Click **Add new tag**

  ![](../img/module-2-lambda-iam/2026-01-28-05-08-46.png)

31. Add tag:
    - **Key**: `application`
    - **Value**: `customizeUnicorn`

  ![](../img/module-2-lambda-iam/2026-01-28-05-09-30.png)

32.  Click **Save changes**

#### Part 6: Verify Developer Can Now Invoke Function

33. Go back to the developer user's browser window

34. In the Lambda Console, click **Test** button to invoke the function

35. Verify the function now executes successfully

  ![](../img/module-2-lambda-iam/2026-01-28-05-10-35.png)

---

### Module 2C: Permission Boundary

#### Part 1: Modify Developer Role to Allow IAM Role Creation

1. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/home)

2. Click on **Policies** under Access Management in the left navigation

3. Search for and open **ServerlessPermissionBoundaryDemoIAMActionsPolicy**

  ![](../img/module-2-lambda-iam/2026-01-28-05-37-49.png)

4. Review the policy allowing CreateRole, DeleteRole, and other IAM actions

5. Note that the resource (IAM Role) name is enforced to start with `Serverless-`

  ![](../img/module-2-lambda-iam/2026-01-29-19-41-52.png)

6. Click on **Roles** in the left navigation

7. Search for and open **ServerlessABACDemoRole**

  ![](../img/module-2-lambda-iam/2026-01-28-05-39-37.png)

8. Click **Add permissions** > **Attach policies**

9. Search for **ServerlessPermissionBoundaryDemoIAMActionsPolicy**

10. Check the policy and click **Add permission**

  ![](../img/module-2-lambda-iam/2026-01-28-05-40-25.png)

1.  Leave this browser window open as you will return to modify permissions later

#### Part 2: Test Developer User Can Create IAM Roles

12. Open your developer user browser (ServerlessABACDemoRole session)

13. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/home)

14. Click **Roles** under Access management in the left navigation

15. Click **Create role** button

  ![](../img/module-2-lambda-iam/2026-01-28-05-42-07.png)

16. On Select trusted entity page, select **Trusted entity type** as **AWS Service**

17. Select **Use case** as **Lambda**

18. Click **Next** button

  ![](../img/module-2-lambda-iam/2026-01-28-05-43-02.png)

19. On Attach permissions page, search for **AWSLambdaExecute**

20. Select **AWSLambdaExecute** policy and click **Next**

  ![](../img/module-2-lambda-iam/2026-01-28-05-44-02.png)

21. On Name, review, and create page, enter role name: `Serverless-CustomAnalyticsExecutionRole`

22. Click **Create role**

  ![](../img/module-2-lambda-iam/2026-01-28-05-47-19.png)
  ![](../img/module-2-lambda-iam/2026-01-28-05-47-31.png)

23. Verify the role was created successfully

24. Open the [AWS Lambda Console](https://console.aws.amazon.com/lambda/home)

25. Click **Create function** button

  ![](../img/module-2-lambda-iam/2026-01-28-05-49-23.png)

26. Enter function name: `ServerlessUnicornCustomFunction`

27. Select **Runtime** as your preferred Node.js version

28. Under Execution role, select **Use an existing role**

29. Select the role you just created: `Serverless-CustomAnalyticsExecutionRole`

30. Click **Create function**

  ![](../img/module-2-lambda-iam/2026-01-28-05-51-31.png)
  ![](../img/module-2-lambda-iam/2026-01-28-05-52-10.png)

31. Verify the function was created successfully
  ![](../img/module-2-lambda-iam/2026-01-28-05-53-14.png)
32. Leave this browser window open for later testing

#### Part 3: Review and Apply Permission Boundary Policy

33. Go back to the IAM Admin browser window (WSParticipantRole session)

34. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/home)

35. Click on **Policies** in the left navigation

36. Search for **ServerlessPermissionBoundaryDemoBoundaryPolicy**

37. Click to open the policy and review it

  ![](../img/module-2-lambda-iam/2026-01-28-05-54-13.png)

38. Note this policy allows limited operations on DynamoDB, S3, and CloudWatch Logs

39. Copy the ARN of this policy (shown at the top right) to your notes

40. Click on **Policies** again in the left navigation

41. Search for **ServerlessPermissionBoundaryDemoIAMActionsPolicy**

42. Click to open and click **Edit policy** button

  ![](../img/module-2-lambda-iam/2026-01-28-05-58-54.png)

43. Add the following boundary condition to the policy:

    ```json
    "Condition": {
      "ArnEquals": {
        "iam:PermissionsBoundary": "arn:aws:iam::YOUR_ACCOUNT_ID:policy/ServerlessPermissionBoundaryDemoBoundaryPolicy"
      }
    }
    ```
  ![](../img/module-2-lambda-iam/2026-01-28-06-00-35.png)

44.  Click **Next** to review changes

45.  Click **Save changes**
    ![](../img/module-2-lambda-iam/2026-01-28-06-01-27.png)

#### Part 4: Verify Developer Must Specify Permission Boundary

46. Go back to the developer user browser (ServerlessABACDemoRole session)

47. Open the [AWS IAM Console](https://console.aws.amazon.com/iam/home)

48. Click **Roles** under Access management in the left navigation

49. Click **Create role** button
  ![](../img/module-2-lambda-iam/2026-01-28-06-02-12.png)
50. On Select trusted entity page, select **Trusted entity type** as **AWS Service**

51. Select **Use case** as **Lambda**

52. Click **Next** button
  ![](../img/module-2-lambda-iam/2026-01-28-06-02-58.png)
53. On Attach permissions page, search for **AdministratorAccess**

54. Select **AdministratorAccess** policy and click **Next**

  ![](../img/module-2-lambda-iam/2026-01-28-06-03-33.png)
  ![](../img/module-2-lambda-iam/2026-01-28-06-05-04.png)

55. On Name, review, and create page, enter role name: `Serverless-CustomizeUnicornDemandRole`

56. Click on **Set permissions boundary** section

57. Check **Use a permissions boundary to control the maximum role permissions**

58. Search for and select **ServerlessPermissionBoundaryDemoBoundaryPolicy**

  ![](../img/module-2-lambda-iam/2026-01-28-06-06-27.png)
  ![](../img/module-2-lambda-iam/2026-01-28-06-06-40.png)

60.  Click **Create role**
  ![](../img/module-2-lambda-iam/2026-01-28-05-24-15.png)

61. Verify the role was created successfully with the permission boundary

#### Part 5: Create Lambda Function with Boundary-Constrained Role

62. Open the [AWS Lambda Console](https://console.aws.amazon.com/lambda/home)

63. Click **Create function** button
  ![](../img/module-2-lambda-iam/2026-01-28-06-09-27.png)
1.  Enter function name: `ServerlessUnicornCustomAnalyticsFunction`

2.  Select **Runtime** as your preferred Node.js version

3.  Under Execution role, select **Use an existing role**

4.  Select the role you just created: `Serverless-CustomizeUnicornDemandRole`
  ![](../img/module-2-lambda-iam/2026-01-28-06-14-15.png)
  ![](../img/module-2-lambda-iam/2026-01-28-06-15-52.png)

68. Click **Create function**

69. Verify the function was created successfully
  ![](../img/module-2-lambda-iam/2026-01-28-06-16-56.png)
70. Confirm that the permission boundary successfully limited the developer's permissions while allowing role creation

---