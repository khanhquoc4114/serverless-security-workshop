# Module 5: Input Validation on API Gateway

## Overview

Input validation is the most critical security control for web applications:

- API Gateway validates requests before invoking Lambda functions
- Failed validation returns 400 Bad Request immediately
- Invalid requests never reach your Lambda function
- Validation results are logged in CloudWatch
- This reduces unnecessary Lambda invocations and costs
- Frees Lambda to focus on business logic rather than input validation

![](../img/module-5-input-validation/2026-01-28-10-53-55.png)

## Requirements for Customization Request

Customization request must include:
- **name**: Customization name (required, string)
- **imageUrl**: URL for cape image (required, valid URL format)
- **sock**: Sock type ID (required, numeric)
- **horn**: Horn ID (required, numeric)
- **glasses**: Glasses ID (required, numeric)
- **cape**: Cape type ID (required, numeric)
- **company**: Company ID (optional, numeric)

![](../img/module-5-input-validation/request-schema.png)

## Module 5A: Create Model

1. Open the [AWS API Gateway Console](https://console.aws.amazon.com/apigateway/home)

2. Click on the **CustomizeUnicorns** API

3. Click on **Models** in the left navigation

4. Click **Create model** button

5. Enter model name: `CustomizationPost`

6. Set Content type: `application/json`

7. In the Model schema field, paste the following JSON schema:

  ```json
  {
    "title": "Customizations",
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "required": ["imageUrl", "sock", "horn", "glasses", "cape", "name"],
    "properties": {
      "imageUrl": {
        "type": "string",
        "title": "The Imageurl Schema",
        "pattern": "^https?:\\/\\/[-a-zA-Z0-9@:%_+.~#?&//=]+$"
      },
      "name": {
        "type": "string",
        "title": "The name Schema",
        "pattern": "^[a-zA-Z0-9- ]+$"
      },
      "sock": {
        "type": "string",
        "title": "The Sock Schema",
        "pattern": "^[0-9]*$"
      },
      "horn": {
        "type": "string",
        "title": "The Horn Schema",
        "pattern": "^[0-9]*$"
      },
      "glasses": {
        "type": "string",
        "title": "The Glasses Schema",
        "pattern": "^[0-9]*$"
      },
      "cape": {
        "type": "string",
        "title": "The Cape Schema",
        "pattern": "^[0-9]*$"
      }
    }
  }
  ```

  ![](../img/module-5-input-validation/2026-01-28-11-41-49.png)

8. Click **Create** button

9. Click on **Resources** in the left navigation

10. Expand **/customizations** and click on **POST** method

11. Click on the **Method Request** tab

12. Click the **Edit** button in the Method execution section

  ![](../img/module-5-input-validation/2026-01-28-11-44-00.png)

13. Under Method request settings, click on **Request validator** dropdown

14. Select **Validate body** as the request validator

15. Click **Request body** to expand that section

16. Click **Add model** button

## Module 5B: Test Valid Request

1. Open the API Client and navigate to the **Module 5: Input Validation** section

2. Click the **Get Access Token** button to retrieve a fresh token

3. Send a valid customization request:

  ```json
{ 
  "name":"Orange-themed unicorn",
  "imageUrl":"https://en.wikipedia.org/wiki/Orange_(fruit)#/media/File:Orange-Whole-%26-Split.jpg",
  "sock":"1",
  "horn":"2",
  "glasses":"3",
  "cape":"2"
}
  ```

  ![](../img/module-5-input-validation/2026-01-28-10-56-14.png)

4. Verify request succeeds with 200 response

  ![](../img/module-5-input-validation/2026-01-28-10-57-10.png)

## Module 5C: Test Invalid Request

1. Try sending an invalid request with SQL injection:

  ```json
{ 
  "name":"Orange-themed unicorn",
  "imageUrl":"https://en.wikipedia.org/wiki/Orange_(fruit)#/media/File:Orange-Whole-%26-Split.jpg",
  "sock":"1",
  "horn":"2",
  "glasses":"3",
  "cape":"2); INSERT INTO Socks (NAME,PRICE) VALUES ('Bad color', 10000.00"
}
  ```

2. Verify request is rejected with validation error

  ![](../img/module-5-input-validation/2026-01-28-10-59-54.png)

17. Set Content type: `application/json`

18. Set Model name: `CustomizationPost`

19. Click the **Save** button
    
  ![](../img/module-5-input-validation/2026-01-28-11-45-37.png)

20.  Click **Deploy API** button at the top right

  ![](../img/module-5-input-validation/2026-01-28-11-46-45.png)

21.  Select `dev` as the Deployment stage
22. Click **Deploy** to confirm

  ![](../img/module-5-input-validation/2026-01-28-11-47-20.png)



23.  Verify the API deployment completed successfully

  ![](../img/module-5-input-validation/2026-01-28-11-48-40.png)


## Module 5B: Testing

### Test 1: Missing Required Fields

1. Send a request with missing `sock` and `horn` fields:

  ```json
  {
    "name": "Cherry-themed unicorn",
    "imageUrl": "https://en.wikipedia.org/wiki/Cherry#/media/File:Cherry_Stella444.jpg",
    "glasses": "3",
    "cape": "4"
  }
  ```

  ![](../img/module-5-input-validation/2026-01-28-12-50-34.png)
  

### Test 2: Invalid URL Format

2. Send a request with an invalid URL format:

  ```json
  {
    "name": "Cherry-themed unicorn",
    "imageUrl": "htt://en.wikipedia.org/wiki/Cherry#/media/File:Cherry_Stella444.jpg",
    "sock": "1",
    "horn": "2",
    "glasses": "3",
    "cape": "4"
  }
  ```
  ![](../img/module-5-input-validation/2026-01-28-12-51-18.png)
  

### Test 3: SQL Injection Attack (Non-Numeric Value in Cape Field)

3. Send a request with a SQL injection payload in the cape field:
  ```json
  {
    "name": "Orange-themed unicorn",
    "imageUrl": "https://en.wikipedia.org/wiki/Orange_(fruit)#/media/File:Orange-Whole-%26-Split.jpg",
    "sock": "1",
    "horn": "2",
    "glasses": "3",
    "cape": "2); INSERT INTO Socks (NAME,PRICE) VALUES ('Bad color', 10000.00"
  }
  ```

  ![](../img/module-5-input-validation/2026-01-28-12-52-05.png)



### Correct parameters

4. Testing the POST /customizations API with right parameters:
  ``` json
  { 
    "name":"Cherry-themed unicorn",
    "imageUrl":"https://en.wikipedia.org/wiki/Cherry#/media/File:Cherry_Stella444.jpg",
    "sock": "1",
    "horn": "2",
    "glasses": "3",
    "cape": "4"
  }
  ```
  ![](../img/module-5-input-validation/2026-01-28-12-55-31.png)

---