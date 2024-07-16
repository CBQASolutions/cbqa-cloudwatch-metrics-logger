
# CBQA CloudWatch Logger

This repository provides a `CloudWatchLogger` class for logging custom metrics to AWS CloudWatch. It follows the singleton pattern to ensure only one instance of the logger is used throughout the application.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Initialization](#initialization)

## Installation

To use the `CloudWatchLogger`, you need to install the required AWS SDK package. Use npm or yarn to install the dependency.

```bash
npm install https://github.com/CBQASolutions/cbqa-cloudwatch-metrics-logger
```

```bash
yarn add https://github.com/CBQASolutions/cbqa-cloudwatch-metrics-logger
```

## Initialization

To get the instance of the `CloudWatchLogger`, use the `getInstance` method. This method ensures that only one instance of the logger is created and used throughout your application.

```typescript
import { CloudWatchLogger } from 'cbqa-cloudwatch-metrics-logger';

const logger = CloudWatchLogger.getInstance('us-east-1', 'MyProject', 'development');
```

## Increase Function Metric Count

To log a function invocation metric, use the `increaseFunctionMetricCount` method.

```typescript
try {
  await logger.increaseFunctionMetricCount('myFunctionName');
} catch (error) {
  console.error('Failed to increase function metric count:', error);
}
```

## AWS IAM Permissions Required

The following permissions are required

```bash
cloudwatch:PutMetricData
```