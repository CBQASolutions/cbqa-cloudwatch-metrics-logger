export enum CloudWatchMetricName {
  FUNCTION_INVOCATION = 'FunctionInvocation',
  FUNCTION_ERROR = 'FunctionError',
}

export enum CloudWatchDimensionName {
  FUNCTION_NAME = 'FunctionName',
  ERROR_TYPE = 'ErrorType',
}

export enum CloudWatchDimensionsUnit {
  COUNT = 'Count',
}

export enum CloudWatchStatistics {
  SAMPLE_COUNT = 'SampleCount',
}
