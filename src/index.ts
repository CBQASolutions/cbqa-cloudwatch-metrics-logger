import {
  CloudWatchClient,
  Dimension,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import {
  CloudWatchDimensionName,
  CloudWatchDimensionsUnit,
  CloudWatchMetricName,
} from './enums/enums';
import {
  CustomMetricAndDimensionsException,
  CustomMetricException,
  FunctionErrorMetricException,
  FunctionInvocationMetricException,
} from './exceptions/GeneralException';

/**
 * Singleton class for logging custom metrics to AWS CloudWatch.
 */
export class CloudWatchLogger {
  private static instance: CloudWatchLogger;
  private cloudWatchClient: CloudWatchClient;
  private projectName: string;
  private stage: string;
  private namespace: string;

  private constructor(region: string, projectName: string, stage: string) {
    this.projectName = projectName;
    this.stage = stage;
    this.namespace = `${projectName}/${stage}/Metrics`;
    this.cloudWatchClient = new CloudWatchClient({ region });
  }

  /**
   * Gets the singleton instance of CloudWatchLogger.
   * The final name of namespace will be "{projectName}/{stage}/Metrics"
   *
   * @param {string} [region='us-east-1'] - AWS region.
   * @param {string} [projectName='CustomProjectMetrics'] - Name of the project.
   * @param {string} [stage='development'] - Stage/environment of the project.
   * @returns {CloudWatchLogger} - The singleton instance.
   */
  public static getInstance(
    region: string = 'us-east-1',
    projectName: string = 'CustomProjectMetrics',
    stage: string = 'development'
  ): CloudWatchLogger {
    if (!CloudWatchLogger.instance) {
      CloudWatchLogger.instance = new CloudWatchLogger(
        region,
        projectName,
        stage
      );
    }

    return CloudWatchLogger.instance;
  }

  /**
   * Increases the function invocation metric count by 1.
   *
   * @param {string} functionName - The name of the function.
   * @returns {Promise<void>} - A promise that resolves when the metric is logged.
   * @throws {FunctionInvocationMetricException} - If an error occurs while logging the metric.
   */
  public async increaseFunctionInvocationMetricCount(
    functionName: string
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: CloudWatchMetricName.FUNCTION_INVOCATION,
            Dimensions: [
              {
                Name: CloudWatchDimensionName.FUNCTION_NAME,
                Value: functionName,
              },
            ],
            Value: 1,
            Unit: CloudWatchDimensionsUnit.COUNT,
          },
        ],
        Namespace: `${this.namespace}`,
      });
      await this.cloudWatchClient.send(command);
    } catch (error) {
      throw new FunctionInvocationMetricException(error as Error);
    }
  }

  /**
   * Increases the error metric count by 1.
   *
   * @param {string} functionName - The name of the function.
   * @param {string} errorType - The type of the error.
   * @returns {Promise<void>} - A promise that resolves when the metric is logged.
   * @throws {FunctionErrorMetricException} - If an error occurs while logging the metric.
   */
  public async increaseFunctionErrorMetricCount(
    functionName: string,
    errorType: string
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: CloudWatchMetricName.FUNCTION_ERROR,
            Dimensions: [
              {
                Name: CloudWatchDimensionName.FUNCTION_NAME,
                Value: functionName,
              },
              {
                Name: CloudWatchDimensionName.ERROR_TYPE,
                Value: errorType,
              },
            ],
            Unit: CloudWatchDimensionsUnit.COUNT,
            Value: 1.0,
          },
        ],
        Namespace: `${this.namespace}`,
      });

      await this.cloudWatchClient.send(command);
    } catch (error) {
      throw new FunctionErrorMetricException(error as Error);
    }
  }

  /**
   * Increases a custom metric count by 1 for a specified function.
   *
   * @param {string} functionName - The name of the function.
   * @param {string} metricName - The name of the custom metric.
   * @returns {Promise<void>} - A promise that resolves when the metric is logged.
   * @throws {CustomMetricException} - If an error occurs while logging the metric.
   */
  public async increaseCustomMetricCount(
    functionName: string,
    metricName: string
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: metricName,
            Dimensions: [
              {
                Name: CloudWatchDimensionName.FUNCTION_NAME,
                Value: functionName,
              },
            ],
            Unit: CloudWatchDimensionsUnit.COUNT,
            Value: 1.0,
          },
        ],
        Namespace: `${this.namespace}`,
      });

      await this.cloudWatchClient.send(command);
    } catch (error) {
      throw new CustomMetricException(error as Error);
    }
  }

  /**
   * Increases a custom metric count by 1 with specified dimensions.
   *
   * @param {string} metricName - The name of the custom metric.
   * @param {Dimension[]} dimensions - An array of dimensions for the metric.
   * @returns {Promise<void>} - A promise that resolves when the metric is logged.
   * @throws {CustomMetricAndDimensionsException} - If an error occurs while logging the metric.
   */
  public async increaseCustomMetricAndDimensions(
    metricName: string,
    dimensions: Dimension[]
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: metricName,
            Dimensions: dimensions,
            Unit: CloudWatchDimensionsUnit.COUNT,
            Value: 1.0,
          },
        ],
        Namespace: `${this.namespace}`,
      });

      await this.cloudWatchClient.send(command);
    } catch (error) {
      throw new CustomMetricAndDimensionsException(error as Error);
    }
  }
}
